# AIM StudioOS — Product Requirements Document (PRD)

## Document Control

**Product Name**  
AIM StudioOS

**Subtitle**  
The operating system and dashboard for AIM.

**Document Type**  
Product Requirements Document (PRD)

**Product Stage**  
V1 / MVP

**Primary Studio**  
AIM

**Primary User for V1**  
Principal

**Product Nature**  
Internal web-based studio operating system and dashboard

**Implementation Intent**  
This PRD is written to guide multiple coding agents and human review across planning, architecture, frontend, backend, integration, and QA.

---

# 1. Executive Summary

AIM StudioOS is a Principal-facing internal platform for AIM that centralizes project visibility, commercial tracking, records, documents, notes, and operational oversight into one system.

V1 is intentionally designed as a **leadership command dashboard**, not a full ERP and not a complete team workflow platform. Its purpose is to allow the Principal to understand the operational state of the studio quickly, drill into key projects, inspect commercial and document status, review notes and activity, and identify what needs attention.

The product should feel calm, premium, low-cognitive-load, and structured. It should reduce dependence on scattered spreadsheets, folder hunting, chat memory, and fragmented administrative practices.

---

# 2. Product Vision

AIM StudioOS will become a modular internal operating system for project-based studio work, capable over time of supporting:

- project visibility and control
- client and vendor records
- commercial oversight
- document memory
- note-taking and traceability
- role-based studio workflows
- reporting and exports
- possible future expansion into HDA, Kolabs, or multi-studio logic

However, V1 must remain disciplined.

## V1 Vision Statement

**AIM StudioOS V1 is a Principal-facing command dashboard that provides fast, structured visibility into project status, finance, documents, notes, and operational risk across AIM.**

---

# 3. Problem Statement

AIM StudioOS is being built because project-based studios often operate through fragmented systems. Common problems include:

- project information scattered across spreadsheets, folders, email, and messaging apps
- no reliable single source of truth for active projects
- weak visibility into invoices, vendor obligations, and outstanding items
- important decisions and meeting results buried in chat history or memory
- project records not easy to inspect in one place
- leadership lacking a clear command view of what is active, overdue, missing, or risky
- institutional memory becoming fragile when information is distributed informally

The product exists to solve these problems through a structured but lightweight internal platform.

---

# 4. Product Positioning

## What AIM StudioOS Is

AIM StudioOS is:

- a studio operating system
- a Principal-facing dashboard and oversight tool in V1
- a modular internal web application
- a single source of truth for selected project, finance, document, and note data
- a calm command center for studio leadership

## What AIM StudioOS Is Not in V1

AIM StudioOS V1 is not:

- a full ERP
- a full accounting system
- a payroll tool
- a complete PM workflow system
- a team timesheet platform in daily use
- a multi-studio platform
- an AI-heavy assistant product
- a dense admin-first CRUD application

This distinction must guide all implementation decisions.

---

# 5. Product Goals

## 5.1 Primary Goals

- Give the Principal fast visibility into the current state of active projects
- Show which projects require attention
- Centralize project-level finance, documents, notes, and activity in one place
- Provide a reliable overview of invoiced, paid, and outstanding amounts
- Surface missing documents, overdue items, and stale projects
- Reduce operational friction caused by fragmented information

## 5.2 Secondary Goals

- Establish a modular data and UI foundation for future expansion
- Create a structure that can later support Project Manager, Project Coordinator, and Team roles
- Leave room for future reporting, exports, and deeper workflow layers
- Improve institutional memory through notes and activity tracking

---

# 6. Non-Goals for V1

The following are explicitly out of scope for V1 unless otherwise reintroduced later:

- full accounting ledger or bookkeeping features
- advanced tax compliance logic
- approval chains and multi-stage approvals
- full timesheet management workflow
- multi-studio / multi-tenant architecture
- AI-generated summaries or intelligent recommendations
- deep role-based daily workflows beyond Principal-first usage
- mobile-native app
- advanced client portal functionality
- procurement and contract lifecycle automation beyond basic visibility

