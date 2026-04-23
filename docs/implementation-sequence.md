# AIM StudioOS V1 Implementation Sequence

This file is the integration-state and sequencing authority after reconciliation.

It reflects the current repository state and the next safe order of work.

## Current State

### Already Present

- product scope document in [studio_os_prd.md](/Users/doddy/Desktop/Github/studioos_vscode_april22/studio_os_prd.md:1)
- live frontend route structure in [app/](/Users/doddy/Desktop/Github/studioos_vscode_april22/app:1)
- query-backed page adapters in [lib/studio-data.ts](/Users/doddy/Desktop/Github/studioos_vscode_april22/lib/studio-data.ts:1)
- live Supabase query layer in [lib/supabase/queries.ts](/Users/doddy/Desktop/Github/studioos_vscode_april22/lib/supabase/queries.ts:1)
- auth-aware session gating in [lib/supabase/auth.ts](/Users/doddy/Desktop/Github/studioos_vscode_april22/lib/supabase/auth.ts:1) and [app/(workspace)/layout.tsx](/Users/doddy/Desktop/Github/studioos_vscode_april22/app/(workspace)/layout.tsx:1)
- current backend foundation migration in [supabase/migrations/20260422_000001_initial_foundation.sql](/Users/doddy/Desktop/Github/studioos_vscode_april22/supabase/migrations/20260422_000001_initial_foundation.sql:1)
- implemented SQL view contracts in [lib/supabase/view-contracts.ts](/Users/doddy/Desktop/Github/studioos_vscode_april22/lib/supabase/view-contracts.ts:1)
- functionally navigable V1 route set after login
- hosted schema alignment
- authenticated route rendering in the hosted environment

### Not Yet Present

- hosted seed data population for meaningful live review
- RLS policies
- storage bucket wiring and file URL delivery
- create and edit forms
- mutation-driven activity event automation
- missing-document derivation
- pagination and search expansion beyond the current project list filters

## Recommended Next Order

### 1. Hosted Environment Alignment

Owner:

- Supabase/auth agent
- backend agent
- deploy or builder agent

Work:

- apply [supabase/seed.sql](/Users/doddy/Desktop/Github/studioos_vscode_april22/supabase/seed.sql:1) or equivalent hosted seed content
- verify dashboard, projects, finance, documents, and activity have meaningful hosted records
- run the deployed-environment Playwright authenticated smoke test against seeded data

Reason:

- schema and auth alignment are already in place
- hosted seed data is now the next blocker for meaningful product review

### 2. Storage And Documents Follow-up

Owner:

- Supabase/storage agent
- documents agent

Work:

- configure the project documents bucket
- resolve stored-file document rows to signed or public URLs
- keep external-link behavior unchanged

Reason:

- the documents screens are already query-backed
- file delivery is the main remaining read-surface gap

### 3. RLS And Access Hardening

Owner:

- Supabase/auth agent
- backend agent

Work:

- add RLS policies for authenticated internal users
- verify that current query paths still work under those policies
- keep preview fallback behavior limited to unconfigured environments and failed local integration states

### 4. Mutation Surfaces

Owner:

- backend agent
- frontend feature agents by module

Work:

- use [crud-v1.md](/Users/doddy/Desktop/Github/studioos_vscode_april22/docs/crud-v1.md:1) as the V1 CRUD scope and interaction handoff
- add create and edit flows only after read paths remain stable
- emit `activity_events` from meaningful writes
- avoid introducing new entities or statuses during write-surface work

### 5. Missing-Document Derivation

Owner:

- backend agent
- documents agent

Work:

- add real requirement logic only if product decides V1 needs a live missing-documents signal
- update attention views only after that derivation exists in SQL

### 6. QA Hardening

Owner:

- QA/integration agent

Work:

- verify route inventory
- verify page contracts against `lib/studio-data.ts`
- verify every documented status and type against SQL and `view-contracts.ts`
- verify that `/notes` remains a redirect and not a duplicate screen
- verify attention semantics against `project_attention_items_v` and `project_attention_summary_v`
- verify hosted Supabase behavior matches repo schema expectations

## Release Readiness Checklist

- hosted migration is applied
- authenticated workspace routes render
- authenticated `profiles` lookup passes
- hosted seed data is populated
- deployed-environment Playwright authenticated smoke test passes

## Sequencing Rules

- do not redesign screens while performing integration hardening
- do not add backend tables just to satisfy hypothetical future behavior
- do not document a new route, field, view, or blocker until it exists in code or SQL
- keep V1 attention semantics locked to:
  - `health_status != on_track`
  - overdue invoice
  - overdue vendor obligation
  - stale review
- keep missing documents out of live attention until a real SQL derivation exists
