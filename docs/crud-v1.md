# AIM StudioOS V1 CRUD Enablement

This document defines the first editable-record phase for the current read-heavy V1 app.

It is a planning and handoff document only. It does not change SQL, routes, or frontend implementation.

## Scope Decision

### Included

- `projects`
- `clients`
- `client_contacts`
- `invoices`
- `vendor_obligations`
- `documents` as external links or stored file references
- `notes`
- `activity_events` generated from meaningful create and update actions

### Excluded

- full accounting workflows
- deletes
- approvals
- multi-studio support
- document requirement automation
- advanced role permissions
- complex file storage workflows unless the current hosted setup already supports them
- new top-level client, vendor, or accounting workspaces

V1 CRUD should make the existing operating model editable. It should not redesign the product, add new modules, or expand the current attention semantics.

## Role Behavior

- authenticated active users can create and edit V1 records
- use `profiles.is_active = true` as the simple active-user gate where backend policy or server action logic needs it
- role labels such as Principal or Operations may appear in UI copy or assignment fields
- do not build complex RBAC unless backend policies already support it
- inactive users should not be offered create or edit actions

## Route Additions

Minimal route additions:

| Route | Purpose |
|---|---|
| `/projects/new` | create project |
| `/projects/[projectId]/edit` | edit project metadata |
| `/projects/[projectId]` inline note composer | create project note |
| `/projects/[projectId]/notes/[noteId]/edit` | edit project note |
| `/finance/invoices/new` | create invoice, optionally prefilled by `projectId` query param |
| `/finance/invoices/[invoiceId]/edit` | edit invoice |
| `/finance/vendor-obligations/new` | create vendor obligation, optionally prefilled by `projectId` query param |
| `/finance/vendor-obligations/[obligationId]/edit` | edit vendor obligation |
| `/documents/new` | create document metadata for an external link or file reference |
| `/documents/[documentId]/edit` | edit document metadata |

Use modals or inline helpers instead of routes for support records that do not need a standalone workspace:

| Modal | Opened From |
|---|---|
| Create client | `/projects/new`, `/projects/[projectId]/edit` |
| Edit client | project detail client area, project edit form |
| Create client contact | project create or edit form after a client is selected |
| Edit client contact | project detail contact area, project edit form |

Do not add a canonical `/clients` area in this phase unless a separate client workspace is explicitly prioritized later.

### Implementation Checkpoint

Current in-progress implementation status as of April 23, 2026:

- implemented routes: `/projects/new`, `/projects/[projectId]/edit`, `/finance/invoices/new`, `/finance/vendor-obligations/new`, `/documents/new`
- implemented project-context note creation: inline note composer on `/projects/[projectId]`
- not yet implemented routes from this contract: `/finance/invoices/[invoiceId]/edit`, `/finance/vendor-obligations/[obligationId]/edit`, `/documents/[documentId]/edit`, `/projects/[projectId]/notes/[noteId]/edit`
- not currently implemented as separate routes: client create/edit, client contact create/edit, vendor create/edit
- current implementation includes inline support creation for clients, contacts, and vendors only where needed to complete project or vendor-obligation forms
- no delete, approval, advanced RBAC, complex upload, or missing-document automation surface is part of this checkpoint

## CRUD Interaction Map

### Projects

- Create: `/projects/new`
- Edit: `/projects/[projectId]/edit`
- Required fields:
  - `project_code`
  - `name`
  - `client_id`
  - `lifecycle_status`
  - `health_status`
  - `contract_value`
  - `currency`
- Optional fields:
  - `slug`, auto-generated from project name or project code unless manually edited
  - `primary_contact_id`
  - `summary`
  - `location`
  - `start_date`
  - `target_end_date`
  - `completed_at`
  - `project_owner_id`
  - `last_reviewed_at`
- Validation rules:
  - `project_code` is required and unique
  - `slug` is required by SQL and unique; generate before insert if not user-entered
  - `client_id` must reference an active client where possible
  - `primary_contact_id`, when present, must belong to the selected client
  - `lifecycle_status` must be one of `proposal`, `active`, `on_hold`, `completed`, `cancelled`
  - `health_status` must be one of `on_track`, `watch`, `at_risk`
  - `contract_value` must be zero or positive
  - date ranges should not put `target_end_date` before `start_date`
  - `completed_at` should only be set when lifecycle status is `completed`
- Post-submit destination:
  - create: `/projects/[projectId]`
  - edit: `/projects/[projectId]`
- Activity event behavior:
  - create `project_created` on insert
  - create `project_status_changed` when `lifecycle_status` or `health_status` changes
  - create `project_updated` for other meaningful metadata edits
  - event `entity_type` is `project`

