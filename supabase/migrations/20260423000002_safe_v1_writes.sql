create or replace function public.current_user_is_active()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.profiles p
    where p.id = auth.uid()
      and p.is_active = true
  );
$$;

create or replace function public.set_auth_audit_fields()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  if tg_op = 'INSERT' then
    if auth.uid() is not null then
      new.created_by = auth.uid();
      new.updated_by = auth.uid();
    else
      new.updated_by = coalesce(new.updated_by, new.created_by);
    end if;

    return new;
  end if;

  new.created_by = old.created_by;

  if auth.uid() is not null then
    new.updated_by = auth.uid();
  end if;

  return new;
end;
$$;

create or replace function public.set_auth_note_author()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  if tg_op = 'INSERT' then
    if auth.uid() is not null then
      new.author_id = auth.uid();
    end if;

    return new;
  end if;

  new.author_id = old.author_id;
  return new;
end;
$$;

create or replace function public.set_auth_activity_actor()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  if tg_op = 'INSERT' and auth.uid() is not null then
    new.actor_id = auth.uid();
  elsif tg_op = 'UPDATE' then
    new.actor_id = old.actor_id;
  end if;

  return new;
end;
$$;

create or replace function public.record_core_activity_event()
returns trigger
language plpgsql
set search_path = public
as $$
declare
  target_project_id uuid;
  target_entity_type text;
  target_event_type text;
  target_entity_id uuid;
  target_summary text;
  target_metadata jsonb;
begin
  if tg_table_name = 'projects' then
    target_project_id := new.id;
    target_entity_type := 'project';
    target_entity_id := new.id;

    if tg_op = 'INSERT' then
      target_event_type := 'project_created';
      target_summary := 'Project created: ' || new.name;
    elsif old.lifecycle_status is distinct from new.lifecycle_status
       or old.health_status is distinct from new.health_status then
      target_event_type := 'project_status_changed';
      target_summary := 'Project status updated: ' || new.name;
    else
      target_event_type := 'project_updated';
      target_summary := 'Project updated: ' || new.name;
    end if;

    target_metadata := jsonb_build_object(
      'project_code', new.project_code,
      'lifecycle_status', new.lifecycle_status,
      'health_status', new.health_status
    );
  elsif tg_table_name = 'invoices' then
    target_project_id := new.project_id;
    target_entity_type := 'invoice';
    target_entity_id := new.id;

    if tg_op = 'INSERT' then
      target_event_type := 'invoice_created';
      target_summary := 'Invoice created: ' || new.invoice_number;
    elsif old.status is distinct from new.status then
      target_event_type := 'invoice_status_changed';
      target_summary := 'Invoice status updated: ' || new.invoice_number;
    else
      target_event_type := 'invoice_updated';
      target_summary := 'Invoice updated: ' || new.invoice_number;
    end if;

    target_metadata := jsonb_build_object(
      'invoice_number', new.invoice_number,
      'status', new.status,
      'invoice_amount', new.invoice_amount
    );
  elsif tg_table_name = 'vendor_obligations' then
    target_project_id := new.project_id;
    target_entity_type := 'vendor_obligation';
    target_entity_id := new.id;

    if tg_op = 'INSERT' then
      target_event_type := 'vendor_obligation_created';
      target_summary := 'Vendor obligation created: ' || new.title;
    elsif old.status is distinct from new.status then
      target_event_type := 'vendor_obligation_status_changed';
      target_summary := 'Vendor obligation status updated: ' || new.title;
    else
      target_event_type := 'vendor_obligation_updated';
      target_summary := 'Vendor obligation updated: ' || new.title;
    end if;

    target_metadata := jsonb_build_object(
      'status', new.status,
      'amount', new.amount,
      'vendor_id', new.vendor_id
    );
  elsif tg_table_name = 'documents' then
    target_project_id := new.project_id;
    target_entity_type := 'document';
    target_entity_id := new.id;
    target_event_type := case when tg_op = 'INSERT' then 'document_added' else 'document_updated' end;
    target_summary := case
      when tg_op = 'INSERT' then 'Document added: ' || new.title
      else 'Document updated: ' || new.title
    end;
    target_metadata := jsonb_build_object(
      'category', new.category,
      'source_type', new.source_type
    );
  elsif tg_table_name = 'notes' then
    target_project_id := new.project_id;
    target_entity_type := 'note';
    target_entity_id := new.id;
    target_event_type := case when tg_op = 'INSERT' then 'note_created' else 'note_updated' end;
    target_summary := case
      when tg_op = 'INSERT' then 'Note added'
      else 'Note updated'
    end;
    target_metadata := jsonb_build_object(
      'note_type', new.note_type,
      'title', new.title
    );
  else
    return new;
  end if;

  insert into public.activity_events (
    project_id,
    actor_id,
    event_type,
    entity_type,
    entity_id,
    summary,
    metadata
  )
  values (
    target_project_id,
    auth.uid(),
    target_event_type,
    target_entity_type,
    target_entity_id,
    target_summary,
    target_metadata
  );

  return new;