---

# 7. Primary User and Role Model

## 7.1 Primary User for V1

**Principal**

The Principal uses AIM StudioOS to:

- review the state of the studio quickly
- inspect project-level status and exposure
- identify projects needing attention
- review financial summaries and outstanding items
- check notes, documents, and recent activity
- leave a small number of high-level updates or comments when needed

The Principal is not expected to use the system as a heavy administrative tool.

## 7.2 Known Roles for Future Versions

These roles should be represented in architecture and future permission planning, but not fully optimized in V1:

- Principal
- Project Manager
- Project Coordinator
- Team

## 7.3 V1 Access Model

V1 should be usable primarily by the Principal. Limited future-ready support for other roles may exist in code structure, but the interface and scope should remain Principal-first.

---

# 8. Core Product Principles

## 8.1 One Source of Truth
The system should become the central reference point for the selected operational data it owns.

## 8.2 Dashboard First, Records Behind It
Users should start with situational awareness, then drill into projects and records as needed.

## 8.3 Simple First, Deep Later
The product must stay light and disciplined in V1 while leaving room for future growth.

## 8.4 Leadership-Oriented Experience
The UI should feel like a calm command center for a Principal, not a cluttered admin back office.

## 8.5 Low Cognitive Load
Use strong hierarchy, whitespace, restrained controls, and readable tables.

## 8.6 Modular by Design
The architecture should support future modules without requiring a rewrite.

## 8.7 Traceability Matters
Documents, notes, finance states, and meaningful actions should be inspectable and trackable.

## 8.8 Avoid ERP Theater
Do not simulate enterprise complexity that the studio does not need in V1.

---

# 9. Product Scope Overview

## 9.1 In Scope for V1

### Core User Experience Areas
- Principal Dashboard
- Projects List
- Project Detail
- Finance Overview
- Documents
- Notes / Activity
- Settings

### Core Data Domains
- Projects
- Clients
- Client Contacts
- Vendors
- Finance records (simple)
- Documents
- Notes
- Activity log
- Alerts

### Key Behaviors
- overview of active projects
- project drill-down
- finance visibility
- document visibility
- note visibility
- recent activity
- alerts and needs-attention surfaces
- basic record editing for selected fields

## 9.2 Out of Scope for V1
- full PM workflow
- complex role workflow
- full team input layer
- timesheet-heavy experience
- complex financial controls
- multi-studio workspace switching
- AI features

---

# 10. Success Metrics

AIM StudioOS V1 is successful if:

- the Principal can review all active projects from one place
- the Principal can quickly identify projects needing attention
- the Principal can inspect finance, documents, notes, and recent activity at project level
- the Principal no longer needs to rely only on spreadsheets or chat memory to understand studio status
- unpaid and overdue items become easier to identify
- the UI feels calm, clear, and useful within the first week of use

These are the first-order success conditions. Not all success needs to be expressed in numerical analytics in V1.

---

# 11. Information Architecture

## 11.1 Main Navigation for V1

- Dashboard
- Projects
- Finance
- Documents
- Notes
- Reports
- Settings

Support data such as Clients and Vendors may exist in forms and linked records, but they do not need to dominate the primary navigation in V1.

## 11.2 Product Mental Model

Users should understand AIM StudioOS in this order:

1. Dashboard = studio overview
2. Projects = all projects at a glance
3. Project Detail = executive briefing page
4. Finance / Documents / Notes = support layers of understanding
5. Reports = structured extracts and summaries

---

# 12. User Journey and Experience Flow

## 12.1 Principal Daily Flow

1. Principal logs into AIM StudioOS
2. Lands on Dashboard
3. Reviews summary cards and attention panel
4. Opens a flagged project or browses projects
5. Reviews project overview, finance, documents, notes, and activity
6. Leaves a note or updates high-level status if needed
7. Returns to dashboard or moves to another project

## 12.2 Principal Weekly Review Flow