### Clients

- Create: modal from project create/edit
- Edit: modal from project detail or project edit
- Required fields:
  - `name`
- Optional fields:
  - `industry`
  - `city`
  - `country`
  - `website`
  - `notes`
  - `is_active`
- Validation rules:
  - `name` is required
  - `website`, when present, should be a valid URL
  - default `is_active` to true on create
  - do not delete clients in V1; use `is_active = false` if a client should no longer be selectable
- Post-submit destination:
  - stay in the current project form or project detail context
  - newly created clients should become the selected client in the invoking form
- Activity event behavior:
  - no project activity event unless the client create/edit is part of a project create or project client reassignment
  - if a project is reassigned to another client, log `project_updated`

### Client Contacts

- Create: modal from project create/edit after `client_id` is selected
- Edit: modal from project detail or project edit
- Required fields:
  - `client_id`
  - `full_name`
- Optional fields:
  - `job_title`
  - `email`
  - `phone`
  - `is_primary`
- Validation rules:
  - `client_id` must reference the selected client
  - `full_name` is required
  - `email`, when present, should be a valid email address
  - only contacts for the selected client should be available as project primary contacts
  - if `is_primary` is set, frontend should warn if another primary contact already exists for that client; SQL does not currently enforce single-primary
- Post-submit destination:
  - stay in the current project form or project detail context
  - newly created contacts should become selectable immediately and may become the project primary contact
- Activity event behavior:
  - no standalone activity event
  - if a project's `primary_contact_id` changes, log `project_updated`

### Invoices

- Create: `/finance/invoices/new`
- Edit: `/finance/invoices/[invoiceId]/edit`
- Required fields:
  - `project_id`
  - `client_id`, derived from the selected project
  - `invoice_number`
  - `title`
  - `invoice_amount`
  - `status`
- Optional fields:
  - `issued_date`
  - `due_date`
  - `paid_at`
  - `tax_percentage`
  - `tax_amount`
  - `tax_status`
  - `notes`
- Validation rules:
  - `project_id` must reference an existing project
  - `client_id` must match the selected project's client
  - `invoice_number` is required and unique per project
  - `invoice_amount` must be zero or positive
  - `status` must be one of `draft`, `issued`, `paid`, `overdue`, `cancelled`
  - `tax_status` must be one of `not_applicable`, `unpaid`, `paid`
  - `tax_amount` must be zero or positive
  - `tax_percentage`, when present, must be zero or positive
  - `paid_at` should be present when status is `paid` and empty when status is not `paid`
  - `due_date` should not be before `issued_date`
- Post-submit destination:
  - if opened with a project context, `/projects/[projectId]`
  - otherwise `/finance`
- Activity event behavior:
  - create `invoice_created` on insert
  - create `invoice_status_changed` when `status` changes
  - create `invoice_updated` for other meaningful edits
  - event `entity_type` is `invoice`

### Vendor Obligations

- Create: `/finance/vendor-obligations/new`
- Edit: `/finance/vendor-obligations/[obligationId]/edit`
- Required fields:
  - `project_id`
  - `vendor_id`
  - `title`
  - `amount`
  - `status`
- Optional fields:
  - `description`
  - `due_date`
  - `paid_at`
  - `tax_percentage`
  - `tax_amount`
  - `tax_status`
  - `notes`
- Validation rules:
  - `project_id` must reference an existing project
  - `vendor_id` must reference an existing active vendor where possible
  - inline new-vendor creation, if present, is support-only for creating the obligation and does not create a standalone vendor CRUD workspace
  - `title` is required
  - `amount` must be zero or positive
  - `status` must be one of `planned`, `due`, `paid`, `overdue`, `cancelled`
  - `tax_status` must be one of `not_applicable`, `unpaid`, `paid`
  - `tax_amount` must be zero or positive
  - `tax_percentage`, when present, must be zero or positive
  - `paid_at` should be present when status is `paid` and empty when status is not `paid`
- Post-submit destination:
  - if opened with a project context, `/projects/[projectId]`
  - otherwise `/finance`
- Activity event behavior:
  - create `vendor_obligation_created` on insert
  - create `vendor_obligation_status_changed` when `status` changes
  - create `vendor_obligation_updated` for other meaningful edits
  - event `entity_type` is `vendor_obligation`

### Documents

- Create: `/documents/new`
- Edit: `/documents/[documentId]/edit`
- Required fields:
  - `project_id`
  - `title`
  - `category`
  - `source_type`
  - exactly one of `external_url` or `file_path`
