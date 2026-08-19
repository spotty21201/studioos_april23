# Mira and Bu Indri QA follow-up — 19 August 2026

This document reconciles the live QA brief with the source state after the local remediation pass. The pass did not modify hosted data, run migrations, deploy, archive projects, or alter production configuration.

## Corrected after the live test

- Project Finance is no longer hidden by the contradictory tab condition. The project Finance tab renders linked invoices and vendor obligations.
- The global Finance page contains a complete invoice register rather than only an overdue-invoice list.
- The project query retrieves `project_owner_name`, `project_lead_name`, and `is_archived`, so saved responsibility fields and archive state can be displayed reliably.
- User-facing labels now distinguish **Primary Contact at Client**, **Client Manager**, and **Project Manager**.
- The invoice register supports search plus All, Draft, Issued, Overdue, Paid, and Cancelled status filters.
- Register rows show base amount, VAT percentage and amount, total including VAT, issued/due/paid dates, current status, and View/Edit actions.
- Invoice entry calculates base, VAT, and total including VAT immediately from the entered amount and percentage.
- Dashboard, project, and finance-page totals now use one application reconciliation rule derived from the visible invoice and vendor records:
  - Draft and cancelled invoices are excluded from invoiced totals.
  - Issued and overdue invoices count as outstanding receivables.
  - Paid invoices count as paid and invoiced, but not outstanding.
  - Cancelled vendor obligations are excluded from commitments.
- Main navigation links expose an immediate accessible loading indicator while a route transition is pending. Existing route-level loading and error boundaries remain in place.

## Deterministic verification added

- The supplied contract values reconcile to Rp530,000,000 before VAT, Rp58,300,000 VAT at 11%, and Rp588,300,000 including VAT.
- Finance reconciliation tests cover draft, issued, overdue, paid, and cancelled states as well as archived-project exclusion.
- Invoice-register tests cover complete visibility, status filtering, and invoice/project/client search.
- A project-query contract test prevents responsibility and archive fields from being omitted again.

## Deferred product or schema work

These items are not safe to implement as incidental UI changes and require an approved product/data design:

- Multi-termin planning during project setup and atomic creation of a project plus several invoice terms.
- Validation that all termin percentages equal 100% across saved records.
- Client short names, legal entity names, aliases, and duplicate-resolution rules.
- Durable invoice status history and an automatic calendar-driven overdue transition process.
- User-accessible archived-project listing and permission-governed Restore action.
- Draft autosave.

## Verification still blocked

- The brief specifies eight invoice terms but does not provide each term's percentage, base amount, invoice number assignment, dates, and starting status. Those values must be supplied before an exact eight-term seed can be created without inventing financial data.
- Authenticated create/edit/refresh/sign-out/sign-in acceptance testing requires the dedicated Indri QA account and explicitly isolated records.
- Human timing and trust targets require a new Mira and Bu Indri session after an approved deployment.

## Local check result

- TypeScript: passed.
- ESLint: passed.
- Vitest: 161/161 passed across 23 files.
- Next.js production build: passed.
- Local read-only browser check: the Finance register rendered all four fallback invoices with search, status filters, VAT/total columns, dates, and View/Edit actions; the invoice form calculated Rp90,000,000 + 11% VAT as Rp99,900,000 without submitting a record.
