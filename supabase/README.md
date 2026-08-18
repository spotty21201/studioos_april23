# Supabase Scaffold

This directory contains the backend scaffold and database migrations for HDA StudioOS V1.

Current migration sequence:

- `migrations/20260422_000001_initial_foundation.sql` (Foundation schema, views, constraints)
- `migrations/20260423000002_safe_v1_writes.sql` (Write RPCs, initial RLS policies)
- `migrations/20260423000003_restrict_anon_read_views.sql` (Anonymous view access restrictions)
- `migrations/20260423000004_release_hardening.sql` (Pending release hardening constraints, date ordering, client-match trigger, and preflight SQL queries)
- `migrations/20260423000005_hda_rebranding.sql` (Canonical studio-name rebranding)
- `migrations/20260803_000001_project_owner_refactor.sql` (Owner-name fields, archive support, and archive-aware attention views)
- `migrations/20260818000001_fix_create_project_rpc.sql` (Current project-creation RPC signature and PostgREST schema-cache reload)
- `migrations/20260818000002_fix_update_project_rpc.sql` (Current project-update RPC body and removed-column cleanup)

Implementation rules:

- keep write tables normalized
- expose read-optimized views for overview surfaces
- keep V1 finance operational and visibility-first
- store document metadata in Postgres and external links/files in storage

Required app environment variables:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