- Optional fields:
  - `linked_entity_type`
  - `linked_entity_id`
  - `document_date`
  - `description`
- Validation rules:
  - `project_id` must reference an existing project
  - `category` must be one of `proposal`, `contract`, `client_document`, `deliverable`, `support_document`, `invoice_attachment`, `vendor_attachment`
  - `source_type` must be one of `external_link`, `file`
  - for `external_link`, require a valid `external_url` and leave `file_path` empty
  - for `file`, require an existing `file_path` reference and leave `external_url` empty
  - do not introduce upload/storage UX beyond current hosted support; manual file references are acceptable for this phase
  - `linked_entity_type`, when present, must be one of `project`, `invoice`, `vendor_obligation`
  - `linked_entity_id` should be required when `linked_entity_type` is present
- Post-submit destination:
  - if opened with a project context, `/projects/[projectId]`
  - otherwise `/documents`
- Activity event behavior:
  - create `document_added` on insert
  - create `document_updated` for meaningful metadata or reference edits
  - event `entity_type` is `document`

### Notes

- Create: inline composer on `/projects/[projectId]`
- Edit: `/projects/[projectId]/notes/[noteId]/edit`
- Required fields:
  - `project_id`
  - `author_id`, derived from the authenticated profile
  - `body`
  - `note_type`
- Optional fields:
  - `title`
  - `linked_entity_type`
  - `linked_entity_id`
  - `noted_at`
- Validation rules:
  - `project_id` must reference an existing project
  - `author_id` must be the authenticated profile unless backend explicitly supports delegated authorship
  - `body` is required
  - `note_type` must be one of `meeting_note`, `agreement`, `issue`, `reminder`, `follow_up`, `decision`
  - `linked_entity_type`, when present, must be one of `project`, `invoice`, `vendor_obligation`, `document`
  - `linked_entity_id` should be required when `linked_entity_type` is present
  - default `noted_at` to now
- Post-submit destination:
  - `/projects/[projectId]`
- Activity event behavior:
  - create `note_created` on insert
  - create `note_updated` for meaningful edits
  - event `entity_type` is `note`

## Activity Event Rules

- activity should be generated for user-meaningful changes, not every timestamp-only or derived update
- generated events should include `project_id`, `actor_id`, `event_type`, `entity_type`, `entity_id`, `summary`, and optional `metadata`
- `actor_id` should come from the authenticated profile
- `summary` should be human-readable and short enough for dashboard and activity feeds
- `metadata` can include before/after values for status fields and concise changed-field lists for general updates
- if one form submission changes a status plus other fields, prefer one status-specific event and include other changed fields in metadata
- activity generation may be implemented in server actions, API routes, or SQL triggers, but V1 should choose one pattern and apply it consistently

## Backend Dependencies

Already present:

- tables for all included editable domains
- `activity_events` table and allowed event vocabulary
- `created_at` and `updated_at` defaults and update triggers
- `created_by` and `updated_by` columns on most editable tables
- project primary-contact integrity trigger
- finance and attention views that will reflect invoice and vendor-obligation mutations after writes

Needed before production CRUD is considered complete:

- authenticated insert and update path for each included table
- active-user write guard based on authenticated `profiles` rows
- RLS policies or equivalent server-only mutation boundary
- consistent assignment of `created_by`, `updated_by`, `author_id`, and activity `actor_id`
- uniqueness handling for `projects.project_code`, `projects.slug`, and `invoices(project_id, invoice_number)`
- clear handling for `documents.file_path` if hosted storage is not ready
- activity event generation for the event types listed in this document

Not needed for this phase:

- new SQL tables
- new status values
- delete flows
- document requirement derivation
- payment ledger tables
- approval tables
- multi-studio tenant policies

## Frontend Handoff Notes

- add create and edit actions to existing surfaces only; do not redesign navigation
- prefer project-context entry points from project detail for notes, invoices, obligations, and documents
- use `/finance` and `/documents` as cross-project creation entry points where project selection is part of the form
- use modals for client and contact support records so V1 does not gain a new client workspace
- keep form option values exactly aligned with [controlled-vocabulary.md](/Users/doddy/Desktop/Github/studioos_vscode_april22/docs/controlled-vocabulary.md:1)
- show inactive clients or vendors only when editing a record that already references them
- after mutation, refresh the affected read surfaces: project detail, project list summaries, finance, documents, dashboard, and activity as applicable
- keep fallback preview behavior for unconfigured environments, but do not pretend preview writes are durable unless a local mock-write layer is intentionally added
- surface database uniqueness and constraint failures as field-level errors where possible
- maintain the `/notes` redirect; notes creation belongs under project context
