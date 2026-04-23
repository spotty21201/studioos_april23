# AGENT.md

## AIM StudioOS
**The operating system and dashboard for AIM.**

This file defines how coding agents should collaborate on AIM StudioOS V1.

---

## 1. Product Context

AIM StudioOS is a Principal-facing internal web application for AIM. V1 is designed as a calm, structured, low-cognitive-load command dashboard for studio leadership.

The product is **not** a full ERP, not a full accounting system, and not a complete multi-role workflow platform in V1.

The purpose of V1 is to allow the Principal to:

- review active projects quickly
- identify projects needing attention
- inspect project finance, documents, notes, and activity
- understand unpaid and overdue items
- reduce dependence on scattered spreadsheets, chat memory, and folders

---

## 2. Primary User

### V1 Primary User
- **Principal**

### Future Roles
- Principal
- Project Manager
- Project Coordinator
- Team

V1 should be optimized for the Principal, even if the architecture remains future-ready for other roles.

---

## 3. Product Scope

### In Scope for V1
- Login
- Dashboard
- Projects
- Project Detail
- Finance
- Documents
- Notes & Activity
- Settings

### Core Data Domains
- Projects
- Clients
- Client Contacts
- Vendors
- Invoices
- Vendor Obligations
- Documents
- Notes
- Activity
- Attention is derived from data conditions, not owned as a standalone V1 table

### Out of Scope for V1
- full accounting
- advanced tax logic
- timesheet-first workflow
- multi-studio mode
- AI features
- dense admin-heavy ERP behavior
- approval chains

---

## 4. Shared Product Principles

All agents must follow these principles:

1. **One source of truth**  
   The system should centralize selected project, finance, document, and note data.

2. **Dashboard first**  
   The dashboard is the main value surface of V1.

3. **Simple first, deep later**  
   Avoid overbuilding. Preserve clarity.

4. **Leadership-oriented UX**  
   The UI should feel like a studio command center.

5. **Low cognitive load**  
   Favor clear hierarchy, whitespace, readable tables, and restrained controls.

6. **Modular by design**  
   The system must be extensible without forcing complexity into V1.

7. **Traceability matters**  
   Important actions, notes, and documents should be trackable.

8. **Do not build ERP theater**  
   Do not invent complexity that the studio does not need.

---

## 5. Controlled Vocabulary

Use [`docs/controlled-vocabulary.md`](/Users/doddy/Desktop/Github/studioos_vscode_april22/docs/controlled-vocabulary.md:1) as the exact current vocabulary contract.

Do not rely on older root-level examples if they conflict with the migration, live routes, or reconciled docs.

---

## 6. Finance Rules

Finance in V1 is operational visibility, not accounting.

### Must Support
- contract value
- invoice amount
- invoice due date
- invoice paid yes/no
- vendor obligation amount
- vendor paid yes/no
- tax percentage
- tax amount
- tax paid yes/no
- outstanding summaries

### Explicitly Avoid
- ledger behavior
- accounting journal logic
- multi-tax engines
- complex withholding workflows

Tax should remain simple.

---

## 7. Documents and Notes Rules

### Documents
Every document must:
- belong to a project
- have a category
- have a title
- be either an uploaded file or an external link

### Notes
Every note in V1 must:
- belong to a project
- have a type
- have a creator
- have a date

### Activity
Meaningful actions should create activity events where practical.

---

## 8. Recommended Agent Roles

The build should be split into the following roles:

1. Product / System Architect Agent
2. Backend / Database Agent
3. Supabase / Auth / Storage Agent
4. Finance Logic Agent
5. Documents and Notes Agent
6. Dashboard Agent
7. Frontend UI/UX Agent
8. QA / Integration Agent

---

## 9. Recommended Agent Sequence

Agents should work in this order unless deliberately changed:

1. Product / System Architect Agent
2. Backend / Database Agent
3. Supabase / Auth / Storage Agent
4. Finance Logic Agent
5. Documents and Notes Agent
6. Dashboard Agent
7. Frontend UI/UX Agent
8. QA / Integration Agent

This sequence reduces drift and integration conflict.

---

## 10. Agent Responsibilities

### Product / System Architect Agent
Own:
- product structure
- module boundaries
- naming logic
- screen inventory
- entity relationships
- implementation sequencing

### Backend / Database Agent
Own:
- schema
- relational structure
- entity relationships
- database conventions
- data integrity

### Supabase / Auth / Storage Agent
Own:
- auth
- storage
- policies
- migrations
- Supabase utilities
- environment assumptions

### Finance Logic Agent
Own:
- finance field definitions
- outstanding logic
- tax logic
- project-level financial summaries

### Documents and Notes Agent
Own:
- document model
- notes model
- metadata rules
- activity trace support

### Dashboard Agent
Own:
- summary queries
- dashboard widgets
- attention logic
- derived attention logic

### Frontend UI/UX Agent
Own:
- layout system
- page shells
- dashboard presentation
- table and card components
- empty/loading/error states
- project detail presentation

### QA / Integration Agent
Own:
- naming consistency
- screen-data alignment
- drift detection
- compatibility checks
- missing dependency review

---

## 11. Source of Truth Files

Current authority order:

1. `studio_os_prd.md`
2. `supabase/migrations/20260422_000001_initial_foundation.sql`
3. `app/`
4. `docs/README.md`
5. the reconciled files under `docs/`

Agents must not treat older root-level summaries as schema or route authority when they conflict with the sources above.

---

## 12. Repository and Scaffolding Expectations

Recommended root structure:

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
  controlled-vocabulary.md
  data-model.md
  interface-contracts.md
  implementation-sequence.md
  build-log.md
```

Scaffolding should:
- initialize the project
- establish route shells
- create layout shells
- create shared component directories
- set up Supabase integration
- seed documentation files

---

## 13. Working Rules

### Do
- keep V1 focused
- keep naming predictable
- prefer clarity over abstraction
- align to the Principal-first experience
- build reusable but not overly generic components
- document major decisions in `build-log.md`

### Do Not
- redesign the product scope independently
- introduce hidden complexity
- build for every future role inside V1 UI
- invent terms that conflict with the controlled vocabulary
- create dense ERP-like experiences

---

## 14. Definition of Done for V1

V1 is ready when:
- core screens exist and are connected to real data
- dashboard summaries are meaningful
- projects are searchable and filterable
- project detail works as an executive briefing page
- finance visibility is simple and useful
- documents and notes are usable
- alert logic surfaces real issues
- the experience feels calm and understandable

---

## 15. Final Guidance

AIM StudioOS should make the studio legible.

Every agent should optimize for:
- clarity
- traceability
- usefulness
- modular growth
- low cognitive load

If a design or implementation choice makes the system feel heavier, noisier, or more bureaucratic, it is probably the wrong choice for V1.