1. Opens Dashboard and Projects List
2. Filters by active and attention-needed projects
3. Reviews outstanding invoices and payables
4. Checks missing document flags
5. Reviews recent notes and updates
6. Uses reports or export-ready pages for follow-up discussions

## 12.3 UX Direction

The product should support the loop:

**awareness → drill-down → inspection → clarity → action**

---

# 13. Screen Inventory

## 13.1 Login
Purpose: allow secure internal access.

## 13.2 Principal Dashboard
Purpose: top-level studio oversight with attention surfaces.

## 13.3 Projects List
Purpose: browse and filter all projects in a structured table view.

## 13.4 Project Detail
Purpose: executive briefing page for a single project.

## 13.5 Finance Overview
Purpose: project-level and studio-level financial visibility.

## 13.6 Documents
Purpose: structured access to uploaded or linked project-related documents.

## 13.7 Notes / Activity
Purpose: structured memory and operational traceability.

## 13.8 Settings
Purpose: administrative configuration, vocabularies, and core preferences as needed.

---

# 14. Functional Requirements by Screen

## 14.1 Login

### Purpose
Provide controlled access for internal use.

### Requirements
- email/password login
- logged-in session persistence
- logout capability
- basic authentication error states

### Acceptance Criteria
- user can log in with valid credentials
- invalid credentials return a clear error state
- authenticated user lands on Dashboard

---

## 14.2 Principal Dashboard

### Purpose
Provide the Principal with a command-level overview of the studio.

### Must Show
- active projects count
- total contract value
- total invoiced
- total paid
- outstanding receivables
- outstanding vendor payables
- projects needing attention
- overdue invoices
- unpaid vendor obligations
- projects missing key documents
- recent notes or updates
- recent activity feed

### Core Components
- summary cards
- attention panel
- active projects table/list
- recent activity feed
- filters or quick views

### Suggested Filters
- active
- needs attention
- unpaid
- recently updated
- by client
- by project manager

### Allowed Actions
- open project detail
- filter or search projects
- navigate to finance/documents/notes

### Empty State
If no projects exist:
- show clean onboarding state
- explain the system purpose briefly
- provide a path to create or seed project records

### Acceptance Criteria
- Principal can understand current studio status within one screen
- attention items are visible without drilling into each project
- dashboard feels concise and not overloaded

---

## 14.3 Projects List

### Purpose
Provide a comprehensive, scannable list of projects.

### Must Show
- Project ID
- Project Name
- Client
- Status
- Contract Value
- Invoiced
- Paid
- Outstanding
- Last Note or last meaningful update
- Last Updated
- Attention Status

### Features
- searchable table
- sortable columns
- filters by status and attention condition
- click-through to Project Detail

### Filters
- Proposal
- Active
- On Hold
- Completed
- Cancelled
- Needs Attention
- Overdue Invoice
- Missing Documents
- by Client
- by Project Manager
- by date range

### Acceptance Criteria
- Principal can scan project health in list form
- project list supports fast filtering and search
- clicking a row opens the correct Project Detail

---

## 14.4 Project Detail

### Purpose
Provide a concise executive-level briefing page for a specific project.

### Project Header Must Show
- Project Name
- Project ID
- Client
- Project Status
- Project Manager
- Contract Period
- Contact Person
- optional project type or tags

### Executive Summary Cards Must Show
- Contract Value
- Total Invoiced
- Total Paid
- Outstanding Amount
- Vendor Commitment
- Vendor Paid
- Remaining Vendor Payable
- Tax Summary

### Main Sections

#### Overview
- short project description
- key remarks
- timeline summary
- current stage

#### Finance
- invoice list
- paid/unpaid state
- tax %
- tax amount
- tax paid yes/no
- vendor obligations
- vendor paid yes/no
- outstanding summaries

#### Documents
- list of project documents
- file uploads or external links
- categories and descriptions

#### Notes
- project notes
- agreements
- issues
- reminders
- follow-up items

#### Activity
- recent system actions related to the project

