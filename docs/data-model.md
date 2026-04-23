# AIM StudioOS V1 Data Model

This file reflects the current migration only:

- [20260422_000001_initial_foundation.sql](/Users/doddy/Desktop/Github/studioos_vscode_april22/supabase/migrations/20260422_000001_initial_foundation.sql:1)

It does not document future schema ideas.

## Global Conventions

- primary keys are `uuid`
- money fields use `numeric(14, 2)`
- timestamps use `timestamptz`
- status enums are implemented as `text` columns with `check` constraints
- the main operational tables include `created_at` and `updated_at`
- most operational tables also include `created_by` and `updated_by`

## Functions and Triggers

Current helper functions:

- `set_updated_at()`
- `validate_project_primary_contact()`

Current special integrity rule:

- `projects.primary_contact_id` may be null
- if present, it must belong to the same client as `projects.client_id`
- this is enforced by the `validate_projects_primary_contact` trigger

## Tables

### `profiles`

Key fields:

- `id`
- `email`
- `full_name`
- `role`
- `is_active`

### `studio_profile`

Key fields:

- `id`
- `studio_name`
- `default_currency`
- `timezone`

### `clients`

Key fields:

- `id`
- `name`
- `industry`
- `city`
- `country`
- `website`
- `notes`
- `is_active`

### `client_contacts`

Key fields:

- `id`
- `client_id`
- `full_name`
- `job_title`
- `email`
- `phone`
- `is_primary`

### `projects`

Key fields:

- `id`
- `project_code`
- `name`
- `slug`
- `client_id`
- `primary_contact_id`
- `lifecycle_status`
- `health_status`
- `summary`
- `location`
- `start_date`
- `target_end_date`
- `completed_at`
- `contract_value`
- `currency`
- `project_owner_id`
- `last_reviewed_at`

### `vendors`

Key fields:

- `id`
- `name`
- `service_type`
- `contact_name`
- `email`
- `phone`
- `notes`
- `is_active`

### `invoices`

Key fields:

- `id`
- `project_id`
- `client_id`
- `invoice_number`
- `title`
- `issued_date`
- `due_date`
- `invoice_amount`
- `status`
- `paid_at`
- `tax_percentage`
- `tax_amount`
- `tax_status`
- `notes`

Current uniqueness rule:

- `unique (project_id, invoice_number)`

### `vendor_obligations`

Key fields:

- `id`
- `project_id`
- `vendor_id`
- `title`
- `description`
- `due_date`
- `amount`
- `status`
- `paid_at`
- `tax_percentage`
- `tax_amount`
- `tax_status`
- `notes`

### `documents`

Key fields:

- `id`
- `project_id`
- `title`
- `category`
- `source_type`
- `file_path`
- `external_url`
- `linked_entity_type`
- `linked_entity_id`
- `document_date`
- `description`

Current source constraint:

- either `file_path` or `external_url` must be present
- both cannot be present at once

### `notes`

Key fields:

- `id`
- `project_id`
- `author_id`
- `title`
- `body`
- `note_type`
- `linked_entity_type`
- `linked_entity_id`
- `noted_at`

### `activity_events`

Key fields:

- `id`
- `project_id`
- `actor_id`
- `event_type`
- `entity_type`
- `entity_id`
- `summary`
- `metadata`
- `occurred_at`

## Views

### `project_finance_summary_v`

Columns:

- `project_id`
- `contract_value`
- `total_invoiced`
- `total_paid`
- `outstanding_receivable`
- `total_vendor_value`
- `total_vendor_paid`
- `outstanding_payable`
- `total_tax_unpaid`

### `project_attention_v`

Low-level boolean view retained for backend composition. Frontend attention UX should consume `project_attention_items_v`, `project_attention_summary_v`, and `dashboard_snapshot_v`.

Columns:

- `project_id`
- `has_overdue_invoice`
- `has_unpaid_vendor`
- `has_missing_documents`
- `is_stale`

Important current notes:

- `has_unpaid_vendor` currently means there is at least one overdue vendor obligation
- `has_missing_documents` is hardcoded `false`

### `project_attention_items_v`

Columns:

- `attention_item_id`
- `project_id`
- `project_code`
- `project_name`
- `client_name`
- `attention_label`
- `attention_summary`
- `created_at`

Live semantics:

- health issues emit `watch` and `at_risk`
- overdue invoices emit `overdue_invoice`
- overdue vendor obligations emit `unpaid_vendor`
- stale reviews emit `stale_review`
- missing documents are intentionally excluded

### `project_attention_summary_v`

Columns:

- `project_id`
- `attention_count`
- `needs_attention`

Current derivation:

- `attention_count` is the count of rows in `project_attention_items_v`
- `needs_attention` is `attention_count > 0`

### `finance_overview_v`

Columns:

- `contract_value_total`
- `total_invoiced`
- `total_paid`
- `outstanding_receivable`
- `outstanding_payable`
- `unpaid_tax_total`

### `dashboard_snapshot_v`

Columns:

- `active_projects`
- `projects_needing_attention`

Current derivation:

- `projects_needing_attention` is counted from `project_attention_summary_v.needs_attention`

## Current Omissions

These items are not present in the current migration:

- RLS policies
- storage buckets
- document requirement tables
- missing-document derivation
- search vectors
- project-manager or project-coordinator fields
