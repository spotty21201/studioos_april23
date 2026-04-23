# Supabase Scaffold

This directory contains the backend scaffold for AIM StudioOS V1.

Current files:

- `migrations/20260422_000001_initial_foundation.sql`

Implementation rules:

- keep write tables normalized
- expose read-optimized views for overview surfaces
- keep V1 finance operational and visibility-first
- store document metadata in Postgres and files in Supabase Storage

Required app environment variables:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

Recommended next backend steps:

1. Apply the initial migration to a local Supabase project.
2. Add Row Level Security policies for authenticated internal users.
3. Configure the `project-documents` storage bucket.
4. Replace mock selectors with live selectors and query functions.