### Allowed Actions in V1
- update selected project metadata
- add note
- upload or link document
- update simple finance status records
- change project status where allowed

### Empty States
- no documents yet
- no notes yet
- no finance records yet
- no recent activity yet

Each empty state should be clear and non-threatening.

### Acceptance Criteria
- Principal can understand the status of a project in a few minutes
- finance, documents, notes, and activity are visible in one place
- page feels like an executive briefing, not a long data-entry form

---

## 14.5 Finance Overview

### Purpose
Provide studio-level and project-level commercial visibility.

### Must Show
- summary cards for total contract value, invoiced, paid, receivables, payables
- outstanding invoices list
- vendor payable summary
- project-level finance breakdowns
- simple tax visibility

### Finance Scope in V1
This is not accounting.

StudioOS V1 must support:
- contract value per project
- invoice records
- invoice amount
- invoice due date
- invoice paid yes/no
- tax percentage
- tax amount
- tax paid yes/no
- vendor obligation amount
- vendor paid yes/no
- payment date fields where applicable
- simple outstanding totals

### Explicitly Out of Scope
- multi-tax engine
- ledger system
- accounting journal logic
- advanced compliance workflows

### Acceptance Criteria
- Principal can identify unpaid and overdue financial items
- project exposure is readable without leaving the system

---

## 14.6 Documents

### Purpose
Provide structured access to project-related files and links.

### Must Support
- uploaded files
- external document links
- document categories
- document titles
- descriptions
- related project
- upload date
- uploader metadata

### Categories
Initial controlled vocabulary:
- Proposal
- Contract
- Client Document
- Deliverable
- Support Document

### Features
- browse documents globally
- browse documents within a project
- filter by category
- open file or link
- show metadata

### Acceptance Criteria
- documents are easy to find
- documents are linked to relevant projects
- system avoids becoming a chaotic file dump

---

## 14.7 Notes / Activity

### Purpose
Provide structured memory and traceability.

### Notes Must Support
- title
- body
- date
- note type
- related project
- creator

### Note Types
- Meeting Note
- Agreement
- Issue
- Reminder
- Follow-up

### Activity Must Capture
- project created
- status changed
- invoice added or updated
- finance state changed
- document uploaded or linked
- note added
- key record edited

### Features
- project-level notes view
- global notes/activity view
- search or filter notes by type or project

### Acceptance Criteria
- Principal can review decisions and project memory easily
- meaningful actions are traceable in a readable way

---

## 14.8 Reports

### Purpose
Provide concise summary views and future exportable pages.

### V1 Report Types
- project summary report
- finance summary by project
- outstanding invoices report
- vendor payables report
- missing documents report
- recent notes/activity report

### Direction
Even if full export is not built in the first implementation sprint, the report structure should support eventual PDF / Excel / CSV outputs.

---

## 14.9 Settings

### Purpose
Provide basic configuration for system behavior and vocabularies.

### Possible V1 Settings Areas
- controlled vocabulary management
- status lists
- note types
- document categories
- basic user account preferences

### Acceptance Criteria
- foundational settings are manageable without changing code for every minor wording update

---

# 15. Data Model Overview

The following entities form the base of the system.

## 15.1 Core Entities
- Project
- Client
- ClientContact
- Vendor
- ProjectFinanceRecord
- Invoice
- VendorObligation
- ProjectDocument
- ProjectNote
- ProjectActivity
- Alert
- User

## 15.2 Relationship Summary
- one Client can relate to many Projects
- one Client can have many ClientContacts
- one Project belongs to one Client
- one Project can have one or many Invoices
- one Project can have one or many VendorObligations
- one Project can have many ProjectDocuments
- one Project can have many ProjectNotes
- one Project can have many ProjectActivities
- one Project can relate to one or many Vendors through VendorObligations
- one Alert is derived from one or more project-related records

## 15.3 Important Design Principle
Keep the data model relational and explicit. Do not bury critical state in free text.

---

# 16. Controlled Vocabulary

