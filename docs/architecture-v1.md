# AIM StudioOS V1 Architecture

This document is the reconciled implementation contract for the current codebase.

It is aligned to:

- [studio_os_prd.md](/Users/doddy/Desktop/Github/studioos_vscode_april22/studio_os_prd.md:1)
- [supabase/migrations/20260422_000001_initial_foundation.sql](/Users/doddy/Desktop/Github/studioos_vscode_april22/supabase/migrations/20260422_000001_initial_foundation.sql:1)
- [app/](/Users/doddy/Desktop/Github/studioos_vscode_april22/app:1)
- [lib/supabase/queries.ts](/Users/doddy/Desktop/Github/studioos_vscode_april22/lib/supabase/queries.ts:1)
- [lib/supabase/auth.ts](/Users/doddy/Desktop/Github/studioos_vscode_april22/lib/supabase/auth.ts:1)
- [lib/studio-data.ts](/Users/doddy/Desktop/Github/studioos_vscode_april22/lib/studio-data.ts:1)

## Current V1 Boundary

### In Scope

- Principal-first leadership overview
- project list and project detail drill-down
- finance visibility for invoices, vendor obligations, and simple tax state
- document visibility
- notes and recent activity visibility
- settings limited to studio profile and integration readiness
- Supabase-backed reads when environment variables are configured
- Supabase-auth-aware workspace access when environment variables are configured
- route-complete navigation across the implemented V1 surfaces

### Out of Scope

- full accounting
- partial payments
- approval chains
- team workflow
- timesheets
- multi-studio mode
- AI features
- advanced permissions UX
- procurement workflows
- missing-document attention derivation

## Current Frontend Structure

The live route structure is:

```text
app/
  page.tsx                  -> redirects to /login
  login/page.tsx
  (workspace)/
    layout.tsx             -> auth-aware workspace shell
    dashboard/page.tsx
    projects/page.tsx
    projects/[projectId]/page.tsx
    finance/page.tsx
    documents/page.tsx
    activity/page.tsx
    notes/page.tsx         -> redirects to /activity
    settings/page.tsx
```

There is no current `app/(auth)` route group and no current `app/(app)` route group.

## Route Map

| Route | Type | Current Purpose |
|---|---|---|
| `/` | redirect | sends users to `/login` |
| `/login` | page | login bridge with Supabase auth-state detection and preview-mode fallback |
| `/dashboard` | page | overview metrics, attention preview, recent notes, recent activity, and active-project snapshot |
| `/projects` | page | filterable project list |
| `/projects/[projectId]` | page | project detail drill-down |
| `/finance` | page | cross-project finance summary, overdue invoices, open vendor obligations |
| `/documents` | page | cross-project document index |
| `/activity` | page | recent notes and recent activity |
| `/notes` | redirect | compatibility redirect to `/activity` |
| `/settings` | page | studio profile and integration readiness |

## Screen Inventory

| Screen | Route | Current State |
|---|---|---|
| Login | `/login` | auth-aware when Supabase is configured, preview-mode fallback when it is not |
| Dashboard | `/dashboard` | query-backed through `getDashboardPageData()` |
| Projects | `/projects` | query-backed through `getProjectsPageData()` |
| Project Detail | `/projects/[projectId]` | query-backed through `getProjectDetailPageData()` |
| Finance | `/finance` | query-backed through `getFinancePageData()` |
| Documents | `/documents` | query-backed through `getDocumentsPageData()` |
| Notes & Activity | `/activity` | query-backed through `getActivityPageData()` |
| Settings | `/settings` | query-backed through `getSettingsPageData()` plus auth-state integration |

## Module Ownership

| Module | Owns | Does Not Own |
|---|---|---|
| Dashboard | overview composition, metric presentation, cross-module briefing surfaces, attention preview | source records |
| Projects | project list, project detail, project header metadata | invoices, vendor obligations, documents, notes |
| Finance | invoices, vendor obligations, tax visibility, finance summaries | ledger accounting |
| Documents | document metadata and link/file visibility | approval workflow, lifecycle automation |
| Notes | notes display and note typing | task workflow |
| Activity | activity event display | project status business logic |
| Settings | studio profile display, integration readiness display | workspace admin console |

## Route-to-Data-Source Map

| Route | Implemented Page Source | Current Backend Source | Current Status |
|---|---|---|---|
| `/login` | [getServerAuthState()](/Users/doddy/Desktop/Github/studioos_vscode_april22/lib/supabase/auth.ts:27) | Supabase Auth user session plus `profiles` lookup when configured | live with preview fallback |
| `/dashboard` | [getDashboardPageData()](/Users/doddy/Desktop/Github/studioos_vscode_april22/lib/studio-data.ts:356) | `dashboard_snapshot_v` with `projects_needing_attention` derived from `project_attention_summary_v`, plus `finance_overview_v`, `project_attention_items_v`, `projects`, `project_finance_summary_v`, `invoices`, `vendor_obligations`, `notes`, `activity_events` | live |
| `/projects` | [getProjectsPageData()](/Users/doddy/Desktop/Github/studioos_vscode_april22/lib/studio-data.ts:429) | `projects`, `project_finance_summary_v`, `project_attention_summary_v`, joined client relation | live |
| `/projects/[projectId]` | [getProjectDetailPageData()](/Users/doddy/Desktop/Github/studioos_vscode_april22/lib/studio-data.ts:475) | `projects`, `project_finance_summary_v`, `project_attention_items_v`, `invoices`, `vendor_obligations`, `documents`, `notes`, `activity_events`, joined client/contact/profile/vendor relations | live |
| `/finance` | [getFinancePageData()](/Users/doddy/Desktop/Github/studioos_vscode_april22/lib/studio-data.ts:544) | `finance_overview_v`, `project_finance_summary_v`, `invoices`, `vendor_obligations`, joined project/client/vendor relations | live |
| `/documents` | [getDocumentsPageData()](/Users/doddy/Desktop/Github/studioos_vscode_april22/lib/studio-data.ts:585) | `documents`, joined project relation | live |
| `/activity` | [getActivityPageData()](/Users/doddy/Desktop/Github/studioos_vscode_april22/lib/studio-data.ts:597) | `notes`, `activity_events`, joined project and profile relations | live |
| `/settings` | [getSettingsPageData()](/Users/doddy/Desktop/Github/studioos_vscode_april22/lib/studio-data.ts:611) and [getServerAuthState()](/Users/doddy/Desktop/Github/studioos_vscode_april22/lib/supabase/auth.ts:27) | `studio_profile`, Supabase Auth, `profiles` | live |

