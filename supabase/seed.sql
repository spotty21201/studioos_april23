insert into public.studio_profile (id, studio_name, default_currency, timezone)
values (
  '10000000-0000-4000-8000-000000000001',
  'AIM',
  'IDR',
  'Asia/Jakarta'
)
on conflict (id) do update
set
  studio_name = excluded.studio_name,
  default_currency = excluded.default_currency,
  timezone = excluded.timezone,
  updated_at = now();

insert into public.profiles (id, email, full_name, role)
select
  u.id,
  coalesce(u.email, 'aim-user-' || left(u.id::text, 8) || '@example.com'),
  coalesce(
    nullif(u.raw_user_meta_data ->> 'full_name', ''),
    initcap(replace(split_part(coalesce(u.email, 'aim user'), '@', 1), '.', ' '))
  ),
  'team_member'
from auth.users u
on conflict (id) do update
set
  email = excluded.email,
  full_name = excluded.full_name,
  updated_at = now();

with ranked_profiles as (
  select
    id,
    row_number() over (order by created_at asc, id asc) as profile_rank
  from public.profiles
)
update public.profiles p
set
  role = case
    when rp.profile_rank = 1 then 'principal'
    when rp.profile_rank = 2 then 'operations'
    else p.role
  end,
  updated_at = now()
from ranked_profiles rp
where p.id = rp.id;

do $$
declare
  principal_profile_id uuid;
  supporting_profile_id uuid;