end;
$$;

create or replace function public.create_project_with_activity(
  p_project_code text,
  p_name text,
  p_slug text,
  p_client_id uuid,
  p_lifecycle_status text default 'proposal',
  p_health_status text default 'on_track',
  p_contract_value numeric default 0,
  p_currency text default 'IDR',
  p_primary_contact_id uuid default null,
  p_summary text default null,
  p_location text default null,
  p_start_date date default null,
  p_target_end_date date default null,
  p_completed_at date default null,
  p_project_owner_id uuid default null,
  p_last_reviewed_at timestamptz default null
)
returns public.projects
language plpgsql
security invoker
set search_path = public
as $$
declare
  created_project public.projects;
begin
  if not public.current_user_is_active() then
    raise exception using
      errcode = '42501',
      message = 'Only active authenticated users can create projects.';
  end if;

  insert into public.projects (
    project_code,
    name,
    slug,
    client_id,
    primary_contact_id,
    lifecycle_status,
    health_status,
    summary,
    location,
    start_date,
    target_end_date,
    completed_at,
    contract_value,
    currency,
    project_owner_id,
    last_reviewed_at
  )
  values (
    p_project_code,
    p_name,
    p_slug,
    p_client_id,
    p_primary_contact_id,
    p_lifecycle_status,
    p_health_status,
    p_summary,
    p_location,
    p_start_date,
    p_target_end_date,
    p_completed_at,
    p_contract_value,
    p_currency,
    p_project_owner_id,
    p_last_reviewed_at
  )
  returning * into created_project;

  return created_project;
end;
$$;

create or replace function public.update_project_with_activity(
  p_project_id uuid,
  p_patch jsonb
)
returns public.projects
language plpgsql
security invoker
set search_path = public
as $$
declare
  updated_project public.projects;
begin
  if not public.current_user_is_active() then
    raise exception using
      errcode = '42501',
      message = 'Only active authenticated users can update projects.';
  end if;

  update public.projects
  set
    project_code = coalesce(p_patch ->> 'project_code', project_code),
    name = coalesce(p_patch ->> 'name', name),
    slug = coalesce(p_patch ->> 'slug', slug),
    client_id = coalesce((p_patch ->> 'client_id')::uuid, client_id),
    primary_contact_id = case
      when p_patch ? 'primary_contact_id' then nullif(p_patch ->> 'primary_contact_id', '')::uuid
      else primary_contact_id
    end,
    lifecycle_status = coalesce(p_patch ->> 'lifecycle_status', lifecycle_status),
    health_status = coalesce(p_patch ->> 'health_status', health_status),
    summary = case when p_patch ? 'summary' then p_patch ->> 'summary' else summary end,
    location = case when p_patch ? 'location' then p_patch ->> 'location' else location end,
    start_date = case
      when p_patch ? 'start_date' then nullif(p_patch ->> 'start_date', '')::date
      else start_date
    end,
    target_end_date = case
      when p_patch ? 'target_end_date' then nullif(p_patch ->> 'target_end_date', '')::date
      else target_end_date
    end,
    completed_at = case
      when p_patch ? 'completed_at' then nullif(p_patch ->> 'completed_at', '')::date
      else completed_at
    end,
    contract_value = coalesce((p_patch ->> 'contract_value')::numeric, contract_value),
    currency = coalesce(p_patch ->> 'currency', currency),
    project_owner_id = case
      when p_patch ? 'project_owner_id' then nullif(p_patch ->> 'project_owner_id', '')::uuid
      else project_owner_id
    end,
    last_reviewed_at = case
      when p_patch ? 'last_reviewed_at' then nullif(p_patch ->> 'last_reviewed_at', '')::timestamptz
      else last_reviewed_at
    end
  where id = p_project_id
  returning * into updated_project;

  if updated_project.id is null then
    raise exception using
      errcode = 'P0002',
      message = 'Project not found or not writable.';
  end if;

  return updated_project;
