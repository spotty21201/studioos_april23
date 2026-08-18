-- Repair the project-creation RPC after the project owner refactor.
-- The 20260803 migration replaced project_owner_id / last_reviewed_at with
-- project_owner_name / project_lead_name, so PostgREST needs a function whose
-- named arguments match the current Server Action payload.

begin;

drop function if exists public.create_project_with_activity(
  text, text, text, uuid, text, text, numeric, text, uuid, text, text,
  date, date, date, uuid, timestamptz
);

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
  p_project_owner_name text default null,
  p_project_lead_name text default null
)
returns public.projects
language plpgsql
security invoker
set search_path = public, pg_temp
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
    project_owner_name,
    project_lead_name
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
    p_project_owner_name,
    p_project_lead_name
  )
  returning * into created_project;

  return created_project;
end;
$$;

revoke all on function public.create_project_with_activity(
  text, text, text, uuid, text, text, numeric, text, uuid, text, text,
  date, date, date, text, text
) from public;

grant execute on function public.create_project_with_activity(
  text, text, text, uuid, text, text, numeric, text, uuid, text, text,
  date, date, date, text, text
) to authenticated;

-- Ensure PostgREST discovers the repaired named-argument signature immediately.
notify pgrst, 'reload schema';

commit;
