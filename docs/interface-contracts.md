# AIM StudioOS V1 Interface Contracts

This document is the handoff contract for frontend, backend, and QA.

It describes what each live screen currently uses, where that data comes from, what may still stay placeholder-only, and what remains genuinely blocked.

Current framing:

- implemented product scope is stable and navigable in-repo
- schema is aligned and authenticated routes are rendering
- the main live-review blocker is hosted seed population
- intentionally deferred features remain separate from deployment failures

## Shared Source Rules

- live workspace pages read page-data adapters from [lib/studio-data.ts](/Users/doddy/Desktop/Github/studioos_vscode_april22/lib/studio-data.ts:1)
- `lib/studio-data.ts` reads from [lib/supabase/queries.ts](/Users/doddy/Desktop/Github/studioos_vscode_april22/lib/supabase/queries.ts:1)
- backend truth comes from [20260422_000001_initial_foundation.sql](/Users/doddy/Desktop/Github/studioos_vscode_april22/supabase/migrations/20260422_000001_initial_foundation.sql:1)
- implemented SQL row contracts use [lib/supabase/view-contracts.ts](/Users/doddy/Desktop/Github/studioos_vscode_april22/lib/supabase/view-contracts.ts:1)
- auth-aware route behavior comes from [lib/supabase/auth.ts](/Users/doddy/Desktop/Github/studioos_vscode_april22/lib/supabase/auth.ts:1)
- if Supabase is not configured or query loading fails, pages render fallback data with a warning banner

## Screen Contracts

### Login

- Route: `/login`
- Current implemented source:
  - `getServerAuthState()`
  - `LoginForm`
- Current backend source:
  - Supabase Auth session
  - `profiles` lookup when a user is authenticated
- Required fields:
  - `authEnabled`
  - `isAuthenticated`
  - `warning`
  - authenticated user profile when available
- Allowed placeholders:
  - preview-mode messaging when Supabase is not configured
- UX contract:
  - signed-out is a valid state
  - signed-out should render as a normal login surface, not as a warning condition
  - warning or notice copy should be reserved for environment, deployment, or integration failures
- Blocked items:
  - none at the read-contract level

### Dashboard

- Route: `/dashboard`
- Current implemented source:
  - `getDashboardPageData()`
- Current backend source:
  - `dashboard_snapshot_v`
  - `finance_overview_v`
  - `project_attention_items_v`
  - `project_attention_summary_v`
  - `projects`
  - `project_finance_summary_v`
  - `invoices`
  - `vendor_obligations`
  - `notes`
  - `activity_events`
- Required fields:
  - `metrics[].key`
  - `metrics[].label`
  - `metrics[].value`
  - `metrics[].currency`
  - `metrics[].note`
  - `attentionItems[].id`
  - `attentionItems[].projectId`
  - `attentionItems[].projectCode`
  - `attentionItems[].projectName`
  - `attentionItems[].clientName`
  - `attentionItems[].label`
  - `attentionItems[].summary`
  - `attentionItems[].createdAt`
  - `activeProjects[].id`
  - `activeProjects[].projectCode`
  - `activeProjects[].name`
  - `activeProjects[].clientName`
  - `activeProjects[].lifecycleStatus`
  - `activeProjects[].healthStatus`
  - `activeProjects[].contractValue.amount`
  - `activeProjects[].outstandingReceivable.amount`
  - `activeProjects[].outstandingPayable.amount`
  - `activeProjects[].attentionCount`
  - `activeProjects[].updatedAt`
  - `overdueInvoices[].id`
  - `overdueInvoices[].projectId`
  - `overdueInvoices[].projectCode`
  - `overdueInvoices[].projectName`
  - `overdueInvoices[].clientName`
  - `overdueInvoices[].invoiceNumber`
  - `overdueInvoices[].title`
  - `overdueInvoices[].dueDate`
  - `overdueInvoices[].invoiceAmount.amount`
  - `unpaidVendorObligations[].id`
  - `unpaidVendorObligations[].projectId`
  - `unpaidVendorObligations[].projectCode`
  - `unpaidVendorObligations[].projectName`
  - `unpaidVendorObligations[].vendorName`
  - `unpaidVendorObligations[].title`
  - `unpaidVendorObligations[].dueDate`
  - `unpaidVendorObligations[].amount.amount`
  - `recentNotes[].id`
  - `recentNotes[].projectCode`
  - `recentNotes[].title`
  - `recentNotes[].bodyPreview`
  - `recentNotes[].noteType`
  - `recentNotes[].authorName`
  - `recentNotes[].notedAt`
  - `recentActivity[].id`
  - `recentActivity[].projectCode`
  - `recentActivity[].projectName`
  - `recentActivity[].summary`
  - `recentActivity[].entityType`
  - `recentActivity[].occurredAt`