end;
$$;

create or replace function public.create_note_with_activity(
  p_project_id uuid,
  p_body text,
  p_note_type text default 'meeting_note',
  p_title text default null,
  p_linked_entity_type text default null,
  p_linked_entity_id uuid default null,
  p_noted_at timestamptz default null
)
returns public.notes
language plpgsql
security invoker
set search_path = public
as $$
declare
  created_note public.notes;
begin
  if not public.current_user_is_active() then
    raise exception using
      errcode = '42501',
      message = 'Only active authenticated users can create notes.';
  end if;

  insert into public.notes (
    project_id,
    author_id,
    title,
    body,
    note_type,
    linked_entity_type,
    linked_entity_id,
    noted_at
  )
  values (
    p_project_id,
    auth.uid(),
    p_title,
    p_body,
    p_note_type,
    p_linked_entity_type,
    p_linked_entity_id,
    coalesce(p_noted_at, now())
  )
  returning * into created_note;

  return created_note;
end;
$$;

do $$
declare
  target_table regclass;
begin
  foreach target_table in array array[
    'public.clients'::regclass,
    'public.client_contacts'::regclass,
    'public.projects'::regclass,
    'public.vendors'::regclass,
    'public.invoices'::regclass,
    'public.vendor_obligations'::regclass,
    'public.documents'::regclass,
    'public.notes'::regclass,
    'public.activity_events'::regclass,
    'public.profiles'::regclass,
    'public.studio_profile'::regclass
  ]
  loop
    execute format('alter table %s enable row level security', target_table);
  end loop;
end;
$$;

drop trigger if exists set_clients_auth_audit_fields on public.clients;
create trigger set_clients_auth_audit_fields
before insert or update on public.clients
for each row execute function public.set_auth_audit_fields();

drop trigger if exists set_client_contacts_auth_audit_fields on public.client_contacts;
create trigger set_client_contacts_auth_audit_fields
before insert or update on public.client_contacts
for each row execute function public.set_auth_audit_fields();

drop trigger if exists set_projects_auth_audit_fields on public.projects;
create trigger set_projects_auth_audit_fields
before insert or update on public.projects
for each row execute function public.set_auth_audit_fields();

drop trigger if exists set_vendors_auth_audit_fields on public.vendors;
create trigger set_vendors_auth_audit_fields
before insert or update on public.vendors
for each row execute function public.set_auth_audit_fields();

drop trigger if exists set_invoices_auth_audit_fields on public.invoices;
create trigger set_invoices_auth_audit_fields
before insert or update on public.invoices
for each row execute function public.set_auth_audit_fields();

drop trigger if exists set_vendor_obligations_auth_audit_fields on public.vendor_obligations;
create trigger set_vendor_obligations_auth_audit_fields
before insert or update on public.vendor_obligations
for each row execute function public.set_auth_audit_fields();

drop trigger if exists set_documents_auth_audit_fields on public.documents;
create trigger set_documents_auth_audit_fields
before insert or update on public.documents
for each row execute function public.set_auth_audit_fields();

drop trigger if exists set_notes_auth_audit_fields on public.notes;
create trigger set_notes_auth_audit_fields
before insert or update on public.notes
for each row execute function public.set_auth_audit_fields();

drop trigger if exists set_notes_auth_author on public.notes;
create trigger set_notes_auth_author
before insert or update on public.notes
for each row execute function public.set_auth_note_author();

drop trigger if exists set_activity_events_auth_actor on public.activity_events;
create trigger set_activity_events_auth_actor
before insert or update on public.activity_events
for each row execute function public.set_auth_activity_actor();