## Page-to-View/Table Dependency Map

| Screen | Required Backend Objects |
|---|---|
| Dashboard | `dashboard_snapshot_v` with `projects_needing_attention` sourced from `project_attention_summary_v`, plus `finance_overview_v`, `project_attention_items_v`, `project_attention_summary_v`, `projects`, `project_finance_summary_v`, `invoices`, `vendor_obligations`, `notes`, `activity_events`, joined `clients` relation where applicable |
| Projects | `projects`, `project_finance_summary_v`, `project_attention_summary_v`, joined `clients` relation |
| Project Detail | `projects`, `project_finance_summary_v`, `project_attention_items_v`, `invoices`, `vendor_obligations`, `documents`, `notes`, `activity_events`, joined `clients`, `client_contacts`, `profiles`, and `vendors` relations |
| Finance | `finance_overview_v`, `project_finance_summary_v`, `invoices`, `vendor_obligations`, joined `projects`, `clients`, and `vendors` relations |
| Documents | `documents`, joined `projects` relation |
| Notes & Activity | `notes`, `activity_events`, joined `projects` and `profiles` relations |
| Settings | `studio_profile`, `profiles` via auth, Supabase Auth session |

## V1 Attention Semantics

`Needs attention` is locked to the current V1 meaning:

- `health_status != on_track`
- overdue invoice
- overdue vendor obligation
- stale review

Important implementation note:

- the semantic rule above is authoritative for product behavior
- the current SQL and TypeScript attention label enum remains `watch`, `at_risk`, `overdue_invoice`, `unpaid_vendor`, and `stale_review`
- `unpaid_vendor` is the current emitted label name for the overdue vendor obligation signal
- dashboard metric `projects_needing_attention` comes from `dashboard_snapshot_v`, which counts `project_attention_summary_v.needs_attention`
- missing documents are not part of live attention until there is a real backend derivation

## Current Integration Reality

The implemented product surface is stable enough to treat as V1 structure truth.

- route inventory is in place
- login, dashboard, projects, finance, documents, activity, and settings are implemented surfaces
- schema alignment is in place
- authenticated routes are rendering in the hosted environment
- the next live-review gap is hosted seed data population

### Environment Truth Vs Repo Truth

Repo truth:

- the migration defines `public.profiles`
- the route and auth model expects `profiles` to be available after login
- the repo includes hosted seed content in `supabase/seed.sql`

Hosted truth:

- the hosted schema drift has been resolved by applying the repo migration
- authenticated navigation is rendering in the hosted environment
- live review is still limited because the hosted dataset has not yet been populated with meaningful seed records

Interpretation:

- this is a hosted backend alignment issue
- this is not a product-architecture issue
- this does not justify redesigning screens or route ownership

### Deployment-State Summary

- implemented V1 scope remains unchanged
- schema and route alignment are in place
- current next step is hosted seed population for meaningful live review
- builder work should focus on seed data before new UI or product work

### Data Loading

- workspace pages load through `lib/studio-data.ts`
- `lib/studio-data.ts` reads from `lib/supabase/queries.ts`
- when Supabase environment variables are missing, the query layer falls back to isolated preview records
- when Supabase query loading fails, the query layer also falls back with a warning banner

### Auth Gating

- `/login` checks current auth state with `getServerAuthState()`
- `(workspace)/layout.tsx` redirects unauthenticated users to `/login` when auth is configured
- signed-out is a valid state on the login surface
- signed-out should not be documented or treated as an application warning condition
- when Supabase is not configured, workspace routes remain available in clearly marked preview mode

## Intentionally Deferred

- RLS policies
- storage bucket configuration and signed file delivery
- create and edit forms
- activity event emission automation for all mutations
- missing-document derivation in SQL
- pagination and search beyond current page-level filters
- project-manager and project-coordinator role behavior

## Handoff Note

Backend and builder should treat the following as current truth:

- blocked by environment:
  - hosted dataset is still too empty for meaningful live review
  - seeded project, finance, document, note, and activity records are not yet available in the hosted app
- do not redesign:
  - route structure
  - V1 module boundaries
  - attention semantics
  - `/notes` redirect behavior
- stable in V1:
  - Principal-first route map
  - query-backed page loaders
  - auth-aware workspace shell
  - authenticated route rendering
  - current attention semantics without missing-documents

## Product Naming Rules

Use these exact screen labels in the app:

- `Dashboard`
- `Projects`
- `Project Detail`
- `Finance`
- `Documents`
- `Notes & Activity`
- `Settings`

Use these exact route paths:

- `/dashboard`
- `/projects`
- `/projects/[projectId]`
- `/finance`
- `/documents`
- `/activity`
- `/settings`

`/notes` is a redirect route only. It is not a separate screen contract.
