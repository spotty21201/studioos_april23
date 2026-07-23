insert into public.studio_profile (id, studio_name, default_currency, timezone)
values (
  '10000000-0000-4000-8000-000000000001',
  'HDA',
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
  coalesce(u.email, 'hda-user-' || left(u.id::text, 8) || '@example.com'),
  coalesce(
    nullif(u.raw_user_meta_data ->> 'full_name', ''),
    initcap(replace(split_part(coalesce(u.email, 'hda user'), '@', 1), '.', ' '))
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
      'Lippo Group',
      'Property Development',
      'Jakarta',
      'Indonesia',
      'https://lippogroup.example.com',
      'Major real estate development group client for commercial and master planning projects.',
      true,
      principal_profile_id,
      principal_profile_id
    ),
    (
      '30000000-0000-4000-8000-000000000002',
      'KLH Group',
      'Township & Infrastructure',
      'Bogor',
      'Indonesia',
      'https://klhgroup.example.com',
      'Township development and eco-infrastructure master plan client.',
      true,
      principal_profile_id,
      principal_profile_id
    ),
    (
      '30000000-0000-4000-8000-000000000003',
      'Yayasan Pendidikan Telkom',
      'Education & Institutions',
      'Bandung',
      'Indonesia',
      'https://ypt.example.com',
      'Educational institution and campus master planning client.',
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
      'Development Director',
      'maya.puspa@lippo.example.com',
      '+62-812-1000-1001',
      true,
      principal_profile_id,
      principal_profile_id
    ),
    (
      '40000000-0000-4000-8000-000000000002',
      '30000000-0000-4000-8000-000000000002',
      'Budi Santoso',
      'Project Lead',
      'budi.santoso@klh.example.com',
      '+62-812-1000-1002',
      true,
      principal_profile_id,
      principal_profile_id
    ),
    (
      '40000000-0000-4000-8000-000000000003',
      '30000000-0000-4000-8000-000000000003',
      'Rina Wijaya',
      'Estate Director',
      'rina.wijaya@ypt.example.com',
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
      'HDA-26001',
      'Lippo Pekanbaru 36 ha',
      'lippo-pekanbaru-36-ha',
      '30000000-0000-4000-8000-000000000001',
      '40000000-0000-4000-8000-000000000001',
      'active',
      'watch',
      'Master planning and architectural design for 36 ha Lippo Pekanbaru development.',
      'Pekanbaru, Riau',
      '2026-01-12',
      '2026-07-10',
      null,
      125000000.00,
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
      'HDA-26002',
      'Lippo Puncak 18 ha',
      'lippo-puncak-18-ha',
      '30000000-0000-4000-8000-000000000001',
      '40000000-0000-4000-8000-000000000001',
      'active',
      'on_track',
      'Resort master plan and landscape design for 18 ha Lippo Puncak site.',
      'Puncak, Jawa Barat',
      '2026-01-05',
      '2026-06-02',
      null,
      85000000.00,
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
      'HDA-26003',
      'Lippo Cikao 20 ha',
      'lippo-cikao-20-ha',
      '30000000-0000-4000-8000-000000000001',
      '40000000-0000-4000-8000-000000000001',
      'on_hold',
      'at_risk',
      'Mixed-use concept development and site layout for 20 ha Lippo Cikao.',
      'Purwakarta, Jawa Barat',
      '2026-02-02',
      '2026-08-14',
      null,
      95000000.00,
      'IDR',
      principal_profile_id,
      now() - interval '21 days',
      '2026-02-02T02:00:00Z',
      now() - interval '2 days',
      principal_profile_id,
      principal_profile_id
    ),
    (
      '20000000-0000-4000-8000-000000000004',
      'HDA-26004',
      'KLH Sentul 100 ha',
      'klh-sentul-100-ha',
      '30000000-0000-4000-8000-000000000002',
      '40000000-0000-4000-8000-000000000002',
      'proposal',
      'on_track',
      'Township master plan and environmental framework for 100 ha KLH Sentul.',
      'Sentul, Bogor',
      '2026-03-01',
      '2026-12-31',
      null,
      150000000.00,
      'IDR',
      principal_profile_id,
      now() - interval '5 days',
      '2026-03-01T02:00:00Z',
      now() - interval '5 days',
      principal_profile_id,
      principal_profile_id
    ),
    (
      '20000000-0000-4000-8000-000000000005',
      'HDA-26005',
      'YPT Purwokerto 30 ha',
      'ypt-purwokerto-30-ha',
      '30000000-0000-4000-8000-000000000003',
      '40000000-0000-4000-8000-000000000003',
      'completed',
      'on_track',
      'Educational campus master plan and facility guidelines for 30 ha YPT Purwokerto.',
      'Purwokerto, Jawa Tengah',
      '2025-10-18',
      '2026-04-30',
      '2026-04-20',
      110000000.00,
      'IDR',
      supporting_profile_id,
      now() - interval '2 days',
      '2025-10-18T02:00:00Z',
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
    created_by,
    updated_by
  )
  values
    (
      '50000000-0000-4000-8000-000000000001',
      '20000000-0000-4000-8000-000000000001',
      '30000000-0000-4000-8000-000000000001',
      'INV-26001',
      'Master Plan Concept Milestone',
      '2026-03-28',
      '2026-04-12',
      40000000.00,
      'overdue',
      null,
      11.00,
      4400000.00,
      'unpaid',
      null,
      principal_profile_id,
      principal_profile_id
    ),
    (
      '50000000-0000-4000-8000-000000000002',
      '20000000-0000-4000-8000-000000000002',
      '30000000-0000-4000-8000-000000000001',
      'INV-26002',
      'Resort Layout Approval Stage',
      '2026-04-01',
      '2026-04-25',
      30000000.00,
      'issued',
      null,
      11.00,
      3300000.00,
      'unpaid',
      null,
      principal_profile_id,
      principal_profile_id
    ),
    (
      '50000000-0000-4000-8000-000000000003',
      '20000000-0000-4000-8000-000000000003',
      '30000000-0000-4000-8000-000000000001',
      'INV-26003',
      'Concept Framing Phase',
      '2026-03-30',
      '2026-04-15',
      35000000.00,
      'overdue',
      null,
      11.00,
      3850000.00,
      'unpaid',
      null,
      principal_profile_id,
      principal_profile_id
    ),
    (
      '50000000-0000-4000-8000-000000000004',
      '20000000-0000-4000-8000-000000000005',
      '30000000-0000-4000-8000-000000000003',
      'INV-26005',
      'Final Campus Closeout Certificate',
      '2026-04-05',
      '2026-04-20',
      40000000.00,
      'paid',
      '2026-04-15',
      11.00,
      4400000.00,
      'paid',
      null,
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
    updated_at = now();

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
    created_by,
    updated_by
  )
  values
    (
      '60000000-0000-4000-8000-000000000001',
      '20000000-0000-4000-8000-000000000001',
      '70000000-0000-4000-8000-000000000001',
      'Structural survey package',
      null,
      '2026-04-24',
      15000000.00,
      'due',
      null,
      11.00,
      1650000.00,
      'unpaid',
      null,
      principal_profile_id,
      principal_profile_id
    ),
    (
      '60000000-0000-4000-8000-000000000002',
      '20000000-0000-4000-8000-000000000003',
      '70000000-0000-4000-8000-000000000002',
      'Topographic mapping report',
      null,
      '2026-04-10',
      12000000.00,
      'overdue',
      null,
      11.00,
      1320000.00,
      'unpaid',
      null,
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
    updated_at = now();
end $$;
