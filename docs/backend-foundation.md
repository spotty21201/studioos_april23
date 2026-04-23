# AIM StudioOS Backend Foundation

This document describes what the current backend foundation actually provides today.

Authoritative source:

- [20260422_000001_initial_foundation.sql](/Users/doddy/Desktop/Github/studioos_vscode_april22/supabase/migrations/20260422_000001_initial_foundation.sql:1)

Supporting TypeScript contracts:

- [lib/supabase/view-contracts.ts](/Users/doddy/Desktop/Github/studioos_vscode_april22/lib/supabase/view-contracts.ts:1)

Supporting query layer:

- [lib/supabase/queries.ts](/Users/doddy/Desktop/Github/studioos_vscode_april22/lib/supabase/queries.ts:1)
- [lib/supabase/auth.ts](/Users/doddy/Desktop/Github/studioos_vscode_april22/lib/supabase/auth.ts:1)

## What Exists In SQL

### Tables

- `profiles`
- `studio_profile`
- `clients`
- `client_contacts`
- `projects`
- `vendors`
- `invoices`
- `vendor_obligations`
- `documents`
- `notes`
- `activity_events`

### Functions

- `set_updated_at()`
- `validate_project_primary_contact()`

### Views

- `project_finance_summary_v`
- `project_attention_v`
- `project_attention_items_v`
- `project_attention_summary_v`
- `finance_overview_v`
- `dashboard_snapshot_v`

### Triggers

- one `updated_at` trigger per main table
- one `validate_projects_primary_contact` trigger on `projects`

## What Exists In The App Layer

- `getStudioOsSource()` performs live Supabase reads when environment variables are configured
- `getStudioOsSource()` falls back to isolated preview records when environment variables are missing or read queries fail
- `getServerAuthState()` is auth-aware and checks Supabase session state when environment variables are configured
- `(workspace)/layout.tsx` enforces login redirection only when auth is configured

## Environment Truth Vs Repo Truth

Repo truth:

- `public.profiles` exists in the migration
- app auth and workspace loaders are built to read `profiles` after authentication

Hosted truth:

- the hosted schema drift has been resolved by applying the repo migration
- authenticated routes are rendering against the hosted environment
- the remaining hosted gap is seed population for meaningful live review

Interpretation:

- this is a deployment and hosted integration problem
- this is not evidence that the repo schema or product model should be changed

## Deployment-State Summary

- the hosted project now has the expected migrated schema
- authenticated workspace routes are rendering
- the remaining deployment blocker is hosted seed population
- meaningful dataset coverage now blocks progress more than new product or UI work

## Release Readiness Checklist

- hosted project has the current migration applied
- authenticated workspace routes render
- authenticated `profiles` lookup succeeds
- hosted seed data is populated
- deployed-environment authenticated Playwright smoke test succeeds

## What Does Not Exist Yet

- RLS policies in SQL
- storage bucket setup and signed file delivery
- write RPCs
- missing-document derivation
- end-user create and edit flows

## Current Backend Notes That Frontend Must Respect

### Attention Data

The canonical V1 attention read models are:

- `project_attention_items_v`
- `project_attention_summary_v`
- `dashboard_snapshot_v` for aggregate dashboard counts

`project_attention_v` still exists as a lower-level boolean compatibility view, but the frontend should consume the item and summary views for dashboard and project surfaces.

`dashboard_snapshot_v.projects_needing_attention` now comes from `project_attention_summary_v.needs_attention`.

### Locked Attention Meaning

`Needs attention` means:

- `health_status != on_track`
- overdue invoice
- overdue vendor obligation
- stale review

Important implementation note:

- the current emitted label for the overdue vendor obligation signal is `unpaid_vendor`
- the lower-level boolean field name remains `has_unpaid_vendor`
- both currently represent overdue vendor obligations because the SQL checks `vendor_obligations.status = 'overdue'`

### Missing Documents

Missing-document derivation is not live. `project_attention_v.has_missing_documents` returns `false`, and missing documents are intentionally excluded from `project_attention_items_v` and `project_attention_summary_v`.

### Settings

`studio_profile` exists and is query-backed. The settings screen also depends on auth and env readiness from the app layer.

### View Contracts

If frontend code fetches the current SQL views directly, use the row types in [lib/supabase/view-contracts.ts](/Users/doddy/Desktop/Github/studioos_vscode_april22/lib/supabase/view-contracts.ts:1) at the data boundary.
