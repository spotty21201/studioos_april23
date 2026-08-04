-- Migration: Project owner refactor, review removal, soft-delete, attention views overhaul
-- Date: 2026-08-03
-- Context: Human testing feedback — simplify owner roles, remove confusing Mark Reviewed, add archive support, use updated_at staleness

BEGIN;

-- ============================================
-- 1. RENAME PROJECT OWNER ID to two text fields
-- ============================================
ALTER TABLE public.projects ADD COLUMN project_owner_name text;
ALTER TABLE public.projects ADD COLUMN project_lead_name text;

UPDATE public.projects p
SET project_owner_name = pr.full_name
FROM public.profiles pr
WHERE p.project_owner_id = pr.id AND pr.full_name IS NOT NULL;

ALTER TABLE public.projects DROP CONSTRAINT projects_project_owner_id_fkey;
ALTER TABLE public.projects DROP COLUMN project_owner_id;

-- ============================================
-- 2. REMOVE last_reviewed_at (review concept)
-- ============================================
ALTER TABLE public.projects DROP COLUMN last_reviewed_at;

-- ============================================
-- 3. SOFT-DELETE: add is_archived flag
-- ============================================
ALTER TABLE public.projects ADD COLUMN is_archived boolean NOT NULL DEFAULT false;

-- Archive any completed or cancelled projects automatically
UPDATE public.projects SET is_archived = true 
WHERE lifecycle_status IN ('completed', 'cancelled');

-- ============================================
-- 4. RECREATE ATTENTION VIEWS (without last_reviewed_at, with archive filtering)
-- ============================================
DROP VIEW IF EXISTS public.project_attention_v CASCADE;
DROP VIEW IF EXISTS public.project_attention_items_v CASCADE;
DROP VIEW IF EXISTS public.project_attention_summary_v CASCADE;
DROP VIEW IF EXISTS public.dashboard_snapshot_v CASCADE;

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
  -- Changed: derived from updated_at instead of last_reviewed_at
  (p.lifecycle_status = 'active'
   and p.is_archived = false
   and p.updated_at < now() - interval '14 days'
  ) as is_stale
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
-- Health-based attention items
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
and p.is_archived = false

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
and p.is_archived = false

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

-- Stale project items (no more last_reviewed_at -- derived from updated_at)
select
  p.id::text || ':stale_activity' as attention_item_id,
  p.id as project_id,
  p.project_code,
  p.name as project_name,
  c.name as client_name,
  'stale_activity'::text as attention_label,
  'Project has not been updated in over 14 days and should be reviewed for current status.'::text as attention_summary,
  coalesce(p.updated_at, p.created_at) as created_at
from public.projects p
join public.clients c on c.id = p.client_id
where p.lifecycle_status = 'active'
  and p.is_archived = false
  and p.updated_at < now() - interval '14 days';

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

-- Recreate dashboard_snapshot view to also filter archived
create or replace view public.dashboard_snapshot_v as
select
  count(*) filter (where lifecycle_status = 'active' and is_archived = false) as active_projects,
  count(*) filter (where pas.needs_attention) as projects_needing_attention
from public.projects p
left join public.project_attention_summary_v pas on pas.project_id = p.id;

COMMIT;