A controlled vocabulary file should also exist in the repository, but the PRD locks the following initial vocabulary.

## 16.1 Project Status
- Proposal
- Active
- On Hold
- Completed
- Cancelled

## 16.2 Attention Status / Alert Labels
- Needs Attention
- Overdue Invoice
- Unpaid Vendor
- Missing Documents
- Inactive Project
- Contract Expiring

## 16.3 Document Categories
- Proposal
- Contract
- Client Document
- Deliverable
- Support Document

## 16.4 Note Types
- Meeting Note
- Agreement
- Issue
- Reminder
- Follow-up

## 16.5 Finance Labels
- Contract Value
- Invoice Amount
- Invoiced
- Paid
- Outstanding Receivable
- Vendor Value
- Vendor Paid
- Outstanding Payable
- Tax Percentage
- Tax Amount
- Tax Paid

Any change to these should be deliberate and managed rather than ad hoc.

---

# 17. Business Rules

## 17.1 Project Creation
A Project must have at minimum:
- Project Name
- Project ID
- Client
- Status

Preferred additional fields:
- Project Manager
- Contract Start Date
- Contract End Date or open-ended state
- short description

## 17.2 Finance Simplification Rule
Finance records in V1 are operational records, not accounting records.

## 17.3 Tax Rule
Tax handling remains simple in V1:
- store tax percentage
- store tax amount if used
- track tax paid yes/no

## 17.4 Alert Rule
Alerts are derived from data conditions and not manually typed as standalone objects where avoidable.

Examples:
- invoice overdue because due date passed and invoice paid = no
- missing document because required category absent
- inactive project because no meaningful recent update within defined threshold

## 17.5 Document Rule
Documents must always relate to a project and have a category.

## 17.6 Note Rule
Notes must always relate to a project in V1.

## 17.7 Activity Rule
Meaningful actions should create activity records automatically where practical.

---

# 18. Permissions and Access Model

## 18.1 V1 Principle
Keep access simple but future-ready.

## 18.2 Known Roles
- Principal
- Project Manager
- Project Coordinator
- Team

## 18.3 V1 Practical Access
For V1, Principal is the main active role.

Potential future-ready permission concepts:
- can_view_all_projects
- can_edit_project_summary
- can_manage_finance_status
- can_upload_documents
- can_add_notes
- can_manage_settings
- can_view_reports

The UI and codebase should not hardcode a permanently Principal-only model, but the product experience should still prioritize that role.

---

# 19. Empty States, Loading States, and Error States

These must be designed and implemented, not treated as afterthoughts.

## 19.1 Empty States
Examples:
- no projects yet
- no finance records yet
- no documents uploaded yet
- no notes yet
- no alerts

Each empty state should:
- explain what is missing
- reassure the user that this is normal
- provide the next meaningful action

## 19.2 Loading States
Required on:
- Dashboard summaries
- Projects table
- Project detail data
- Documents lists
- Notes and activity feeds

## 19.3 Error States
Required for:
- authentication failure
- failed data loading
- failed document upload
- failed record save
- missing permissions if introduced

The product should fail clearly and calmly.

---

# 20. Technical Architecture

## 20.1 Recommended Stack

### Frontend
- Next.js

### Backend / Platform
- Supabase

### Database
- Postgres via Supabase

### Auth
- Supabase Auth

### File Storage
- Supabase Storage
- support external document links

### Hosting
- Vercel for frontend
- Supabase-managed backend services

## 20.2 Why This Stack
This stack offers:
- modern development speed
- relational data strength
- integrated auth and storage
- strong fit for internal tools
- future-ready growth without excessive complexity

## 20.3 Explicit Simplicity Rule
Do not introduce unnecessary service complexity in V1. Keep architecture understandable and maintainable.

---

# 21. Project Scaffolding and Repository Structure

Scaffolding is a required part of this build.

## 21.1 Definition of Scaffolding
In this project, scaffolding means:
- initializing the project
- defining folder structure
- creating route and layout shells
- establishing shared directories
- creating integration points
- preparing docs and source-of-truth files