- Remaining placeholder areas:
  - preview fallback records when Supabase is not configured or query loading fails
- Blocked items:
  - missing-document attention signal is intentionally absent until backend derivation exists

Current attention-count rule:

- `metrics[projects_needing_attention]` must read `dashboard_snapshot_v.projects_needing_attention`
- that dashboard field is derived from `project_attention_summary_v.needs_attention`
- the attention list itself must read `project_attention_items_v`

### Projects

- Route: `/projects`
- Current implemented source:
  - `getProjectsPageData()`
- Current backend source:
  - `projects`
  - `project_finance_summary_v`
  - `project_attention_summary_v`
  - joined client relation
- Required fields:
  - `filters.q`
  - `filters.lifecycle`
  - `filters.health`
  - `items[].id`
  - `items[].slug`
  - `items[].projectCode`
  - `items[].name`
  - `items[].clientName`
  - `items[].lifecycleStatus`
  - `items[].healthStatus`
  - `items[].contractValue.amount`
  - `items[].outstandingReceivable.amount`
  - `items[].outstandingPayable.amount`
  - `items[].attentionCount`
  - `items[].updatedAt`
  - `totalCount`
  - `filteredCount`
- Remaining placeholder areas:
  - preview fallback records when Supabase is not configured or query loading fails
- Blocked items:
  - none at the read-contract level

### Project Detail

- Route: `/projects/[projectId]`
- Current implemented source:
  - `getProjectDetailPageData(projectId)`
- Current backend source:
  - `projects`
  - `project_finance_summary_v`
  - `project_attention_items_v`
  - `invoices`
  - `vendor_obligations`
  - `documents`
  - `notes`
  - `activity_events`
  - joined client, primary contact, project owner, and vendor relations
- Required fields:
  - `project.id`
  - `project.slug`
  - `project.projectCode`
  - `project.name`
  - `project.clientName`
  - `project.primaryContactName`
  - `project.primaryContactEmail`
  - `project.projectOwnerName`
  - `project.lifecycleStatus`
  - `project.healthStatus`
  - `project.summary`
  - `project.location`
  - `project.startDate`
  - `project.targetEndDate`
  - `project.completedAt`
  - `project.lastReviewedAt`
  - `project.contractValue.amount`
  - `financeSummary.contractValue.amount`
  - `financeSummary.totalInvoiced.amount`
  - `financeSummary.totalPaid.amount`
  - `financeSummary.outstandingReceivable.amount`
  - `financeSummary.totalVendorValue.amount`
  - `financeSummary.outstandingPayable.amount`
  - `financeSummary.unpaidTax.amount`
  - `attentionItems[].label`
  - `attentionItems[].summary`
  - `invoices[].invoiceNumber`
  - `invoices[].title`
  - `invoices[].status`
  - `invoices[].invoiceAmount.amount`
  - `vendorObligations[].vendorName`
  - `vendorObligations[].title`
  - `vendorObligations[].status`
  - `vendorObligations[].amount.amount`
  - `documents[].title`
  - `documents[].category`
  - `documents[].sourceType`
  - `documents[].documentDate`
  - `documents[].reference`
  - `documents[].linkHref`
  - `notes[].title`
  - `notes[].bodyPreview`
  - `notes[].noteType`
  - `notes[].authorName`
  - `notes[].notedAt`
  - `activity[].summary`
  - `activity[].entityType`
  - `activity[].occurredAt`
- Remaining placeholder areas:
  - preview fallback records when Supabase is not configured or query loading fails
  - file-backed document rows without resolved URLs render a stored-file reference string
- Blocked items:
  - missing-document attention signal is intentionally absent until backend derivation exists
  - file URL delivery for stored documents still depends on storage follow-up

### Finance

- Route: `/finance`
- Current implemented source:
  - `getFinancePageData()`
- Current backend source:
  - `finance_overview_v`
  - `project_finance_summary_v`
  - `invoices`
  - `vendor_obligations`
  - joined project, client, and vendor relations
