# AIM StudioOS Controlled Vocabulary

This file lists the exact current vocabulary that matches:

- the live routes in [app/](/Users/doddy/Desktop/Github/studioos_vscode_april22/app:1)
- the live backend values in [20260422_000001_initial_foundation.sql](/Users/doddy/Desktop/Github/studioos_vscode_april22/supabase/migrations/20260422_000001_initial_foundation.sql:1)
- the live TypeScript contracts in [lib/supabase/view-contracts.ts](/Users/doddy/Desktop/Github/studioos_vscode_april22/lib/supabase/view-contracts.ts:1)

If a value is not present in the migration, the route tree, or the implemented TypeScript contracts, it is not canonical here.

## Screen Labels and Routes

| Label | Route |
|---|---|
| Dashboard | `/dashboard` |
| Projects | `/projects` |
| Project Detail | `/projects/[projectId]` |
| Finance | `/finance` |
| Documents | `/documents` |
| Notes & Activity | `/activity` |
| Settings | `/settings` |
| Login | `/login` |

`/notes` is a redirect alias to `/activity`. It is not a separate canonical screen.

## Roles

Current `profiles.role` values:

- `principal`
- `director`
- `senior_associate`
- `operations`
- `team_member`

Deferred:

- `project_manager`
- `project_coordinator`

These future roles appear in product planning but do not exist in the current migration.

## Project Vocabulary

Current `projects.lifecycle_status` values:

- `proposal`
- `active`
- `on_hold`
- `completed`
- `cancelled`

Current `projects.health_status` values:

- `on_track`
- `watch`
- `at_risk`

## Finance Vocabulary

Current `invoices.status` values:

- `draft`
- `issued`
- `paid`
- `overdue`
- `cancelled`

Current `vendor_obligations.status` values:

- `planned`
- `due`
- `paid`
- `overdue`
- `cancelled`

Current `tax_status` values in both finance tables:

- `not_applicable`
- `unpaid`
- `paid`

## Document Vocabulary

Current `documents.category` values:

- `proposal`
- `contract`
- `client_document`
- `deliverable`
- `support_document`
- `invoice_attachment`
- `vendor_attachment`

Current `documents.source_type` values:

- `file`
- `external_link`

Current `documents.linked_entity_type` values:

- `project`
- `invoice`
- `vendor_obligation`

## Note Vocabulary

Current `notes.note_type` values:

- `meeting_note`
- `agreement`
- `issue`
- `reminder`
- `follow_up`
- `decision`

Current `notes.linked_entity_type` values:

- `project`
- `invoice`
- `vendor_obligation`
- `document`

## Activity Vocabulary

Current `activity_events.entity_type` values:

- `project`
- `invoice`
- `vendor_obligation`
- `document`
- `note`

Current `activity_events.event_type` values:

- `project_created`
- `project_updated`
- `project_status_changed`
- `invoice_created`
- `invoice_updated`
- `invoice_status_changed`
- `vendor_obligation_created`
- `vendor_obligation_updated`
- `vendor_obligation_status_changed`
- `document_added`
- `document_updated`
- `note_created`
- `note_updated`

## SQL View Vocabulary

Current implemented views:

- `project_finance_summary_v`
- `project_attention_v`
- `project_attention_items_v`
- `project_attention_summary_v`
- `finance_overview_v`
- `dashboard_snapshot_v`

Current `project_attention_v` fields:

- `has_overdue_invoice`
- `has_unpaid_vendor`
- `has_missing_documents`
- `is_stale`

Current `dashboard_snapshot_v` fields:

- `active_projects`
- `projects_needing_attention`

Current `projects_needing_attention` derivation:

- count of projects where `project_attention_summary_v.needs_attention = true`

Current `project_attention_items_v.attention_label` values:

- `watch`
- `at_risk`
- `overdue_invoice`
- `unpaid_vendor`
- `stale_review`

## Attention Semantics

`Needs attention` means any of the following:

- `health_status != on_track`
- overdue invoice
- overdue vendor obligation
- stale review

Current implementation notes:

- `watch` and `at_risk` are the emitted health-derived labels
- `unpaid_vendor` is the current emitted enum value for the overdue vendor obligation signal
- missing documents are not part of the live attention contract
- `project_attention_v.has_missing_documents` still exists but is hardcoded `false`
