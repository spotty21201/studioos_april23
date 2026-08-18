-- Repair the project-update RPC after the project owner refactor.
-- The original function still assigned project_owner_id and last_reviewed_at,
-- both of which were removed by the 20260803 migration.

begin;

create or replace function public.update_project_with_activity(
  p_project_id uuid,
  p_patch jsonb
)
returns public.projects
language plpgsql
security invoker
set search_path = public, pg_temp
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
    project_owner_name = case
      when p_patch ? 'project_owner_name' then nullif(p_patch ->> 'project_owner_name', '')
      else project_owner_name
    end,
    project_lead_name = case
      when p_patch ? 'project_lead_name' then nullif(p_patch ->> 'project_lead_name', '')
      else project_lead_name
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

revoke all on function public.update_project_with_activity(uuid, jsonb) from public;
grant execute on function public.update_project_with_activity(uuid, jsonb) to authenticated;

notify pgrst, 'reload schema';

commit;
