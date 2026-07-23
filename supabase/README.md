# Supabase Scaffold

This directory contains the backend scaffold and database migrations for HDA StudioOS V1.

Current migration sequence:

- `migrations/20260422_000001_initial_foundation.sql` (Foundation schema, views, constraints)
- `migrations/20260423000002_safe_v1_writes.sql` (Write RPCs, initial RLS policies)
- `migrations/20260423000003_restrict_anon_read_views.sql` (Anonymous view access restrictions)
- `migrations/20260423000004_release_hardening.sql` (Pending release hardening constraints, date ordering, client-match trigger, and preflight SQL queries)

Implementation rules:

- keep write tables normalized
- expose read-optimized views for overview surfaces
- keep V1 finance operational and visibility-first
- store document metadata in Postgres and external links/files in storage

Required app environment variables:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