begin
  select id
  into principal_profile_id
  from public.profiles
  order by
    case when role = 'principal' then 0 else 1 end,
    created_at asc,
    id asc
  limit 1;

  if principal_profile_id is null then
    raise exception 'Hosted seed requires at least one auth user so public.profiles can be bootstrapped.';
  end if;

  select id
  into supporting_profile_id
  from public.profiles
  where id <> principal_profile_id
  order by created_at asc, id asc
  limit 1;

  supporting_profile_id := coalesce(supporting_profile_id, principal_profile_id);

  insert into public.clients (
    id,
    name,
    industry,
    city,
    country,
    website,
    notes,
    is_active,
    created_by,
    updated_by
  )
  values
    (
      '30000000-0000-4000-8000-000000000001',
      'Bandung Urban Development',
      'Public Development',
      'Bandung',
      'Indonesia',
      'https://bandungud.example.com',
      'Core public-sector client for urban activation and civic design work.',
      true,
      principal_profile_id,
      principal_profile_id
    ),
    (
      '30000000-0000-4000-8000-000000000002',
      'Provincial Design Council',
      'Public Institution',
      'Bandung',
      'Indonesia',
      'https://pdc.example.com',
      'Strategic design advisory client with active capital-project packaging.',
      true,
      principal_profile_id,
      principal_profile_id
    ),
    (
      '30000000-0000-4000-8000-000000000003',
      'Nusantara Living Collective',
      'Property Development',
      'IKN',
      'Indonesia',
      'https://nusantaraliving.example.com',
      'Private-sector mixed-use development client for pilot living-lab work.',
      true,
      principal_profile_id,
      principal_profile_id
    )
  on conflict (id) do update
  set
    name = excluded.name,
    industry = excluded.industry,
    city = excluded.city,
    country = excluded.country,
    website = excluded.website,
    notes = excluded.notes,
    is_active = excluded.is_active,
    updated_by = excluded.updated_by,
    updated_at = now();

  insert into public.client_contacts (
    id,
    client_id,
    full_name,
    job_title,
    email,
    phone,
    is_primary,
    created_by,
    updated_by
  )
  values
    (
      '40000000-0000-4000-8000-000000000001',
      '30000000-0000-4000-8000-000000000001',
      'Maya Puspa',
      'Head of Development',
      'maya.puspa@bandungud.example.com',
      '+62-812-1000-1001',
      true,
      principal_profile_id,
      principal_profile_id
    ),
    (
      '40000000-0000-4000-8000-000000000002',
      '30000000-0000-4000-8000-000000000002',
      'Raka Nugraha',
      'Program Lead',
      'raka.nugraha@pdc.example.com',
      '+62-812-1000-1002',
      true,
      principal_profile_id,
      principal_profile_id
    ),
    (
      '40000000-0000-4000-8000-000000000003',
      '30000000-0000-4000-8000-000000000003',
      'Sinta Prameswari',
      'Operations Director',
      'sinta.prameswari@nusantaraliving.example.com',
      '+62-812-1000-1003',
      true,
      principal_profile_id,
      principal_profile_id
    )
  on conflict (id) do update
  set
    client_id = excluded.client_id,
    full_name = excluded.full_name,
    job_title = excluded.job_title,
    email = excluded.email,
    phone = excluded.phone,
    is_primary = excluded.is_primary,
    updated_by = excluded.updated_by,
    updated_at = now();

  insert into public.projects (
    id,
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
    last_reviewed_at,
    created_at,
    updated_at,
    created_by,
    updated_by
  )
  values
    (
      '20000000-0000-4000-8000-000000000001',
      'AIM-26014',
      'Bandung Creative Hub Expansion',
      'bandung-creative-hub-expansion',
      '30000000-0000-4000-8000-000000000001',
      '40000000-0000-4000-8000-000000000001',
      'active',
      'watch',
      'Permit packaging is nearly ready, but leadership follow-up is still needed on the overdue milestone invoice and consultant alignment.',
      'Bandung, Indonesia',
      '2026-01-12',
      '2026-07-10',
      null,
      18600000000.00,
      'IDR',
      principal_profile_id,
      now() - interval '3 days',
      '2026-01-12T02:00:00Z',
      now() - interval '1 day',
      principal_profile_id,
      principal_profile_id
    ),
    (
      '20000000-0000-4000-8000-000000000002',
      'AIM-26011',
      'West Java Design Center',
      'west-java-design-center',
      '30000000-0000-4000-8000-000000000002',
      '40000000-0000-4000-8000-000000000002',
      'active',
      'on_track',
      'Tender packaging and consultant coordination are progressing cleanly with no current receivable or payable escalation.',
      'Bandung, Indonesia',
      '2026-01-05',
      '2026-06-02',
      null,
      22400000000.00,
      'IDR',
      supporting_profile_id,
      now() - interval '2 days',
      '2026-01-05T02:00:00Z',
      now() - interval '12 hours',
      principal_profile_id,
      principal_profile_id
    ),
    (
      '20000000-0000-4000-8000-000000000003',
      'AIM-26017',
      'Nusantara Living Lab',
      'nusantara-living-lab',
      '30000000-0000-4000-8000-000000000003',
      '40000000-0000-4000-8000-000000000003',
      'active',
      'at_risk',
      'Client sign-off on the pilot package has slipped while fabrication and vendor payment follow-up remain open.',
      'IKN, Indonesia',
      '2026-02-03',
      '2026-08-15',
      null,
      14250000000.00,
      'IDR',
      principal_profile_id,
      now() - interval '21 days',
      '2026-02-03T02:00:00Z',
      now() - interval '2 days',
      principal_profile_id,
      principal_profile_id
    )
  on conflict (id) do update
  set
    project_code = excluded.project_code,
    name = excluded.name,
    slug = excluded.slug,
    client_id = excluded.client_id,
    primary_contact_id = excluded.primary_contact_id,
    lifecycle_status = excluded.lifecycle_status,
    health_status = excluded.health_status,
    summary = excluded.summary,
    location = excluded.location,
    start_date = excluded.start_date,
    target_end_date = excluded.target_end_date,
    completed_at = excluded.completed_at,
    contract_value = excluded.contract_value,
    currency = excluded.currency,
    project_owner_id = excluded.project_owner_id,
    last_reviewed_at = excluded.last_reviewed_at,
    updated_by = excluded.updated_by,
    updated_at = excluded.updated_at;

  insert into public.vendors (
    id,
    name,
    service_type,
    contact_name,
    email,
    phone,
    notes,
    is_active,
    created_by,
    updated_by
  )
  values
    (
      '50000000-0000-4000-8000-000000000001',
      'Studio Struktur',
      'Structural Consultant',
      'Adit Rahman',
      'adit@studiosruktur.example.com',
      '+62-812-2000-2001',
      'Recurring structural review partner.',
      true,
      principal_profile_id,
      principal_profile_id
    ),
    (
      '50000000-0000-4000-8000-000000000002',
      'Maket Nusantara',
      'Fabrication',
      'Laras Wibisono',
      'laras@maketnusantara.example.com',
      '+62-812-2000-2002',
      'Model-making vendor used for stakeholder review kits.',
      true,
      principal_profile_id,
      principal_profile_id
    )
  on conflict (id) do update
  set
    name = excluded.name,
    service_type = excluded.service_type,
    contact_name = excluded.contact_name,
    email = excluded.email,
    phone = excluded.phone,
    notes = excluded.notes,
    is_active = excluded.is_active,
    updated_by = excluded.updated_by,
    updated_at = now();

  insert into public.invoices (
    id,
    project_id,
    client_id,
    invoice_number,
    title,
    issued_date,
    due_date,
    invoice_amount,
    status,
    paid_at,
    tax_percentage,
    tax_amount,
    tax_status,
    notes,
    created_at,
    updated_at,
    created_by,
    updated_by
  )
  values
    (
      '60000000-0000-4000-8000-000000000001',
      '20000000-0000-4000-8000-000000000001',
      '30000000-0000-4000-8000-000000000001',
      'INV-26014-01',
      'Schematic Design Retainer',
      '2026-02-01',
      '2026-02-14',
      2500000000.00,
      'paid',
      '2026-02-15',
      11.00,
      275000000.00,
      'paid',
      'Paid by client on schedule.',
      '2026-02-01T08:00:00Z',
      '2026-02-15T09:00:00Z',
      principal_profile_id,
      principal_profile_id
    ),
    (
      '60000000-0000-4000-8000-000000000002',
      '20000000-0000-4000-8000-000000000001',
      '30000000-0000-4000-8000-000000000001',
      'INV-26014-02',
      'Permit Packaging Milestone',
      '2026-03-15',
      current_date - 10,
      3750000000.00,
      'overdue',
      null,
      11.00,
      412500000.00,
      'unpaid',
      'Overdue invoice driving current watch-level attention.',
      '2026-03-15T08:00:00Z',
      now() - interval '1 day',
      principal_profile_id,
      principal_profile_id
    ),
    (
      '60000000-0000-4000-8000-000000000003',
      '20000000-0000-4000-8000-000000000002',
      '30000000-0000-4000-8000-000000000002',
      'INV-26011-01',
      'Tender Package Phase 1',
      '2026-03-01',
      '2026-03-20',
      4200000000.00,
      'paid',
      '2026-03-18',
      11.00,
      462000000.00,
      'paid',
      'Settled before due date.',
      '2026-03-01T08:00:00Z',
      '2026-03-18T08:30:00Z',
      principal_profile_id,
      principal_profile_id
    ),
    (
      '60000000-0000-4000-8000-000000000004',
      '20000000-0000-4000-8000-000000000003',
      '30000000-0000-4000-8000-000000000003',
      'INV-26017-01',
      'Living Lab Kickoff Billing',
      '2026-03-20',
      current_date + 7,
      1850000000.00,
      'issued',
      null,
      11.00,
      203500000.00,
      'unpaid',
      'Awaiting client processing while project is under review.',
      '2026-03-20T08:00:00Z',
      now() - interval '5 days',
      principal_profile_id,
      principal_profile_id
    )
  on conflict (id) do update
  set
    project_id = excluded.project_id,
    client_id = excluded.client_id,
    invoice_number = excluded.invoice_number,
    title = excluded.title,
    issued_date = excluded.issued_date,
    due_date = excluded.due_date,
    invoice_amount = excluded.invoice_amount,
    status = excluded.status,
    paid_at = excluded.paid_at,
    tax_percentage = excluded.tax_percentage,
    tax_amount = excluded.tax_amount,
    tax_status = excluded.tax_status,
    notes = excluded.notes,
    updated_by = excluded.updated_by,
    updated_at = excluded.updated_at;

  insert into public.vendor_obligations (
    id,
    project_id,
    vendor_id,
    title,
    description,
    due_date,
    amount,
    status,
    paid_at,
    tax_percentage,
    tax_amount,
    tax_status,
    notes,
    created_at,
    updated_at,
    created_by,
    updated_by
  )
  values
    (
      '70000000-0000-4000-8000-000000000001',
      '20000000-0000-4000-8000-000000000001',
      '50000000-0000-4000-8000-000000000001',
      'Structural Review Package',
      'Supplemental structural review for permit coordination.',
      current_date + 4,
      450000000.00,
      'due',
      null,
      11.00,
      49500000.00,
      'unpaid',
      'Due this week and visible in finance, but not yet overdue.',
      '2026-04-01T09:00:00Z',
      now() - interval '1 day',
      principal_profile_id,
      principal_profile_id
    ),
    (
      '70000000-0000-4000-8000-000000000002',
      '20000000-0000-4000-8000-000000000003',
      '50000000-0000-4000-8000-000000000002',
      'Stakeholder Model Fabrication',
      'Physical model and review-kit fabrication for the living-lab package.',
      current_date - 6,
      320000000.00,
      'overdue',
      null,
      11.00,
      35200000.00,
      'unpaid',
      'Overdue vendor obligation driving current payable attention.',
      '2026-04-02T09:00:00Z',
      now() - interval '2 days',
      principal_profile_id,
      principal_profile_id
    ),
    (
      '70000000-0000-4000-8000-000000000003',
      '20000000-0000-4000-8000-000000000002',
      '50000000-0000-4000-8000-000000000001',
      'Tender Coordination Review',
      'Completed coordination review for the West Java Design Center package.',
      '2026-03-05',
      285000000.00,
      'paid',
      '2026-03-07',
      11.00,
      31350000.00,
      'paid',
      'Closed and settled.',
      '2026-03-01T09:00:00Z',
      '2026-03-07T12:00:00Z',
      principal_profile_id,
      principal_profile_id
    )
  on conflict (id) do update
  set
    project_id = excluded.project_id,
    vendor_id = excluded.vendor_id,
    title = excluded.title,
    description = excluded.description,
    due_date = excluded.due_date,
    amount = excluded.amount,
    status = excluded.status,
    paid_at = excluded.paid_at,
    tax_percentage = excluded.tax_percentage,
    tax_amount = excluded.tax_amount,
    tax_status = excluded.tax_status,
    notes = excluded.notes,
    updated_by = excluded.updated_by,
    updated_at = excluded.updated_at;

  insert into public.documents (
    id,
    project_id,
    title,
    category,
    source_type,
    file_path,
    external_url,
    linked_entity_type,
    linked_entity_id,
    document_date,
    description,
    created_at,
    updated_at,
    created_by,
    updated_by
  )
  values
    (
      '80000000-0000-4000-8000-000000000001',
      '20000000-0000-4000-8000-000000000001',
      'Executed Services Agreement',
      'contract',
      'external_link',
      null,
      'https://aim-docs.example.com/contracts/aim-26014-services-agreement.pdf',
      'project',
      '20000000-0000-4000-8000-000000000001',
      '2026-01-10',
      'Signed services agreement for the Bandung Creative Hub expansion.',
      '2026-01-10T10:00:00Z',
      now() - interval '6 days',
      principal_profile_id,
      principal_profile_id
    ),
    (
      '80000000-0000-4000-8000-000000000002',
      '20000000-0000-4000-8000-000000000001',
      'Permit Packaging Tracker',
      'deliverable',
      'file',
      'seed/aim-26014/permit-packaging-tracker-v3.pdf',
      null,
      'project',
      '20000000-0000-4000-8000-000000000001',
      '2026-04-12',
      'Latest packaging tracker shared for consultant coordination.',
      '2026-04-12T10:00:00Z',
      now() - interval '2 days',
      principal_profile_id,
      principal_profile_id
    ),
    (
      '80000000-0000-4000-8000-000000000003',
      '20000000-0000-4000-8000-000000000001',
      'Client Review Markups',
      'client_document',
      'external_link',
      null,
      'https://aim-docs.example.com/client-feedback/aim-26014-markups.pdf',
      'project',
      '20000000-0000-4000-8000-000000000001',
      '2026-04-16',
      'Client markup package from the latest review round.',
      '2026-04-16T10:00:00Z',
      now() - interval '1 day',
      principal_profile_id,
      principal_profile_id
    ),
    (
      '80000000-0000-4000-8000-000000000004',
      '20000000-0000-4000-8000-000000000003',
      'Fabrication Scope Memo',
      'support_document',
      'file',
      'seed/aim-26017/fabrication-scope-memo.pdf',
      null,
      'vendor_obligation',
      '70000000-0000-4000-8000-000000000002',
      '2026-04-05',
      'Scope memo tied to the overdue model fabrication package.',
      '2026-04-05T10:00:00Z',
      now() - interval '3 days',
      principal_profile_id,
      principal_profile_id
    ),
    (
      '80000000-0000-4000-8000-000000000005',
      '20000000-0000-4000-8000-000000000002',
      'Tender Submission Outline',
      'proposal',
      'external_link',
      null,
      'https://aim-docs.example.com/proposals/aim-26011-tender-outline.pdf',
      'project',
      '20000000-0000-4000-8000-000000000002',
      '2026-03-08',
      'Outline used for internal coordination and review.',
      '2026-03-08T10:00:00Z',
      now() - interval '10 days',
      principal_profile_id,
      principal_profile_id
    )
  on conflict (id) do update
  set
    project_id = excluded.project_id,
    title = excluded.title,
    category = excluded.category,
    source_type = excluded.source_type,
    file_path = excluded.file_path,
    external_url = excluded.external_url,
    linked_entity_type = excluded.linked_entity_type,
    linked_entity_id = excluded.linked_entity_id,
    document_date = excluded.document_date,
    description = excluded.description,
    updated_by = excluded.updated_by,
    updated_at = excluded.updated_at;

  insert into public.notes (
    id,
    project_id,
    author_id,
    title,
    body,
    note_type,
    linked_entity_type,
    linked_entity_id,
    noted_at,
    created_at,
    updated_at,
    created_by,
    updated_by
  )
  values
    (
      '90000000-0000-4000-8000-000000000001',
      '20000000-0000-4000-8000-000000000001',
      principal_profile_id,
      'Principal review: invoice follow-up',
      'Client team confirmed internal payment routing is delayed by procurement sign-off. Principal follow-up requested before Friday so the permit packaging milestone invoice does not slip another cycle.',
      'meeting_note',
      'invoice',
      '60000000-0000-4000-8000-000000000002',
      now() - interval '2 days',
      now() - interval '2 days',
      now() - interval '2 days',
      principal_profile_id,
      principal_profile_id
    ),
    (
      '90000000-0000-4000-8000-000000000002',
      '20000000-0000-4000-8000-000000000001',
      principal_profile_id,
      'Open issue: structural response timing',
      'Structural consultant turnaround is still acceptable, but any further movement will impact the permit handoff milestone. Keep the due vendor item visible but do not escalate yet.',
      'issue',
      'vendor_obligation',
      '70000000-0000-4000-8000-000000000001',
      now() - interval '1 day',
      now() - interval '1 day',
      now() - interval '1 day',
      principal_profile_id,
      principal_profile_id
    ),
    (
      '90000000-0000-4000-8000-000000000003',
      '20000000-0000-4000-8000-000000000003',
      principal_profile_id,
      'Reminder: refresh client review',
      'Project review is stale. The client owes a go/no-go decision on the pilot scope and the overdue fabrication payment needs to be resolved in the same operating review.',
      'reminder',
      'project',
      '20000000-0000-4000-8000-000000000003',
      now() - interval '3 days',
      now() - interval '3 days',
      now() - interval '3 days',
      principal_profile_id,
      principal_profile_id
    )
  on conflict (id) do update
  set
    project_id = excluded.project_id,
    author_id = excluded.author_id,
    title = excluded.title,
    body = excluded.body,
    note_type = excluded.note_type,
    linked_entity_type = excluded.linked_entity_type,
    linked_entity_id = excluded.linked_entity_id,
    noted_at = excluded.noted_at,
    updated_by = excluded.updated_by,
    updated_at = excluded.updated_at;

  insert into public.activity_events (
    id,
    project_id,
    actor_id,
    event_type,
    entity_type,
    entity_id,
    summary,
    metadata,
    occurred_at,
    created_at,
    updated_at
  )
  values
    (
      'a0000000-0000-4000-8000-000000000001',
      '20000000-0000-4000-8000-000000000001',
      principal_profile_id,
      'project_status_changed',
      'project',
      '20000000-0000-4000-8000-000000000001',
      'Project health remains watch pending invoice follow-up and consultant alignment.',
      '{"source":"seed","health_status":"watch"}'::jsonb,
      now() - interval '1 day',
      now() - interval '1 day',
      now() - interval '1 day'
    ),
    (
      'a0000000-0000-4000-8000-000000000002',
      '20000000-0000-4000-8000-000000000001',
      principal_profile_id,
      'invoice_status_changed',
      'invoice',
      '60000000-0000-4000-8000-000000000002',
      'Permit Packaging Milestone invoice is overdue and flagged for leadership follow-up.',
      '{"source":"seed","invoice_status":"overdue"}'::jsonb,
      now() - interval '20 hours',
      now() - interval '20 hours',
      now() - interval '20 hours'
    ),
    (
      'a0000000-0000-4000-8000-000000000003',
      '20000000-0000-4000-8000-000000000001',
      principal_profile_id,
      'document_added',
      'document',
      '80000000-0000-4000-8000-000000000002',
      'Permit Packaging Tracker uploaded for the latest consultant review cycle.',
      '{"source":"seed","document_category":"deliverable"}'::jsonb,
      now() - interval '18 hours',
      now() - interval '18 hours',
      now() - interval '18 hours'
    ),
    (
      'a0000000-0000-4000-8000-000000000004',
      '20000000-0000-4000-8000-000000000001',
      principal_profile_id,
      'note_created',
      'note',
      '90000000-0000-4000-8000-000000000001',
      'Principal review note added for invoice follow-up.',
      '{"source":"seed","note_type":"meeting_note"}'::jsonb,
      now() - interval '2 days',
      now() - interval '2 days',
      now() - interval '2 days'
    ),
    (
      'a0000000-0000-4000-8000-000000000005',
      '20000000-0000-4000-8000-000000000003',
      principal_profile_id,
      'vendor_obligation_status_changed',
      'vendor_obligation',
      '70000000-0000-4000-8000-000000000002',
      'Stakeholder Model Fabrication payment is overdue and now part of the weekly attention review.',
      '{"source":"seed","vendor_status":"overdue"}'::jsonb,
      now() - interval '3 days',
      now() - interval '3 days',
      now() - interval '3 days'
    ),
    (
      'a0000000-0000-4000-8000-000000000006',
      '20000000-0000-4000-8000-000000000003',
      principal_profile_id,
      'project_updated',
      'project',
      '20000000-0000-4000-8000-000000000003',
      'Living Lab review has gone stale and needs the next leadership operating review.',
      '{"source":"seed","stale_review":true}'::jsonb,
      now() - interval '4 days',
      now() - interval '4 days',
      now() - interval '4 days'
    )
  on conflict (id) do update
  set
    project_id = excluded.project_id,
    actor_id = excluded.actor_id,
    event_type = excluded.event_type,
    entity_type = excluded.entity_type,
    entity_id = excluded.entity_id,
    summary = excluded.summary,
    metadata = excluded.metadata,
    occurred_at = excluded.occurred_at,
    updated_at = excluded.updated_at;
