# AIM StudioOS

**The operating system and dashboard for AIM.**

AIM StudioOS is an internal web-based operating system for AIM, designed to centralize project visibility, finance summaries, documents, notes, and operational oversight into one calm, structured, low-cognitive-load interface.

V1 is intentionally designed for the **Principal** as a leadership dashboard and command center.

---

## Overview

AIM StudioOS is being built to reduce fragmentation across:
- spreadsheets
- chat history
- folder structures
- invoices and commercial records
- project notes and decisions
- scattered project memory

Instead of relying on scattered tools, AIM StudioOS creates a more legible operating picture of the studio.

---

## Canonical Implementation Docs

The reconciled implementation contract for V1 lives in [`docs/`](./docs), but it is subordinate to:

1. product scope in [`studio_os_prd.md`](./studio_os_prd.md)
2. backend truth in [`supabase/migrations/20260422_000001_initial_foundation.sql`](./supabase/migrations/20260422_000001_initial_foundation.sql)
3. live route truth in [`app/`](./app)

Read in this order:

1. [`docs/architecture-v1.md`](./docs/architecture-v1.md)
2. [`docs/backend-foundation.md`](./docs/backend-foundation.md)
3. [`docs/controlled-vocabulary.md`](./docs/controlled-vocabulary.md)
4. [`docs/data-model.md`](./docs/data-model.md)
5. [`docs/interface-contracts.md`](./docs/interface-contracts.md)
6. [`docs/implementation-sequence.md`](./docs/implementation-sequence.md)

If root-level summaries conflict with the files above, the reconciled docs pack wins. If the docs pack drifts from the migration or live routes, code and the PRD win.

Current reality:

- the repo is route-complete and integration-capable for the implemented V1 scope
- hosted schema alignment is resolved and authenticated routes are rendering
- the next step is hosted seed population for meaningful live review

---

## V1 Product Goal

The goal of V1 is simple:

Enable the Principal to:
- see all active projects
- identify projects needing attention
- review finance summaries
- inspect documents and notes
- understand overdue items and project risk signals
- leave with clarity about next actions

V1 is not intended to be a full ERP or full accounting platform.

---

## Core Screens

- Login
- Dashboard
- Projects
- Project Detail
- Finance
- Documents
- Notes & Activity
- Settings

---

## Core Data Domains

- Projects
- Clients
- Client Contacts
- Vendors
- Invoices
- Vendor Obligations
- Documents
- Notes
- Activity
- Attention States (derived)

---

## Product Principles

- one source of truth
- dashboard first
- simple first, deep later
- Principal-first experience
- low cognitive load
- modular by design
- traceability matters
- avoid ERP theater

---

## Technology Direction

Recommended stack:

- **Frontend:** Next.js
- **Backend / Platform:** Supabase
- **Database:** Postgres via Supabase
- **Auth:** Supabase Auth
- **Storage:** Supabase Storage
- **Hosting:** Vercel + Supabase

This stack was chosen to balance:
- speed
- clarity
- relational data strength
- integrated auth/storage
- future modular growth

---

## Repository Structure

Recommended structure:

```text
studioos/
  docs/
  app/
  components/
  lib/
  supabase/
  public/
  styles/
```

Recommended docs structure:

```text
docs/
  README.md
  architecture-v1.md
  backend-foundation.md
  build-log.md
  controlled-vocabulary.md
  data-model.md
  interface-contracts.md
  implementation-sequence.md
```

---

## Scaffolding

For this project, **scaffolding** means:
- initializing the project
- setting up folder structure
- creating route shells
- creating layout shells
- preparing docs
- preparing Supabase integration points
- establishing naming conventions

A scaffolding or architecture agent should typically do this first.

---

## Agent Workflow

Recommended agent roles:

1. Product / System Architect Agent
2. Backend / Database Agent
3. Supabase / Auth / Storage Agent
4. Finance Logic Agent
5. Documents and Notes Agent
6. Dashboard Agent
7. Frontend UI/UX Agent
8. QA / Integration Agent

Recommended sequence:

1. Product / System Architect Agent
2. Backend / Database Agent
3. Supabase / Auth / Storage Agent
4. Finance Logic Agent
5. Documents and Notes Agent
6. Dashboard Agent
7. Frontend UI/UX Agent
8. QA / Integration Agent

---

## Controlled Vocabulary

For the exact current route labels, backend statuses, note types, document categories, and implemented SQL view vocabulary, use [`docs/controlled-vocabulary.md`](./docs/controlled-vocabulary.md).

This root README is a summary only and should not be used as a schema or route authority.

---

## V1 Finance Rule

Finance in V1 is operational visibility, not accounting.

Support:
- contract value
- invoice amount
- paid/unpaid
- vendor obligations
- tax percentage
- tax amount
- tax paid yes/no
- outstanding summaries

Do not build:
- ledger systems
- accounting journals
- advanced tax engines
- unnecessary compliance complexity

---

## Design Direction

AIM StudioOS should feel:
- calm
- premium
- modern
- light
- architectural
- leadership-oriented

It should not feel like:
- generic SaaS admin clutter
- ERP software
- accounting software
- a playful consumer app

See [`Design.md`](./Design.md) for the current visual direction summary, and use the reconciled docs pack for implementation authority.

---

## Getting Started

Suggested setup flow:

1. create the project scaffold
2. initialize Next.js app
3. connect Supabase project
4. add documentation files to `/docs`
5. define schema and migrations
6. create page shells
7. build dashboard and project views
8. connect real data
9. add derived attention, notes, and documents
10. run QA and integration review

---

## V1 Definition of Done

V1 is ready when:
- dashboard shows meaningful data
- projects list is searchable and filterable
- project detail acts as an executive briefing page
- finance visibility is useful and simple
- documents and notes are usable
- alerts highlight real issues
- the UI feels calm and understandable

---

## Documentation

This repo should maintain the following current authority set:

- `studio_os_prd.md`
- `supabase/migrations/20260422_000001_initial_foundation.sql`
- `app/`
- `docs/README.md`
- `docs/architecture-v1.md`
- `docs/backend-foundation.md`
- `docs/controlled-vocabulary.md`
- `docs/data-model.md`
- `docs/interface-contracts.md`
- `docs/implementation-sequence.md`
- `docs/build-log.md`

---

## Final Statement

AIM StudioOS is not trying to imitate enterprise software.

Its purpose is to make the studio legible.

That idea should guide architecture, UI, implementation sequence, and every future decision.
