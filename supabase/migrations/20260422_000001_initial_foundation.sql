create extension if not exists pgcrypto;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create or replace function public.validate_project_primary_contact()
returns trigger
language plpgsql
as $$
begin
  if new.primary_contact_id is null then
    return new;
  end if;

  if not exists (
    select 1
    from public.client_contacts cc
    where cc.id = new.primary_contact_id
      and cc.client_id = new.client_id
  ) then
    raise exception
      using
        errcode = '23514',
        message = 'primary_contact_id must belong to the same client as projects.client_id';
  end if;

  return new;
end;
$$;

create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text unique not null,
  full_name text not null,
  role text not null check (
    role in ('principal', 'director', 'senior_associate', 'operations', 'team_member')
  ),
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.studio_profile (
  id uuid primary key default gen_random_uuid(),
  studio_name text not null,
  default_currency text not null default 'IDR',
  timezone text not null default 'Asia/Jakarta',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.clients (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  industry text,
  city text,
  country text,
  website text,
  notes text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  created_by uuid references public.profiles (id),
  updated_by uuid references public.profiles (id)
);

create table if not exists public.client_contacts (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references public.clients (id) on delete cascade,
  full_name text not null,
  job_title text,
  email text,
  phone text,
  is_primary boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  created_by uuid references public.profiles (id),
  updated_by uuid references public.profiles (id)
);

create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  project_code text unique not null,
  name text not null,
  slug text unique not null,
  client_id uuid not null references public.clients (id),
  primary_contact_id uuid references public.client_contacts (id),
  lifecycle_status text not null check (
    lifecycle_status in ('proposal', 'active', 'on_hold', 'completed', 'cancelled')
  ),
  health_status text not null check (
    health_status in ('on_track', 'watch', 'at_risk')
  ),
  summary text,
  location text,
  start_date date,
  target_end_date date,
  completed_at date,
  contract_value numeric(14, 2) not null default 0,
  currency text not null default 'IDR',
  project_owner_id uuid references public.profiles (id),
  last_reviewed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  created_by uuid references public.profiles (id),
  updated_by uuid references public.profiles (id)
);

create table if not exists public.vendors (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  service_type text,
  contact_name text,
  email text,
  phone text,
  notes text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  created_by uuid references public.profiles (id),
  updated_by uuid references public.profiles (id)
);

create table if not exists public.invoices (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects (id) on delete cascade,
  client_id uuid not null references public.clients (id),
  invoice_number text not null,
  title text not null,
  issued_date date,
  due_date date,
  invoice_amount numeric(14, 2) not null,
  status text not null check (
    status in ('draft', 'issued', 'paid', 'overdue', 'cancelled')
  ),
  paid_at date,
  tax_percentage numeric(5, 2),
  tax_amount numeric(14, 2) not null default 0,
  tax_status text not null default 'not_applicable' check (
    tax_status in ('not_applicable', 'unpaid', 'paid')
  ),
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  created_by uuid references public.profiles (id),
  updated_by uuid references public.profiles (id),
  unique (project_id, invoice_number)
);

create table if not exists public.vendor_obligations (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects (id) on delete cascade,
  vendor_id uuid not null references public.vendors (id),
  title text not null,
  description text,
  due_date date,
  amount numeric(14, 2) not null,
  status text not null check (
    status in ('planned', 'due', 'paid', 'overdue', 'cancelled')
  ),
  paid_at date,
  tax_percentage numeric(5, 2),
  tax_amount numeric(14, 2) not null default 0,
  tax_status text not null default 'not_applicable' check (
    tax_status in ('not_applicable', 'unpaid', 'paid')
  ),
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  created_by uuid references public.profiles (id),
  updated_by uuid references public.profiles (id)
);

create table if not exists public.documents (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects (id) on delete cascade,
  title text not null,
  category text not null check (
    category in (
      'proposal',
      'contract',
      'client_document',
      'deliverable',
      'support_document',
      'invoice_attachment',
      'vendor_attachment'
    )
  ),
  source_type text not null check (source_type in ('file', 'external_link')),
  file_path text,
  external_url text,
  linked_entity_type text check (
    linked_entity_type in ('project', 'invoice', 'vendor_obligation')
  ),
  linked_entity_id uuid,
  document_date date,
  description text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  created_by uuid references public.profiles (id),
  updated_by uuid references public.profiles (id),
  check (
    (file_path is not null and external_url is null)
    or (file_path is null and external_url is not null)
  )
);

create table if not exists public.notes (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects (id) on delete cascade,
  author_id uuid not null references public.profiles (id),
  title text,
  body text not null,
  note_type text not null check (
    note_type in (
      'meeting_note',
      'agreement',
      'issue',
      'reminder',
      'follow_up',
      'decision'
    )
  ),
  linked_entity_type text check (
    linked_entity_type in ('project', 'invoice', 'vendor_obligation', 'document')
  ),
  linked_entity_id uuid,
  noted_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  created_by uuid references public.profiles (id),
  updated_by uuid references public.profiles (id)
);