## 21.2 Recommended Root Structure

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

## 21.3 Recommended Docs Structure

```text
docs/
  PRD.md
  agent-prompts.md
  controlled-vocabulary.md
  module-map.md
  screen-list.md
  build-log.md
```

## 21.4 Additional Suggested Structure
Depending on framework conventions, the following may also be useful:

```text
app/
  dashboard/
  projects/
  finance/
  documents/
  notes/
  settings/

components/
  layout/
  dashboard/
  projects/
  finance/
  documents/
  notes/
  shared/

lib/
  auth/
  data/
  utils/
  types/

supabase/
  migrations/
  seeds/
  policies/
```

## 21.5 Scaffolding Responsibilities
A scaffolding or architecture agent should:
- initialize the project
- install base dependencies
- set up folder structure
- create layout shell
- create page route shells
- set up Supabase connection structure
- create docs files
- establish naming conventions
- prepare shared types/utilities

## 21.6 Scaffolding Principles
- keep structure modular
- keep naming predictable
- separate UI, data, and documentation clearly
- prepare for growth without overbuilding
- prefer clarity over abstraction theater

---

# 22. Frontend Strategy

## 22.1 Frontend-First Position
A front-end-first strategy is acceptable and recommended for V1, because the product’s initial success depends heavily on information hierarchy, calm leadership UX, and screen logic.

## 22.2 Frontend Responsibilities
Frontend should define and implement:
- layout system
- page shells
- dashboard composition
- table behavior
- summary cards
- attention states
- project detail presentation
- documents and notes UI
- empty, loading, and error states

## 22.3 Frontend Design Direction
The UI should feel:
- calm
- premium
- light
- professional
- architectural rather than playful
- readable rather than decorative

### Do
- use whitespace
- use restrained palette
- use strong typography hierarchy
- use tables where clarity matters
- use cards for summaries and alerts

### Do Not
- imitate dense ERP UI
- overload dashboards with too many charts
- add ornamental controls without purpose
- design for all future roles in V1 UI at the cost of current clarity

---

# 23. Backend Strategy

## 23.1 Backend Responsibilities
Backend must provide:
- relational schema
- auth support
- storage setup
- query support for dashboard summaries
- data contracts for screen needs
- simple finance logic
- project-document-note relationships
- activity generation support
- alert derivation support

## 23.2 Backend Principles
- explicit relational data
- future-ready but simple
- keep rules understandable
- avoid hidden business logic where transparency matters

## 23.3 Storage Strategy
Documents should support:
- uploaded files
- external URLs

Storage organization should accommodate categories and project association.

---

# 24. Alerts and Dashboard Logic

## 24.1 Dashboard as Main Value Surface
The dashboard is not optional decoration. It is the primary operational interface of V1.

## 24.2 Required Alert Conditions
At minimum, support conditions for:
- overdue invoice
- unpaid vendor obligation
- missing key documents
- stale or inactive project
- contract nearing end

## 24.3 Alert Presentation
Alerts should appear in:
- dashboard attention panel
- project list flags
- project detail warnings

## 24.4 Alert Rule Philosophy
Alerts should be useful and actionable, not noisy.

---

# 25. Reporting and Export Strategy

## 25.1 V1 Reporting Direction
V1 reports should prioritize readability and utility over breadth.

## 25.2 Future Export Path
Architecture should leave room for:
- PDF export
- CSV export
- Excel export

## 25.3 Report-Ready Screen Principle
Where possible, design finance and project summary views so they can later be printed or exported with minimal structural rework.

---

# 26. Multi-Agent Delivery Plan

Because this product will be built by multiple agents, responsibilities must remain explicit.

## 26.1 Recommended Agent Roles
- Product / System Architect Agent
- Frontend UI/UX Agent
- Backend / Database Agent
- Supabase / Auth / Storage Agent
- Finance Logic Agent
- Documents and Notes Agent
- Dashboard and Alerts Agent
- QA / Integration Agent

