# Build Log

This file is historical only. It is not an authority over:

- `studio_os_prd.md`
- active migrations
- live route structure
- reconciled docs contract in `docs/`

## 2026-08-27 (V1 UI Real-Estate + PDF Branding Round — D2/P2/U2/V2)

User feedback: "there is too much air, make it a little bit (just a little bit I mean) more efficient. Particularly on the left sidebar, I felt it is too wide." PM-coordinated 3-step sequential plan distributed by Orchestrator.

### Steps (strict serial — one agent at a time)

- **STEP 1 → Designer (w6:p2):** brief at `/tmp/designer-ui2.md`. Visual inspection + minimal whitespace/sidebar spec at `docs/design/2026-08-27-sidebar-whitespace.md`. Spec-only, no source edits.
- **STEP 2 → Coder (w6:p3):** brief at `/tmp/coder-pdfui2.md`. (A) PDF: add "HDA" sub-title under report title + bold project-name column. (B) Implement the Designer spec from STEP 1. Two commits.
- **STEP 3 → Tester (w6:p4):** brief at `/tmp/tester-v2.md`. Visual verify PDFs (HDA line + bold project names + alignment/margins) and UI (sidebar narrower + no clipping). Report at `docs/qa/2026-08-27-tester-v2-report.md`.

### Constraints

No migrations. No new vocabulary. No schema. No theme/font change. Sidebar trim is surgical (e.g. w-72 → w-64), not a redesign. PT Sans bold already registered in `lib/pdf/font-loader.ts`.

### Rate-limit note

Shared API key rate-limits at 20 req/60s. Agents dispatched strictly one at a time. Orchestrator waits for each agent to reach `idle` state (plus artifact / commit verification) before dispatching the next.

## 2026-08-27 (V1 Export Hardening Pass — E1/E2/E3)

Scope set by PM after Ibu Indri (QA user tester) Bahasa Indonesia feedback: "Ekspor data Studio App ke XLS untuk laporan lebih lengkap; selesaikan isu Project Owner/Lead yang belum muncul."

### Dispatched items

- **E1 — Fix Project Owner/Lead in XLSX export.** `lib/export/export-data.ts` was doing two queries: base select without owner/lead, then a fragile second select merged by `project_code` (not `id`). Collapse to a single select that includes `project_owner_name` and `project_lead_name` directly. CSV export (`app/api/export-projects/route.ts`) inherits the fix transparently.
- **E3 — Timestamp metadata row in XLSX exports.** Prepend a `Generated: <ISO>` row merged across all columns in both `lib/xlsx/projects-export.ts` and `lib/xlsx/finance-export.ts`. Update `tests/unit/xlsx-export.test.ts` row-count assertions from `dataRows + 1` to `dataRows + 2`.
- **E2 — PDF export endpoints + buttons.** New `app/api/export-projects-pdf/route.ts` and `app/api/export-finance-pdf/route.ts` using `@react-pdf/renderer` + `@fontsource/pt-sans` (PT Sans for the entire report — header + body — per PM Decision A). No CDN runtime fetch. New "Export PDF" button wired into `app/(workspace)/projects/page.tsx` and `app/(workspace)/finance/page.tsx` matching existing button styling. New `tests/unit/pdf-export.test.ts` asserts 200 + `application/pdf` + `%PDF-` magic bytes.

### PM decisions

- **Decision A (font):** PT Sans for the entire PDF. One family. No Lato.
- **Decision B (library):** `@react-pdf/renderer`. Bundle `@fontsource/pt-sans` at the top of each route module so it ships with the serverless function. No runtime CDN fetch.

### Dispatch order

1. E1 → Coder (single commit)
2. E3 → Coder (single commit)
3. E2 → Coder (single commit; deps + routes + button wiring + test)

### Constraints (still binding)

No migrations. No new vocabulary. No schema changes. No design overhaul. Same deferred list (termin planning, Restore, draft autosave, client short names, invoice status history) remains out of scope.

### Backlog deferred this round

The `/documents` and `/activity` page + sidebar gap (PRD §11.1) was investigated and confirmed real but deferred to a later round. Recorded at [`docs/backlog-export-and-routes-2026-08-27.md`](./backlog-export-and-routes-2026-08-27.md) as items B1/B2/B3.

## 2026-07-23 (V1 Corrective Release-Hardening Pass)

Completed a corrective release-hardening pass covering production domain validation extraction, auth/authorization state testing, recoverable sign-out error handling, partial domain query data preservation testing, migration safety hardening, and dependency vulnerability resolution.

Files modified/added:
- [`lib/validation/domain-validation.ts`](../lib/validation/domain-validation.ts): Created production domain validation module.
- [`lib/supabase/auth-evaluator.ts`](../lib/supabase/auth-evaluator.ts): Extracted pure workspace authorization evaluator (`is_active` active profile checking).
- [`lib/auth/sign-out-handler.ts`](../lib/auth/sign-out-handler.ts): Extracted sign-out error handling logic.
- [`lib/supabase/query-processor.ts`](../lib/supabase/query-processor.ts): Extracted pure domain query processing and partial data preservation logic.
- [`components/auth/sign-out-button.tsx`](../components/auth/sign-out-button.tsx): Updated to present recoverable error alerts on sign-out failure.
- [`app/(workspace)/actions.ts`](../app/(workspace)/actions.ts): Integrated production domain validation and Server Action row verification.
- [`supabase/migrations/20260423000004_release_hardening.sql`](../supabase/migrations/20260423000004_release_hardening.sql): Hardened pending migration with table-scoped constraint checks, explicit `search_path`, strict project existence check, and preflight SQL queries.
- [`tests/unit/validation.test.ts`](../tests/unit/validation.test.ts), [`tests/unit/auth.test.ts`](../tests/unit/auth.test.ts), [`tests/unit/sign-out.test.ts`](../tests/unit/sign-out.test.ts), [`tests/unit/queries.test.ts`](../tests/unit/queries.test.ts), [`tests/unit/env.test.ts`](../tests/unit/env.test.ts): Implemented 28 production-code unit tests.
- [`tests/e2e/smoke.spec.ts`](../tests/e2e/smoke.spec.ts): Updated Playwright smoke suite (2 passed, 1 skipped due to missing credentials).

Status:
- Implemented in source and verified via static checks and Vitest unit suite.
- Playwright smoke suite passed 2 unauthenticated tests; 1 authenticated test skipped due to absent credentials.
- Migration `20260423000004_release_hardening.sql` is present in source, statically reviewed, but **NOT APPLIED** to hosted database.

## 2026-04-22

Added the backend foundation for HDA StudioOS V1.

Files:

- [`supabase/migrations/20260422_000001_initial_foundation.sql`](../supabase/migrations/20260422_000001_initial_foundation.sql)
- [`supabase/seed.sql`](../supabase/seed.sql)
- [`docs/backend-foundation.md`](./backend-foundation.md)

Key decisions:

- kept finance operational and summary-oriented, not ledger-based
- modeled alerts as derived SQL views instead of mutable alert tables
- supported both uploaded documents and external links in one documents table
- kept foundation migration focused on normalized tables, check-constrained status fields, and overview views
- left advanced auth, RLS, storage-bucket, and traceability automation as later follow-on work