create table if not exists public.activity_events (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects (id) on delete cascade,
  actor_id uuid references public.profiles (id),
  event_type text not null check (
    event_type in (
      'project_created',
      'project_updated',
      'project_status_changed',
      'invoice_created',
      'invoice_updated',
      'invoice_status_changed',
      'vendor_obligation_created',
      'vendor_obligation_updated',
      'vendor_obligation_status_changed',
      'document_added',
      'document_updated',
      'note_created',
      'note_updated'
    )
  ),
  entity_type text not null check (
    entity_type in ('project', 'invoice', 'vendor_obligation', 'document', 'note')
  ),
  entity_id uuid not null,
  summary text not null,
  metadata jsonb not null default '{}'::jsonb,
  occurred_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create or replace view public.project_finance_summary_v as
with invoice_summary as (
  select
    project_id,
    coalesce(sum(invoice_amount), 0) as total_invoiced,
    coalesce(sum(invoice_amount) filter (where status = 'paid'), 0) as total_paid,
    coalesce(sum(invoice_amount) filter (where status in ('issued', 'overdue')), 0) as outstanding_receivable,
    coalesce(sum(tax_amount) filter (where tax_status = 'unpaid'), 0) as unpaid_invoice_tax
  from public.invoices
  group by project_id
),
vendor_summary as (
  select
    project_id,
    coalesce(sum(amount), 0) as total_vendor_value,
    coalesce(sum(amount) filter (where status = 'paid'), 0) as total_vendor_paid,
    coalesce(sum(amount) filter (where status in ('due', 'overdue')), 0) as outstanding_payable,
    coalesce(sum(tax_amount) filter (where tax_status = 'unpaid'), 0) as unpaid_vendor_tax
  from public.vendor_obligations
  group by project_id
)
select
  p.id as project_id,
  p.contract_value,
  coalesce(i.total_invoiced, 0) as total_invoiced,
  coalesce(i.total_paid, 0) as total_paid,
  coalesce(i.outstanding_receivable, 0) as outstanding_receivable,
  coalesce(v.total_vendor_value, 0) as total_vendor_value,
  coalesce(v.total_vendor_paid, 0) as total_vendor_paid,
  coalesce(v.outstanding_payable, 0) as outstanding_payable,
  coalesce(i.unpaid_invoice_tax, 0) + coalesce(v.unpaid_vendor_tax, 0) as total_tax_unpaid
from public.projects p
left join invoice_summary i on i.project_id = p.id
left join vendor_summary v on v.project_id = p.id;

create or replace view public.project_attention_v as
select
  p.id as project_id,
  exists (
    select 1 from public.invoices i
    where i.project_id = p.id and i.status = 'overdue'
  ) as has_overdue_invoice,
  exists (
    select 1 from public.vendor_obligations vo
    where vo.project_id = p.id and vo.status = 'overdue'
  ) as has_unpaid_vendor,
  false as has_missing_documents,
  (p.last_reviewed_at is null or p.last_reviewed_at < now() - interval '14 days') as is_stale
from public.projects p;

create or replace view public.project_attention_items_v as
with overdue_invoice_items as (
  select distinct on (i.project_id)
    i.project_id,
    p.project_code,
    p.name as project_name,
    c.name as client_name,
    'overdue_invoice'::text as attention_label,
    case
      when coalesce(i.invoice_number, '') <> '' then
        'Invoice ' || i.invoice_number || ' is overdue and needs receivable follow-up.'
      else
        'An invoice is overdue and needs receivable follow-up.'
    end as attention_summary,
    coalesce(i.updated_at, i.created_at) as created_at
  from public.invoices i
  join public.projects p on p.id = i.project_id
  join public.clients c on c.id = p.client_id
  where i.status = 'overdue'
  order by i.project_id, i.due_date asc nulls last, i.updated_at desc, i.created_at desc
),
overdue_vendor_items as (
  select distinct on (vo.project_id)
    vo.project_id,
    p.project_code,
    p.name as project_name,
    c.name as client_name,
    'unpaid_vendor'::text as attention_label,
    case
      when coalesce(vo.title, '') <> '' then
        vo.title || ' is overdue and needs vendor payment follow-up.'
      else
        'A vendor obligation is overdue and needs vendor payment follow-up.'
    end as attention_summary,
    coalesce(vo.updated_at, vo.created_at) as created_at
  from public.vendor_obligations vo
  join public.projects p on p.id = vo.project_id
  join public.clients c on c.id = p.client_id
  where vo.status = 'overdue'
  order by vo.project_id, vo.due_date asc nulls last, vo.updated_at desc, vo.created_at desc
)
select
  p.id::text || ':watch' as attention_item_id,
  p.id as project_id,
  p.project_code,
  p.name as project_name,
  c.name as client_name,
  'watch'::text as attention_label,
  'Project health is watch and should be reviewed by leadership.'::text as attention_summary,
  p.updated_at as created_at
from public.projects p
join public.clients c on c.id = p.client_id
where p.health_status = 'watch'

union all

select
  p.id::text || ':at_risk' as attention_item_id,
  p.id as project_id,
  p.project_code,
  p.name as project_name,
  c.name as client_name,
  'at_risk'::text as attention_label,
  'Project health is at risk and needs immediate leadership attention.'::text as attention_summary,
  p.updated_at as created_at
from public.projects p
join public.clients c on c.id = p.client_id
where p.health_status = 'at_risk'

union all

select
  oi.project_id::text || ':overdue_invoice' as attention_item_id,
  oi.project_id,
  oi.project_code,
  oi.project_name,
  oi.client_name,
  oi.attention_label,
  oi.attention_summary,
  oi.created_at
from overdue_invoice_items oi

union all

select
  ov.project_id::text || ':unpaid_vendor' as attention_item_id,
  ov.project_id,
  ov.project_code,
  ov.project_name,
  ov.client_name,
  ov.attention_label,
  ov.attention_summary,
  ov.created_at
from overdue_vendor_items ov

union all

select
  p.id::text || ':stale_review' as attention_item_id,
  p.id as project_id,
  p.project_code,
  p.name as project_name,
  c.name as client_name,
  'stale_review'::text as attention_label,
  'Project review is stale and should be refreshed in the next leadership check.'::text as attention_summary,
  coalesce(p.last_reviewed_at, p.updated_at, p.created_at) as created_at
from public.projects p
join public.clients c on c.id = p.client_id
where p.last_reviewed_at is null
   or p.last_reviewed_at < now() - interval '14 days';

create or replace view public.project_attention_summary_v as
with attention_counts as (
  select
    project_id,
    count(*) as attention_count
  from public.project_attention_items_v
  group by project_id
)
select
  p.id as project_id,
  coalesce(ac.attention_count, 0) as attention_count,
  coalesce(ac.attention_count, 0) > 0 as needs_attention
from public.projects p
left join attention_counts ac on ac.project_id = p.id;

create or replace view public.finance_overview_v as
select
  coalesce(sum(contract_value), 0) as contract_value_total,
  coalesce(sum(total_invoiced), 0) as total_invoiced,
  coalesce(sum(total_paid), 0) as total_paid,
  coalesce(sum(outstanding_receivable), 0) as outstanding_receivable,
  coalesce(sum(outstanding_payable), 0) as outstanding_payable,
  coalesce(sum(total_tax_unpaid), 0) as unpaid_tax_total
from public.project_finance_summary_v;

create or replace view public.dashboard_snapshot_v as
select
  count(*) filter (where lifecycle_status = 'active') as active_projects,
  count(*) filter (where pas.needs_attention) as projects_needing_attention
from public.projects p
left join public.project_attention_summary_v pas on pas.project_id = p.id;

drop trigger if exists set_profiles_updated_at on public.profiles;
create trigger set_profiles_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

drop trigger if exists set_studio_profile_updated_at on public.studio_profile;
create trigger set_studio_profile_updated_at
before update on public.studio_profile
for each row execute function public.set_updated_at();

drop trigger if exists set_clients_updated_at on public.clients;
create trigger set_clients_updated_at
before update on public.clients
for each row execute function public.set_updated_at();

drop trigger if exists set_client_contacts_updated_at on public.client_contacts;
create trigger set_client_contacts_updated_at
before update on public.client_contacts
for each row execute function public.set_updated_at();

drop trigger if exists set_projects_updated_at on public.projects;
create trigger set_projects_updated_at
before update on public.projects
for each row execute function public.set_updated_at();

drop trigger if exists validate_projects_primary_contact on public.projects;
create trigger validate_projects_primary_contact
before insert or update of client_id, primary_contact_id on public.projects
for each row execute function public.validate_project_primary_contact();

drop trigger if exists set_vendors_updated_at on public.vendors;
create trigger set_vendors_updated_at
before update on public.vendors
for each row execute function public.set_updated_at();

drop trigger if exists set_invoices_updated_at on public.invoices;
create trigger set_invoices_updated_at
before update on public.invoices
for each row execute function public.set_updated_at();

drop trigger if exists set_vendor_obligations_updated_at on public.vendor_obligations;
create trigger set_vendor_obligations_updated_at
before update on public.vendor_obligations
for each row execute function public.set_updated_at();

drop trigger if exists set_documents_updated_at on public.documents;
create trigger set_documents_updated_at
before update on public.documents
for each row execute function public.set_updated_at();

drop trigger if exists set_notes_updated_at on public.notes;
create trigger set_notes_updated_at
before update on public.notes
for each row execute function public.set_updated_at();

drop trigger if exists set_activity_events_updated_at on public.activity_events;
create trigger set_activity_events_updated_at
before update on public.activity_events
for each row execute function public.set_updated_at();