drop trigger if exists record_projects_activity_event on public.projects;
create trigger record_projects_activity_event
after insert or update on public.projects
for each row execute function public.record_core_activity_event();

drop trigger if exists record_invoices_activity_event on public.invoices;
create trigger record_invoices_activity_event
after insert or update on public.invoices
for each row execute function public.record_core_activity_event();

drop trigger if exists record_vendor_obligations_activity_event on public.vendor_obligations;
create trigger record_vendor_obligations_activity_event
after insert or update on public.vendor_obligations
for each row execute function public.record_core_activity_event();

drop trigger if exists record_documents_activity_event on public.documents;
create trigger record_documents_activity_event
after insert or update on public.documents
for each row execute function public.record_core_activity_event();

drop trigger if exists record_notes_activity_event on public.notes;
create trigger record_notes_activity_event
after insert or update on public.notes
for each row execute function public.record_core_activity_event();

alter view public.project_finance_summary_v set (security_invoker = true);
alter view public.project_attention_v set (security_invoker = true);
alter view public.project_attention_items_v set (security_invoker = true);
alter view public.project_attention_summary_v set (security_invoker = true);
alter view public.finance_overview_v set (security_invoker = true);
alter view public.dashboard_snapshot_v set (security_invoker = true);

revoke all on table
  public.profiles,
  public.studio_profile,
  public.clients,
  public.client_contacts,
  public.projects,
  public.vendors,
  public.invoices,
  public.vendor_obligations,
  public.documents,
  public.notes,
  public.activity_events
from anon;

revoke delete on table
  public.clients,
  public.client_contacts,
  public.projects,
  public.vendors,
  public.invoices,
  public.vendor_obligations,
  public.documents,
  public.notes,
  public.activity_events
from authenticated;

grant select on table public.profiles, public.studio_profile to authenticated;
grant select, insert, update on table
  public.clients,
  public.client_contacts,
  public.projects,
  public.vendors,
  public.invoices,
  public.vendor_obligations,
  public.documents,
  public.notes
to authenticated;
grant select, insert on table public.activity_events to authenticated;

grant select on table
  public.project_finance_summary_v,
  public.project_attention_v,
  public.project_attention_items_v,
  public.project_attention_summary_v,
  public.finance_overview_v,
  public.dashboard_snapshot_v
to authenticated;

revoke all on function public.current_user_is_active() from public;
revoke all on function public.create_project_with_activity(
  text, text, text, uuid, text, text, numeric, text, uuid, text, text, date, date, date, uuid, timestamptz
) from public;
revoke all on function public.update_project_with_activity(uuid, jsonb) from public;
revoke all on function public.create_note_with_activity(
  uuid, text, text, text, text, uuid, timestamptz
) from public;

grant execute on function public.current_user_is_active() to authenticated;
grant execute on function public.create_project_with_activity(
  text, text, text, uuid, text, text, numeric, text, uuid, text, text, date, date, date, uuid, timestamptz
) to authenticated;
grant execute on function public.update_project_with_activity(uuid, jsonb) to authenticated;
grant execute on function public.create_note_with_activity(
  uuid, text, text, text, text, uuid, timestamptz
) to authenticated;

drop policy if exists profiles_select_active_directory on public.profiles;
create policy profiles_select_active_directory
on public.profiles
for select
to authenticated
using (public.current_user_is_active() and is_active = true);

drop policy if exists studio_profile_select_active_users on public.studio_profile;
create policy studio_profile_select_active_users
on public.studio_profile
for select
to authenticated
using (public.current_user_is_active());

drop policy if exists clients_select_active_users on public.clients;
create policy clients_select_active_users
on public.clients
for select
to authenticated
using (public.current_user_is_active());

drop policy if exists clients_insert_active_users on public.clients;
create policy clients_insert_active_users
on public.clients
for insert
to authenticated
with check (public.current_user_is_active());

drop policy if exists clients_update_active_users on public.clients;
create policy clients_update_active_users
on public.clients
for update
to authenticated
using (public.current_user_is_active())
with check (public.current_user_is_active());