## 26.2 Recommended Sequence
1. Product / System Architect Agent
2. Backend / Database Agent
3. Supabase / Auth / Storage Agent
4. Finance Logic Agent
5. Documents and Notes Agent
6. Dashboard and Alerts Agent
7. Frontend UI/UX Agent
8. QA / Integration Agent

## 26.3 Why Sequence Matters
This prevents:
- naming drift
- incompatible assumptions
- duplicated logic
- screen/backend mismatch
- overbuilding before foundations are clear

---

# 27. Implementation Phasing

## Phase 0 — Foundation
- finalize PRD
- lock controlled vocabulary
- create scaffolding
- establish repo structure
- initialize Supabase project
- define schema
- define route and layout shells

## Phase 1 — Core V1 Build
- Login
- Dashboard
- Projects List
- Project Detail
- basic Finance Overview
- Documents
- Notes / Activity
- Settings foundations

## Phase 2 — Integration and Refinement
- hook frontend to real backend data
- implement activity logic
- implement alert derivation
- improve empty/loading/error states
- refine data validation
- improve table filtering and search

## Phase 3 — Report Readiness and Polish
- refine report views
- prepare export structure
- improve UX polish
- ensure visual consistency
- QA and integration review

---

# 28. QA and Acceptance Strategy

## 28.1 QA Priorities
- data model coherence
- dashboard numbers match records
- project detail reflects correct project relationships
- document links and uploads work correctly
- notes save and display correctly
- alert logic behaves as expected
- role assumptions do not break V1 usage

## 28.2 Acceptance Criteria Summary
The product is ready for V1 when:
- all core screens are implemented
- dashboard shows real summary data
- projects list is searchable and filterable
- project detail acts as executive briefing page
- finance visibility works with simple tax logic
- documents and notes work reliably
- alerts surface meaningful conditions
- UI feels calm and understandable

---

# 29. Build Log and Source of Truth Files

The repository should include core documentation files from day one.

## Required Documentation Files
- `docs/PRD.md`
- `docs/agent-prompts.md`
- `docs/controlled-vocabulary.md`
- `docs/module-map.md`
- `docs/screen-list.md`
- `docs/build-log.md`

## Build Log Use
`build-log.md` should track:
- major implementation decisions
- vocabulary changes
- accepted/rejected directions
- agent outputs merged
- unresolved questions

This file reduces confusion during multi-agent development.

---

# 30. Risks and Mitigation

## Risk 1 — Scope Creep into ERP Complexity
**Mitigation:** preserve V1 scope and non-goals explicitly.

## Risk 2 — Frontend and Backend Drift
**Mitigation:** lock vocabulary, screen list, and data model before parallel implementation.

## Risk 3 — Too Many Agents Working Overlapping Areas
**Mitigation:** sequence work and keep explicit responsibilities.

## Risk 4 — Overdesigned UI with Weak Logic
**Mitigation:** treat frontend-first as screen architecture, not superficial styling only.

## Risk 5 — Overcomplicated Finance Model
**Mitigation:** keep tax and finance intentionally simple in V1.

## Risk 6 — Weak Adoption Because System Feels Heavy
**Mitigation:** optimize for Principal clarity, calm UI, and useful dashboard value from day one.

---

# 31. Future Roadmap (Beyond V1)

Future versions may include:
- Project Manager and Coordinator workflows
- deeper permissions model
- full timesheet integration
- multi-studio mode
- richer reporting and exports
- approval logic
- AI-assisted search or summary layers
- external stakeholder views or client-facing layers

These should not distort V1.

---

# 32. Final Product Statement

AIM StudioOS V1 is a Principal-facing studio operating system for AIM. It is designed to give leadership a calm, structured, low-friction way to review project status, financial exposure, documents, notes, and operational attention points in one place.

Its job is not to simulate enterprise software. Its job is to make the studio legible.

That principle should guide the UI, the architecture, the implementation order, and every future decision.