end
$$;

-- Align hosted/sample data with the localhost fallback mockup.
-- This block intentionally replaces the earlier demo records for the fixed
-- sample IDs so local fallback mode and hosted Supabase review show the same
-- operating picture.
do $$
declare
  principal_profile_id uuid;
  supporting_profile_id uuid;
begin
  select id
  into principal_profile_id
  from public.profiles
  order by
    case when role = 'principal' then 0 else 1 end,
    created_at asc,
    id asc
  limit 1;

  if principal_profile_id is null then
    raise exception 'Mockup seed requires at least one auth user in public.profiles.';
  end if;

  select id
  into supporting_profile_id
  from public.profiles
  where id <> principal_profile_id
  order by created_at asc, id asc
  limit 1;

  supporting_profile_id := coalesce(supporting_profile_id, principal_profile_id);

  delete from public.activity_events
  where project_id in (
    '20000000-0000-4000-8000-000000000001',
    '20000000-0000-4000-8000-000000000002',
    '20000000-0000-4000-8000-000000000003',
    '20000000-0000-4000-8000-000000000004'
  );
  delete from public.notes
  where project_id in (
    '20000000-0000-4000-8000-000000000001',
    '20000000-0000-4000-8000-000000000002',
    '20000000-0000-4000-8000-000000000003',
    '20000000-0000-4000-8000-000000000004'
  );
  delete from public.documents
  where project_id in (
    '20000000-0000-4000-8000-000000000001',
    '20000000-0000-4000-8000-000000000002',
    '20000000-0000-4000-8000-000000000003',
    '20000000-0000-4000-8000-000000000004'
  );
  delete from public.vendor_obligations
  where project_id in (
    '20000000-0000-4000-8000-000000000001',
    '20000000-0000-4000-8000-000000000002',
    '20000000-0000-4000-8000-000000000003',
    '20000000-0000-4000-8000-000000000004'
  );
  delete from public.invoices
  where project_id in (
    '20000000-0000-4000-8000-000000000001',
    '20000000-0000-4000-8000-000000000002',
    '20000000-0000-4000-8000-000000000003',
    '20000000-0000-4000-8000-000000000004'
  );
  delete from public.projects
  where id in (
    '20000000-0000-4000-8000-000000000001',
    '20000000-0000-4000-8000-000000000002',
    '20000000-0000-4000-8000-000000000003',
    '20000000-0000-4000-8000-000000000004'
  );
  insert into public.clients (
    id, name, industry, city, country, website, notes, is_active, created_by, updated_by
  )
  values
    (
      '30000000-0000-4000-8000-000000000001',
      'Bandung Urban Development',
      'Public Development',
      'Bandung',
      'Indonesia',
      'https://bandungud.example.com',
      'Core public-sector client for urban activation and civic design work.',
      true,
      principal_profile_id,
      principal_profile_id
    ),
    (
      '30000000-0000-4000-8000-000000000002',
      'Provincial Design Council',
      'Public Institution',
      'Bandung',
      'Indonesia',
      'https://pdc.example.com',
      'Strategic design advisory client with active capital-project packaging.',
      true,
      principal_profile_id,
      principal_profile_id
    ),
    (
      '30000000-0000-4000-8000-000000000003',
      'Kolabs Ecosystem',
      'Innovation Ecosystem',
      'Jakarta',
      'Indonesia',
      'https://kolabs.example.com',
      'Innovation partnerships client for pilot living-lab work.',
      true,
      principal_profile_id,
      principal_profile_id
    ),
    (
      '30000000-0000-4000-8000-000000000004',
      'Apex Advisory',
      'Corporate Advisory',
      'Jakarta',
      'Indonesia',
      'https://apexadvisory.example.com',
      'Completed headquarters refresh client for closeout review.',
      true,
      principal_profile_id,
      principal_profile_id
    )
  on conflict (id) do update
  set
    name = excluded.name,
    industry = excluded.industry,
    city = excluded.city,
    country = excluded.country,
    website = excluded.website,
    notes = excluded.notes,
    is_active = excluded.is_active,
    updated_by = excluded.updated_by,
    updated_at = now();

  insert into public.client_contacts (
    id, client_id, full_name, job_title, email, phone, is_primary, created_by, updated_by
  )
  values
    (
      '40000000-0000-4000-8000-000000000001',
      '30000000-0000-4000-8000-000000000001',
      'Maya Puspa',
      'Head of Development',
      'maya@bandungud.id',
      '+62-812-1000-1001',
      true,
      principal_profile_id,
      principal_profile_id
    ),
    (
      '40000000-0000-4000-8000-000000000002',
      '30000000-0000-4000-8000-000000000002',
      'Raka Nugraha',
      'Program Lead',
      'raka@pdc.id',
      '+62-812-1000-1002',
      true,
      principal_profile_id,
      principal_profile_id
    ),
    (
      '40000000-0000-4000-8000-000000000003',
      '30000000-0000-4000-8000-000000000003',
      'Tania Arundina',
      'Innovation Partnerships',
      'tania@kolabs.id',
      '+62-812-1000-1003',
      true,
      principal_profile_id,
      principal_profile_id
    )
  on conflict (id) do update
  set
    client_id = excluded.client_id,
    full_name = excluded.full_name,
    job_title = excluded.job_title,
    email = excluded.email,
    phone = excluded.phone,
    is_primary = excluded.is_primary,
    updated_by = excluded.updated_by,
    updated_at = now();

  insert into public.projects (
    id,
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
    last_reviewed_at,
    created_at,
    updated_at,
    created_by,
    updated_by
  )
  values
    (
      '20000000-0000-4000-8000-000000000001',
      'AIM-26014',
      'Bandung Creative Hub Expansion',
      'bandung-creative-hub-expansion',
      '30000000-0000-4000-8000-000000000001',
      '40000000-0000-4000-8000-000000000001',
      'active',
      'watch',
      'Permit packaging is nearly ready, but one external structural review remains open and leadership follow-up is required on the overdue milestone invoice.',
      'Bandung, Indonesia',
      '2026-01-12',
      '2026-07-10',
      null,
      18600000000.00,
      'IDR',
      supporting_profile_id,
      '2026-04-22T02:10:00Z',
      '2026-01-12T02:00:00Z',
      '2026-04-22T02:10:00Z',
      principal_profile_id,
      principal_profile_id
    ),
    (
      '20000000-0000-4000-8000-000000000002',
      'AIM-26011',
      'West Java Design Center',
      'west-java-design-center',
      '30000000-0000-4000-8000-000000000002',
      '40000000-0000-4000-8000-000000000002',
      'active',
      'on_track',
      'Tender packaging and consultant coordination are progressing cleanly with no open receivable risk.',
      'Bandung, Indonesia',
      '2026-01-05',
      '2026-06-02',
      null,
      22400000000.00,
      'IDR',
      supporting_profile_id,
      '2026-04-21T08:30:00Z',
      '2026-01-05T02:00:00Z',
      '2026-04-21T08:30:00Z',
      principal_profile_id,
      principal_profile_id
    ),
    (
      '20000000-0000-4000-8000-000000000003',
      'AIM-26017',
      'Nusantara Living Lab',
      'nusantara-living-lab',
      '30000000-0000-4000-8000-000000000003',
      '40000000-0000-4000-8000-000000000003',
      'on_hold',
      'at_risk',
      'Commercial staging remains unresolved. The project is paused, one invoice is overdue, and a vendor obligation has crossed its due date.',
      'IKN, Indonesia',
      '2026-02-02',
      '2026-08-14',
      null,
      9300000000.00,
      'IDR',
      supporting_profile_id,
      '2026-04-01T09:00:00Z',
      '2026-02-02T02:00:00Z',
      '2026-04-18T04:00:00Z',
      principal_profile_id,
      principal_profile_id
    ),
    (
      '20000000-0000-4000-8000-000000000004',
      'AIM-25022',
      'Jakarta HQ Refresh',
      'jakarta-hq-refresh',
      '30000000-0000-4000-8000-000000000004',
      null,
      'completed',
      'on_track',
      'Operational work is complete. Administrative closeout remains limited to final payment and archive release.',
      'Jakarta, Indonesia',
      '2025-10-18',
      '2026-04-30',
      '2026-04-20',
      7600000000.00,
      'IDR',
      null,
      '2026-04-20T03:20:00Z',
      '2025-10-18T02:00:00Z',
      '2026-04-20T03:20:00Z',
      principal_profile_id,
      principal_profile_id
    );

  insert into public.vendors (
    id, name, service_type, contact_name, email, phone, notes, is_active, created_by, updated_by
  )
  values
    (
      '70000000-0000-4000-8000-000000000001',
      'Kirana Structure Studio',
      'Structural Consultant',
      'Adit Rahman',
      'adit@kiranastructure.example.com',
      '+62-812-2000-2001',
      'Structural review partner for permit coordination.',
      true,
      principal_profile_id,
      principal_profile_id
    ),
    (
      '70000000-0000-4000-8000-000000000002',
      'Studio Grid MEP',
      'MEP Consultant',
      'Laras Wibisono',
      'laras@studiogrid.example.com',
      '+62-812-2000-2002',
      'MEP coordination support vendor.',
      true,
      principal_profile_id,
      principal_profile_id
    ),
    (
      '70000000-0000-4000-8000-000000000003',
      'Ruang Narasi',
      'Narrative Visualization',
      'Satria Wirawan',
      'satria@ruangnarasi.example.com',
      '+62-812-2000-2003',
      'Narrative visualization and review package vendor.',
      true,
      principal_profile_id,
      principal_profile_id
    )
  on conflict (id) do update
  set
    name = excluded.name,
    service_type = excluded.service_type,
    contact_name = excluded.contact_name,
    email = excluded.email,
    phone = excluded.phone,
    notes = excluded.notes,
    is_active = excluded.is_active,
    updated_by = excluded.updated_by,
    updated_at = now();

  insert into public.invoices (
    id,
    project_id,
    client_id,
    invoice_number,
    title,
    issued_date,
    due_date,
    invoice_amount,
    status,
    paid_at,
    tax_percentage,
    tax_amount,
    tax_status,
    notes,
    created_at,
    updated_at,
    created_by,
    updated_by
  )
  values
    (
      '50000000-0000-4000-8000-000000000001',
      '20000000-0000-4000-8000-000000000001',
      '30000000-0000-4000-8000-000000000001',
      'INV-26041',
      'Permit package milestone',
      '2026-03-28',
      '2026-04-12',
      1400000000.00,
      'overdue',
      null,
      11.00,
      154000000.00,
      'unpaid',
      null,
      '2026-03-28T02:00:00Z',
      '2026-04-12T09:00:00Z',
      principal_profile_id,
      principal_profile_id
    ),
    (
      '50000000-0000-4000-8000-000000000002',
      '20000000-0000-4000-8000-000000000003',
      '30000000-0000-4000-8000-000000000003',
      'INV-26044',
      'Concept framing stage',
      '2026-03-30',
      '2026-04-15',
      1300000000.00,
      'overdue',
      null,
      11.00,
      143000000.00,
      'unpaid',
      null,
      '2026-03-30T02:00:00Z',
      '2026-04-15T09:00:00Z',
      principal_profile_id,
      principal_profile_id
    ),
    (
      '50000000-0000-4000-8000-000000000003',
      '20000000-0000-4000-8000-000000000004',
      '30000000-0000-4000-8000-000000000004',
      'INV-26046',
      'Final closeout certificate',
      '2026-04-10',
      '2026-04-30',
      700000000.00,
      'issued',
      null,
      11.00,
      77000000.00,
      'unpaid',
      null,
      '2026-04-10T02:00:00Z',
      '2026-04-20T03:00:00Z',
      principal_profile_id,
      principal_profile_id
    );

  insert into public.vendor_obligations (
    id,
    project_id,
    vendor_id,
    title,
    description,
    due_date,
    amount,
    status,
    paid_at,
    tax_percentage,
    tax_amount,
    tax_status,
    notes,
    created_at,
    updated_at,
    created_by,
    updated_by
  )
  values
    (
      '60000000-0000-4000-8000-000000000001',
      '20000000-0000-4000-8000-000000000001',
      '70000000-0000-4000-8000-000000000001',
      'Structural review package',
      null,
      '2026-04-24',
      480000000.00,
      'due',
      null,
      11.00,
      52800000.00,
      'unpaid',
      null,
      '2026-04-09T02:00:00Z',
      '2026-04-21T05:00:00Z',
      principal_profile_id,
      principal_profile_id
    ),
    (
      '60000000-0000-4000-8000-000000000002',
      '20000000-0000-4000-8000-000000000002',
      '70000000-0000-4000-8000-000000000002',
      'MEP coordination support',
      null,
      '2026-04-28',
      640000000.00,
      'due',
      null,
      11.00,
      70400000.00,
      'unpaid',
      null,
      '2026-04-08T02:00:00Z',
      '2026-04-20T05:00:00Z',
      principal_profile_id,
      principal_profile_id
    ),
    (
      '60000000-0000-4000-8000-000000000003',
      '20000000-0000-4000-8000-000000000003',
      '70000000-0000-4000-8000-000000000003',
      'Narrative visualization package',
      null,
      '2026-04-16',
      220000000.00,
      'overdue',
      null,
      11.00,
      24200000.00,
      'unpaid',
      null,
      '2026-04-01T02:00:00Z',
      '2026-04-16T05:00:00Z',
      principal_profile_id,
      principal_profile_id
    );

  insert into public.documents (
    id,
    project_id,
    title,
    category,
    source_type,
    file_path,
    external_url,
    linked_entity_type,
    linked_entity_id,
    document_date,
    description,
    created_at,
    updated_at,
    created_by,
    updated_by
  )
  values
    (
      '80000000-0000-4000-8000-000000000001',
      '20000000-0000-4000-8000-000000000001',
      'Client agreement addendum',
      'contract',
      'file',
      'documents/aim-26014/client-agreement-addendum.pdf',
      null,
      'project',
      '20000000-0000-4000-8000-000000000001',
      '2026-04-04',
      null,
      '2026-04-04T02:00:00Z',
      '2026-04-20T08:00:00Z',
      principal_profile_id,
      principal_profile_id
    ),
    (
      '80000000-0000-4000-8000-000000000002',
      '20000000-0000-4000-8000-000000000002',
      'Tender issue drawing set',
      'deliverable',
      'file',
      'documents/aim-26011/tender-issue-drawing-set.pdf',
      null,
      'project',
      '20000000-0000-4000-8000-000000000002',
      '2026-04-18',
      null,
      '2026-04-18T02:00:00Z',
      '2026-04-21T09:20:00Z',
      principal_profile_id,
      principal_profile_id
    ),
    (
      '80000000-0000-4000-8000-000000000003',
      '20000000-0000-4000-8000-000000000003',
      'Commercial clarification memo',
      'client_document',
      'external_link',
      null,
      'https://example.com/nusantara-commercial-clarification',
      'project',
      '20000000-0000-4000-8000-000000000003',
      '2026-04-17',
      null,
      '2026-04-17T02:00:00Z',
      '2026-04-18T01:40:00Z',
      principal_profile_id,
      principal_profile_id
    ),
    (
      '80000000-0000-4000-8000-000000000004',
      '20000000-0000-4000-8000-000000000004',
      'Final invoice backup',
      'invoice_attachment',
      'file',
      'documents/aim-25022/final-invoice-backup.pdf',
      null,
      'invoice',
      '50000000-0000-4000-8000-000000000003',
      '2026-04-10',
      null,
      '2026-04-10T02:00:00Z',
      '2026-04-20T03:00:00Z',
      principal_profile_id,
      principal_profile_id
    );

  insert into public.notes (
    id,
    project_id,
    author_id,
    title,
    body,
    note_type,
    linked_entity_type,
    linked_entity_id,
    noted_at,
    created_at,
    updated_at,
    created_by,
    updated_by
  )
  values
    (
      '90000000-0000-4000-8000-000000000001',
      '20000000-0000-4000-8000-000000000001',
      supporting_profile_id,
      'Permit risk remains external',
      'Structural review is still the gating item. Client is aligned, but the permit submission package should not be committed until consultant comments are integrated.',
      'issue',
      'project',
      '20000000-0000-4000-8000-000000000001',
      '2026-04-22T02:10:00Z',
      '2026-04-22T02:10:00Z',
      '2026-04-22T02:10:00Z',
      principal_profile_id,
      principal_profile_id
    ),
    (
      '90000000-0000-4000-8000-000000000002',
      '20000000-0000-4000-8000-000000000002',
      supporting_profile_id,
      'Tender packaging sequence confirmed',
      'Internal review agreed on a two-wave issue set. This keeps documentation calm without increasing client coordination overhead.',
      'decision',
      'project',
      '20000000-0000-4000-8000-000000000002',
      '2026-04-21T08:30:00Z',
      '2026-04-21T08:30:00Z',
      '2026-04-21T08:30:00Z',
      principal_profile_id,
      principal_profile_id
    ),
    (
      '90000000-0000-4000-8000-000000000003',
      '20000000-0000-4000-8000-000000000003',
      principal_profile_id,
      'Client waiting on staging decision',
      'Commercial clarity remains the block. No additional design iteration should be released until land-use staging is confirmed.',
      'follow_up',
      'project',
      '20000000-0000-4000-8000-000000000003',
      '2026-04-18T04:00:00Z',
      '2026-04-18T04:00:00Z',
      '2026-04-18T04:00:00Z',
      principal_profile_id,
      principal_profile_id
    );

  delete from public.activity_events
  where project_id in (
    '20000000-0000-4000-8000-000000000001',
    '20000000-0000-4000-8000-000000000002',
    '20000000-0000-4000-8000-000000000003',
    '20000000-0000-4000-8000-000000000004'
  );

  insert into public.activity_events (
    id,
    project_id,
    actor_id,
    event_type,
    entity_type,
    entity_id,
    summary,
    metadata,
    occurred_at,
    created_at,
    updated_at
  )
  values
    (
      '91000000-0000-4000-8000-000000000001',
      '20000000-0000-4000-8000-000000000001',
      supporting_profile_id,
      'project_status_changed',
      'project',
      '20000000-0000-4000-8000-000000000001',
      'Project health moved to watch after structural review delay.',
      '{}'::jsonb,
      '2026-04-22T02:10:00Z',
      '2026-04-22T02:10:00Z',
      '2026-04-22T02:10:00Z'
    ),
    (
      '91000000-0000-4000-8000-000000000002',
      '20000000-0000-4000-8000-000000000002',
      supporting_profile_id,
      'document_added',
      'document',
      '80000000-0000-4000-8000-000000000002',
      'Tender issue drawing set uploaded to the project record.',
      '{}'::jsonb,
      '2026-04-21T09:20:00Z',
      '2026-04-21T09:20:00Z',
      '2026-04-21T09:20:00Z'
    ),
    (
      '91000000-0000-4000-8000-000000000003',
      '20000000-0000-4000-8000-000000000003',
      principal_profile_id,
      'invoice_status_changed',
      'invoice',
      '50000000-0000-4000-8000-000000000002',
      'Concept framing invoice is now overdue and requires client follow-up.',
      '{}'::jsonb,
      '2026-04-18T10:20:00Z',
      '2026-04-18T10:20:00Z',
      '2026-04-18T10:20:00Z'
    ),
    (
      '91000000-0000-4000-8000-000000000004',
      '20000000-0000-4000-8000-000000000004',
      null,
      'note_created',
      'note',
      '90000000-0000-4000-8000-000000000003',
      'Closeout note added covering final archive package and invoice timing.',
      '{}'::jsonb,
      '2026-04-20T03:20:00Z',
      '2026-04-20T03:20:00Z',
      '2026-04-20T03:20:00Z'
    );
end
$$;