- Required fields:
  - `summary.contractValue.amount`
  - `summary.totalInvoiced.amount`
  - `summary.totalPaid.amount`
  - `summary.outstandingReceivable.amount`
  - `summary.totalVendorValue.amount`
  - `summary.outstandingPayable.amount`
  - `summary.unpaidTax.amount`
  - `overdueInvoices[].id`
  - `overdueInvoices[].projectId`
  - `overdueInvoices[].projectCode`
  - `overdueInvoices[].projectName`
  - `overdueInvoices[].clientName`
  - `overdueInvoices[].invoiceNumber`
  - `overdueInvoices[].title`
  - `overdueInvoices[].status`
  - `overdueInvoices[].invoiceAmount.amount`
  - `overdueInvoices[].dueDate`
  - `unpaidVendorObligations[].id`
  - `unpaidVendorObligations[].projectId`
  - `unpaidVendorObligations[].projectCode`
  - `unpaidVendorObligations[].projectName`
  - `unpaidVendorObligations[].vendorName`
  - `unpaidVendorObligations[].title`
  - `unpaidVendorObligations[].status`
  - `unpaidVendorObligations[].amount.amount`
  - `unpaidVendorObligations[].dueDate`
- Remaining placeholder areas:
  - preview fallback records when Supabase is not configured or query loading fails
- Blocked items:
  - none at the read-contract level

### Documents

- Route: `/documents`
- Current implemented source:
  - `getDocumentsPageData()`
- Current backend source:
  - `documents`
  - joined project relation
- Required fields:
  - `items[].id`
  - `items[].projectId`
  - `items[].projectCode`
  - `items[].projectName`
  - `items[].title`
  - `items[].category`
  - `items[].sourceType`
  - `items[].documentDate`
  - `items[].reference`
  - `items[].linkHref`
  - `items[].updatedAt`
  - `totalCount`
- Remaining placeholder areas:
  - file-backed rows render `Stored file reference: <file_path>` until file delivery is wired
  - preview fallback records when Supabase is not configured or query loading fails
- Blocked items:
  - signed or public file URL resolution for stored documents

### Notes & Activity

- Route: `/activity`
- Current implemented source:
  - `getActivityPageData()`
- Current backend source:
  - `notes`
  - `activity_events`
  - joined project and profile relations
- Required note fields:
  - `notes[].id`
  - `notes[].projectId`
  - `notes[].projectCode`
  - `notes[].projectName`
  - `notes[].title`
  - `notes[].bodyPreview`
  - `notes[].noteType`
  - `notes[].authorName`
  - `notes[].notedAt`
- Required activity fields:
  - `activity[].id`
  - `activity[].projectId`
  - `activity[].projectCode`
  - `activity[].projectName`
  - `activity[].actorName`
  - `activity[].eventType`
  - `activity[].entityType`
  - `activity[].summary`
  - `activity[].occurredAt`
- Remaining placeholder areas:
  - preview fallback records when Supabase is not configured or query loading fails
  - note `bodyPreview` remains a frontend truncation adapter
- Blocked items:
  - none at the read-contract level

### Settings

- Route: `/settings`
- Current implemented source:
  - `getSettingsPageData()`
  - `getServerAuthState()`
- Current backend source:
  - `studio_profile`
  - Supabase Auth session
  - `profiles`
- Required fields:
  - `studioName`
  - `defaultCurrency`
  - `timezone`
  - `viewerRole`
  - `viewerEmail`
  - auth environment readiness
- Remaining placeholder areas:
  - preview-mode role and email display when Supabase is not configured
- Blocked items:
  - no studio-profile write flow

## Integration Assumptions

- keep the current page shells and route map intact
- do not reintroduce old scaffold-only language into docs or contracts
- use SQL and `view-contracts.ts` as the row-level truth, then adapt into page models in `lib/studio-data.ts`
- treat `watch`, `at_risk`, `overdue_invoice`, `unpaid_vendor`, and `stale_review` as the live attention labels
- treat missing documents as intentionally excluded from current attention behavior
- keep `/notes` as a compatibility redirect to `/activity`

## Backend And Builder Handoff

- blocked by environment:
  - hosted dataset is still awaiting meaningful seed population
  - cross-screen live review remains limited until seeded records exist
- do not redesign:
  - current V1 routes
  - current module ownership
  - login as a valid signed-out surface
  - attention semantics
  - `/notes` redirect behavior
- stable in V1:
  - route-complete navigation
  - query-backed page loaders
  - auth-aware workspace gating
  - authenticated route rendering
  - missing-documents remaining non-live by design