drop policy if exists client_contacts_select_active_users on public.client_contacts;
create policy client_contacts_select_active_users
on public.client_contacts
for select
to authenticated
using (public.current_user_is_active());

drop policy if exists client_contacts_insert_active_users on public.client_contacts;
create policy client_contacts_insert_active_users
on public.client_contacts
for insert
to authenticated
with check (public.current_user_is_active());

drop policy if exists client_contacts_update_active_users on public.client_contacts;
create policy client_contacts_update_active_users
on public.client_contacts
for update
to authenticated
using (public.current_user_is_active())
with check (public.current_user_is_active());

drop policy if exists projects_select_active_users on public.projects;
create policy projects_select_active_users
on public.projects
for select
to authenticated
using (public.current_user_is_active());

drop policy if exists projects_insert_active_users on public.projects;
create policy projects_insert_active_users
on public.projects
for insert
to authenticated
with check (public.current_user_is_active());

drop policy if exists projects_update_active_users on public.projects;
create policy projects_update_active_users
on public.projects
for update
to authenticated
using (public.current_user_is_active())
with check (public.current_user_is_active());

drop policy if exists vendors_select_active_users on public.vendors;
create policy vendors_select_active_users
on public.vendors
for select
to authenticated
using (public.current_user_is_active());

drop policy if exists vendors_insert_active_users on public.vendors;
create policy vendors_insert_active_users
on public.vendors
for insert
to authenticated
with check (public.current_user_is_active());

drop policy if exists vendors_update_active_users on public.vendors;
create policy vendors_update_active_users
on public.vendors
for update
to authenticated
using (public.current_user_is_active())
with check (public.current_user_is_active());

drop policy if exists invoices_select_active_users on public.invoices;
create policy invoices_select_active_users
on public.invoices
for select
to authenticated
using (public.current_user_is_active());

drop policy if exists invoices_insert_active_users on public.invoices;
create policy invoices_insert_active_users
on public.invoices
for insert
to authenticated
with check (public.current_user_is_active());

drop policy if exists invoices_update_active_users on public.invoices;
create policy invoices_update_active_users
on public.invoices
for update
to authenticated
using (public.current_user_is_active())
with check (public.current_user_is_active());

drop policy if exists vendor_obligations_select_active_users on public.vendor_obligations;
create policy vendor_obligations_select_active_users
on public.vendor_obligations
for select
to authenticated
using (public.current_user_is_active());

drop policy if exists vendor_obligations_insert_active_users on public.vendor_obligations;
create policy vendor_obligations_insert_active_users
on public.vendor_obligations
for insert
to authenticated
with check (public.current_user_is_active());

drop policy if exists vendor_obligations_update_active_users on public.vendor_obligations;
create policy vendor_obligations_update_active_users
on public.vendor_obligations
for update
to authenticated
using (public.current_user_is_active())
with check (public.current_user_is_active());

drop policy if exists documents_select_active_users on public.documents;
create policy documents_select_active_users
on public.documents
for select
to authenticated
using (public.current_user_is_active());

drop policy if exists documents_insert_active_users on public.documents;
create policy documents_insert_active_users
on public.documents
for insert
to authenticated
with check (public.current_user_is_active());

drop policy if exists documents_update_active_users on public.documents;
create policy documents_update_active_users
on public.documents
for update
to authenticated
using (public.current_user_is_active())
with check (public.current_user_is_active());

drop policy if exists notes_select_active_users on public.notes;
create policy notes_select_active_users
on public.notes
for select
to authenticated
using (public.current_user_is_active());

drop policy if exists notes_insert_active_users on public.notes;
create policy notes_insert_active_users
on public.notes
for insert
to authenticated
with check (public.current_user_is_active());

drop policy if exists notes_update_active_users on public.notes;
create policy notes_update_active_users
on public.notes
for update
to authenticated
using (public.current_user_is_active())
with check (public.current_user_is_active());

drop policy if exists activity_events_select_active_users on public.activity_events;
create policy activity_events_select_active_users
on public.activity_events
for select
to authenticated
using (public.current_user_is_active());

drop policy if exists activity_events_insert_active_users on public.activity_events;
create policy activity_events_insert_active_users
on public.activity_events
for insert
to authenticated
with check (public.current_user_is_active());
