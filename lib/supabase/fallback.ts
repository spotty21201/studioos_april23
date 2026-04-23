import type {
  ActivityEventRecordRow,
  DashboardSnapshotRow,
  DocumentRecordRow,
  FinanceOverviewRow,
  InvoiceRecordRow,
  ProfileRow,
  ProjectAttentionItemRow,
  ProjectAttentionSummaryRow,
  ProjectFinanceSummaryRow,
  ProjectRecordRow,
  StudioProfileRow,
  VendorObligationRecordRow,
  NoteRecordRow,
} from "@/lib/supabase/view-contracts";

export type FallbackStudioOsSource = {
  studioProfile: StudioProfileRow;
  projects: ProjectRecordRow[];
  projectFinanceSummaries: ProjectFinanceSummaryRow[];
  projectAttentionItems: ProjectAttentionItemRow[];
  projectAttentionSummaries: ProjectAttentionSummaryRow[];
  financeOverview: FinanceOverviewRow;
  dashboardSnapshot: DashboardSnapshotRow;
  invoices: InvoiceRecordRow[];
  vendorObligations: VendorObligationRecordRow[];
  documents: DocumentRecordRow[];
  notes: NoteRecordRow[];
  activityEvents: ActivityEventRecordRow[];
};

const fallbackViewerProfile: ProfileRow = {
  id: "00000000-0000-4000-8000-000000000001",
  email: "principal-preview@aimstudio.id",
  full_name: "AIM Principal Preview",
  role: "principal",
  is_active: true,
  created_at: "2026-04-22T08:00:00.000Z",
  updated_at: "2026-04-22T08:00:00.000Z",
};

const fallbackStudioProfile: StudioProfileRow = {
  id: "10000000-0000-4000-8000-000000000001",
  studio_name: "AIM",
  default_currency: "IDR",
  timezone: "Asia/Jakarta",
  created_at: "2026-04-22T08:00:00.000Z",
  updated_at: "2026-04-22T08:00:00.000Z",
};

const fallbackProjects: ProjectRecordRow[] = [
  {
    id: "20000000-0000-4000-8000-000000000001",
    project_code: "AIM-26014",
    name: "Bandung Creative Hub Expansion",
    slug: "bandung-creative-hub-expansion",
    client_id: "30000000-0000-4000-8000-000000000001",
    primary_contact_id: "40000000-0000-4000-8000-000000000001",
    lifecycle_status: "active",
    health_status: "watch",
    summary:
      "Permit packaging is nearly ready, but one external structural review remains open and leadership follow-up is required on the overdue milestone invoice.",
    location: "Bandung, Indonesia",
    start_date: "2026-01-12",
    target_end_date: "2026-07-10",
    completed_at: null,
    contract_value: 18600000000,
    currency: "IDR",
    project_owner_id: "00000000-0000-4000-8000-000000000002",
    last_reviewed_at: "2026-04-22T02:10:00.000Z",
    created_at: "2026-01-12T02:00:00.000Z",
    updated_at: "2026-04-22T02:10:00.000Z",
    created_by: null,
    updated_by: null,
    client: {
      id: "30000000-0000-4000-8000-000000000001",
      name: "Bandung Urban Development",
    },
    primary_contact: {
      id: "40000000-0000-4000-8000-000000000001",
      full_name: "Maya Puspa",
      email: "maya@bandungud.id",
      job_title: "Head of Development",
    },
    project_owner: {
      id: "00000000-0000-4000-8000-000000000002",
      full_name: "Ria Asyurani",
      email: "ria@aimstudio.id",
      role: "director",
    },
  },
  {
    id: "20000000-0000-4000-8000-000000000002",
    project_code: "AIM-26011",
    name: "West Java Design Center",
    slug: "west-java-design-center",
    client_id: "30000000-0000-4000-8000-000000000002",
    primary_contact_id: "40000000-0000-4000-8000-000000000002",
    lifecycle_status: "active",
    health_status: "on_track",
    summary:
      "Tender packaging and consultant coordination are progressing cleanly with no open receivable risk.",
    location: "Bandung, Indonesia",
    start_date: "2026-01-05",
    target_end_date: "2026-06-02",
    completed_at: null,
    contract_value: 22400000000,
    currency: "IDR",
    project_owner_id: "00000000-0000-4000-8000-000000000003",
    last_reviewed_at: "2026-04-21T08:30:00.000Z",
    created_at: "2026-01-05T02:00:00.000Z",
    updated_at: "2026-04-21T08:30:00.000Z",
    created_by: null,
    updated_by: null,
    client: {
      id: "30000000-0000-4000-8000-000000000002",
      name: "Provincial Design Council",
    },
    primary_contact: {
      id: "40000000-0000-4000-8000-000000000002",
      full_name: "Raka Nugraha",
      email: "raka@pdc.id",
      job_title: "Program Lead",
    },
    project_owner: {
      id: "00000000-0000-4000-8000-000000000003",
      full_name: "Luthfiyyah",
      email: "luthfiyyah@aimstudio.id",
      role: "senior_associate",
    },
  },
  {
    id: "20000000-0000-4000-8000-000000000003",
    project_code: "AIM-26017",
    name: "Nusantara Living Lab",
    slug: "nusantara-living-lab",
    client_id: "30000000-0000-4000-8000-000000000003",
    primary_contact_id: "40000000-0000-4000-8000-000000000003",
    lifecycle_status: "on_hold",
    health_status: "at_risk",
    summary:
      "Commercial staging remains unresolved. The project is paused, one invoice is overdue, and a vendor obligation has crossed its due date.",
    location: "IKN, Indonesia",
    start_date: "2026-02-02",
    target_end_date: "2026-08-14",
    completed_at: null,
    contract_value: 9300000000,
    currency: "IDR",
    project_owner_id: "00000000-0000-4000-8000-000000000004",
    last_reviewed_at: "2026-04-01T09:00:00.000Z",
    created_at: "2026-02-02T02:00:00.000Z",
    updated_at: "2026-04-18T04:00:00.000Z",
    created_by: null,
    updated_by: null,
    client: {
      id: "30000000-0000-4000-8000-000000000003",
      name: "Kolabs Ecosystem",
    },
    primary_contact: {
      id: "40000000-0000-4000-8000-000000000003",
      full_name: "Tania Arundina",
      email: "tania@kolabs.id",
      job_title: "Innovation Partnerships",
    },
    project_owner: {
      id: "00000000-0000-4000-8000-000000000004",
      full_name: "Astri Endawati",
      email: "astri@aimstudio.id",
      role: "operations",
    },
  },
  {
    id: "20000000-0000-4000-8000-000000000004",
    project_code: "AIM-25022",
    name: "Jakarta HQ Refresh",
    slug: "jakarta-hq-refresh",
    client_id: "30000000-0000-4000-8000-000000000004",
    primary_contact_id: null,
    lifecycle_status: "completed",
    health_status: "on_track",
    summary:
      "Operational work is complete. Administrative closeout remains limited to final payment and archive release.",
    location: "Jakarta, Indonesia",
    start_date: "2025-10-18",
    target_end_date: "2026-04-30",
    completed_at: "2026-04-20",
    contract_value: 7600000000,
    currency: "IDR",
    project_owner_id: null,
    last_reviewed_at: "2026-04-20T03:20:00.000Z",
    created_at: "2025-10-18T02:00:00.000Z",
    updated_at: "2026-04-20T03:20:00.000Z",
    created_by: null,
    updated_by: null,
    client: {
      id: "30000000-0000-4000-8000-000000000004",
      name: "Apex Advisory",
    },
    primary_contact: null,
    project_owner: null,
  },
];

const fallbackInvoices: InvoiceRecordRow[] = [
  {
    id: "50000000-0000-4000-8000-000000000001",
    project_id: fallbackProjects[0].id,
    client_id: fallbackProjects[0].client_id,
    invoice_number: "INV-26041",
    title: "Permit package milestone",
    issued_date: "2026-03-28",
    due_date: "2026-04-12",
    invoice_amount: 1400000000,
    status: "overdue",
    paid_at: null,
    tax_percentage: 11,
    tax_amount: 154000000,
    tax_status: "unpaid",
    notes: null,
    created_at: "2026-03-28T02:00:00.000Z",
    updated_at: "2026-04-12T09:00:00.000Z",
    created_by: null,
    updated_by: null,
    project: {
      id: fallbackProjects[0].id,
      project_code: fallbackProjects[0].project_code,
      name: fallbackProjects[0].name,
      slug: fallbackProjects[0].slug,
    },
    client: fallbackProjects[0].client,
  },
  {
    id: "50000000-0000-4000-8000-000000000002",
    project_id: fallbackProjects[2].id,
    client_id: fallbackProjects[2].client_id,
    invoice_number: "INV-26044",
    title: "Concept framing stage",
    issued_date: "2026-03-30",
    due_date: "2026-04-15",
    invoice_amount: 1300000000,
    status: "overdue",
    paid_at: null,
    tax_percentage: 11,
    tax_amount: 143000000,
    tax_status: "unpaid",
    notes: null,
    created_at: "2026-03-30T02:00:00.000Z",
    updated_at: "2026-04-15T09:00:00.000Z",
    created_by: null,
    updated_by: null,
    project: {
      id: fallbackProjects[2].id,
      project_code: fallbackProjects[2].project_code,
      name: fallbackProjects[2].name,
      slug: fallbackProjects[2].slug,
    },
    client: fallbackProjects[2].client,
  },
  {
    id: "50000000-0000-4000-8000-000000000003",
    project_id: fallbackProjects[3].id,
    client_id: fallbackProjects[3].client_id,
    invoice_number: "INV-26046",
    title: "Final closeout certificate",
    issued_date: "2026-04-10",
    due_date: "2026-04-30",
    invoice_amount: 700000000,
    status: "issued",
    paid_at: null,
    tax_percentage: 11,
    tax_amount: 77000000,
    tax_status: "unpaid",
    notes: null,
    created_at: "2026-04-10T02:00:00.000Z",
    updated_at: "2026-04-20T03:00:00.000Z",
    created_by: null,
    updated_by: null,
    project: {
      id: fallbackProjects[3].id,
      project_code: fallbackProjects[3].project_code,
      name: fallbackProjects[3].name,
      slug: fallbackProjects[3].slug,
    },
    client: fallbackProjects[3].client,
  },
];

const fallbackVendorObligations: VendorObligationRecordRow[] = [
  {
    id: "60000000-0000-4000-8000-000000000001",
    project_id: fallbackProjects[0].id,
    vendor_id: "70000000-0000-4000-8000-000000000001",
    title: "Structural review package",
    description: null,
    due_date: "2026-04-24",
    amount: 480000000,
    status: "due",
    paid_at: null,
    tax_percentage: 11,
    tax_amount: 52800000,
    tax_status: "unpaid",
    notes: null,
    created_at: "2026-04-09T02:00:00.000Z",
    updated_at: "2026-04-21T05:00:00.000Z",
    created_by: null,
    updated_by: null,
    project: {
      id: fallbackProjects[0].id,
      project_code: fallbackProjects[0].project_code,
      name: fallbackProjects[0].name,
      slug: fallbackProjects[0].slug,
    },
    vendor: {
      id: "70000000-0000-4000-8000-000000000001",
      name: "Kirana Structure Studio",
    },
  },
  {
    id: "60000000-0000-4000-8000-000000000002",
    project_id: fallbackProjects[1].id,
    vendor_id: "70000000-0000-4000-8000-000000000002",
    title: "MEP coordination support",
    description: null,
    due_date: "2026-04-28",
    amount: 640000000,
    status: "due",
    paid_at: null,
    tax_percentage: 11,
    tax_amount: 70400000,
    tax_status: "unpaid",
    notes: null,
    created_at: "2026-04-08T02:00:00.000Z",
    updated_at: "2026-04-20T05:00:00.000Z",
    created_by: null,
    updated_by: null,
    project: {
      id: fallbackProjects[1].id,
      project_code: fallbackProjects[1].project_code,
      name: fallbackProjects[1].name,
      slug: fallbackProjects[1].slug,
    },
    vendor: {
      id: "70000000-0000-4000-8000-000000000002",
      name: "Studio Grid MEP",
    },
  },
  {
    id: "60000000-0000-4000-8000-000000000003",
    project_id: fallbackProjects[2].id,
    vendor_id: "70000000-0000-4000-8000-000000000003",
    title: "Narrative visualization package",
    description: null,
    due_date: "2026-04-16",
    amount: 220000000,
    status: "overdue",
    paid_at: null,
    tax_percentage: 11,
    tax_amount: 24200000,
    tax_status: "unpaid",
    notes: null,
    created_at: "2026-04-01T02:00:00.000Z",
    updated_at: "2026-04-16T05:00:00.000Z",
    created_by: null,
    updated_by: null,
    project: {
      id: fallbackProjects[2].id,
      project_code: fallbackProjects[2].project_code,
      name: fallbackProjects[2].name,
      slug: fallbackProjects[2].slug,
    },
    vendor: {
      id: "70000000-0000-4000-8000-000000000003",
      name: "Ruang Narasi",
    },
  },
];

const fallbackDocuments: DocumentRecordRow[] = [
  {
    id: "80000000-0000-4000-8000-000000000001",
    project_id: fallbackProjects[0].id,
    title: "Client agreement addendum",
    category: "contract",
    source_type: "file",
    file_path: "documents/aim-26014/client-agreement-addendum.pdf",
    external_url: null,
    linked_entity_type: "project",
    linked_entity_id: fallbackProjects[0].id,
    document_date: "2026-04-04",
    description: null,
    created_at: "2026-04-04T02:00:00.000Z",
    updated_at: "2026-04-20T08:00:00.000Z",
    created_by: null,
    updated_by: null,
    project: {
      id: fallbackProjects[0].id,
      project_code: fallbackProjects[0].project_code,
      name: fallbackProjects[0].name,
      slug: fallbackProjects[0].slug,
    },
  },
  {
    id: "80000000-0000-4000-8000-000000000002",
    project_id: fallbackProjects[1].id,
    title: "Tender issue drawing set",
    category: "deliverable",
    source_type: "file",
    file_path: "documents/aim-26011/tender-issue-drawing-set.pdf",
    external_url: null,
    linked_entity_type: "project",
    linked_entity_id: fallbackProjects[1].id,
    document_date: "2026-04-18",
    description: null,
    created_at: "2026-04-18T02:00:00.000Z",
    updated_at: "2026-04-21T09:20:00.000Z",
    created_by: null,
    updated_by: null,
    project: {
      id: fallbackProjects[1].id,
      project_code: fallbackProjects[1].project_code,
      name: fallbackProjects[1].name,
      slug: fallbackProjects[1].slug,
    },
  },
  {
    id: "80000000-0000-4000-8000-000000000003",
    project_id: fallbackProjects[2].id,
    title: "Commercial clarification memo",
    category: "client_document",
    source_type: "external_link",
    file_path: null,
    external_url: "https://example.com/nusantara-commercial-clarification",
    linked_entity_type: "project",
    linked_entity_id: fallbackProjects[2].id,
    document_date: "2026-04-17",
    description: null,
    created_at: "2026-04-17T02:00:00.000Z",
    updated_at: "2026-04-18T01:40:00.000Z",
    created_by: null,
    updated_by: null,
    project: {
      id: fallbackProjects[2].id,
      project_code: fallbackProjects[2].project_code,
      name: fallbackProjects[2].name,
      slug: fallbackProjects[2].slug,
    },
  },
  {
    id: "80000000-0000-4000-8000-000000000004",
    project_id: fallbackProjects[3].id,
    title: "Final invoice backup",
    category: "invoice_attachment",
    source_type: "file",
    file_path: "documents/aim-25022/final-invoice-backup.pdf",
    external_url: null,
    linked_entity_type: "invoice",
    linked_entity_id: fallbackInvoices[2].id,
    document_date: "2026-04-10",
    description: null,
    created_at: "2026-04-10T02:00:00.000Z",
    updated_at: "2026-04-20T03:00:00.000Z",
    created_by: null,
    updated_by: null,
    project: {
      id: fallbackProjects[3].id,
      project_code: fallbackProjects[3].project_code,
      name: fallbackProjects[3].name,
      slug: fallbackProjects[3].slug,
    },
  },
];

const fallbackNotes: NoteRecordRow[] = [
  {
    id: "90000000-0000-4000-8000-000000000001",
    project_id: fallbackProjects[0].id,
    author_id: "00000000-0000-4000-8000-000000000002",
    title: "Permit risk remains external",
    body:
      "Structural review is still the gating item. Client is aligned, but the permit submission package should not be committed until consultant comments are integrated.",
    note_type: "issue",
    linked_entity_type: "project",
    linked_entity_id: fallbackProjects[0].id,
    noted_at: "2026-04-22T02:10:00.000Z",
    created_at: "2026-04-22T02:10:00.000Z",
    updated_at: "2026-04-22T02:10:00.000Z",
    created_by: null,
    updated_by: null,
    project: {
      id: fallbackProjects[0].id,
      project_code: fallbackProjects[0].project_code,
      name: fallbackProjects[0].name,
      slug: fallbackProjects[0].slug,
    },
    author: {
      id: "00000000-0000-4000-8000-000000000002",
      full_name: "Ria Asyurani",
      email: "ria@aimstudio.id",
      role: "director",
    },
  },
  {
    id: "90000000-0000-4000-8000-000000000002",
    project_id: fallbackProjects[1].id,
    author_id: "00000000-0000-4000-8000-000000000003",
    title: "Tender packaging sequence confirmed",
    body:
      "Internal review agreed on a two-wave issue set. This keeps documentation calm without increasing client coordination overhead.",
    note_type: "decision",
    linked_entity_type: "project",
    linked_entity_id: fallbackProjects[1].id,
    noted_at: "2026-04-21T08:30:00.000Z",
    created_at: "2026-04-21T08:30:00.000Z",
    updated_at: "2026-04-21T08:30:00.000Z",
    created_by: null,
    updated_by: null,
    project: {
      id: fallbackProjects[1].id,
      project_code: fallbackProjects[1].project_code,
      name: fallbackProjects[1].name,
      slug: fallbackProjects[1].slug,
    },
    author: {
      id: "00000000-0000-4000-8000-000000000003",
      full_name: "Luthfiyyah",
      email: "luthfiyyah@aimstudio.id",
      role: "senior_associate",
    },
  },
  {
    id: "90000000-0000-4000-8000-000000000003",
    project_id: fallbackProjects[2].id,
    author_id: "00000000-0000-4000-8000-000000000004",
    title: "Client waiting on staging decision",
    body:
      "Commercial clarity remains the block. No additional design iteration should be released until land-use staging is confirmed.",
    note_type: "follow_up",
    linked_entity_type: "project",
    linked_entity_id: fallbackProjects[2].id,
    noted_at: "2026-04-18T04:00:00.000Z",
    created_at: "2026-04-18T04:00:00.000Z",
    updated_at: "2026-04-18T04:00:00.000Z",
    created_by: null,
    updated_by: null,
    project: {
      id: fallbackProjects[2].id,
      project_code: fallbackProjects[2].project_code,
      name: fallbackProjects[2].name,
      slug: fallbackProjects[2].slug,
    },
    author: {
      id: "00000000-0000-4000-8000-000000000004",
      full_name: "Astri Endawati",
      email: "astri@aimstudio.id",
      role: "operations",
    },
  },
];

const fallbackActivityEvents: ActivityEventRecordRow[] = [
  {
    id: "91000000-0000-4000-8000-000000000001",
    project_id: fallbackProjects[0].id,
    actor_id: "00000000-0000-4000-8000-000000000002",
    event_type: "project_status_changed",
    entity_type: "project",
    entity_id: fallbackProjects[0].id,
    summary: "Project health moved to watch after structural review delay.",
    metadata: {},
    occurred_at: "2026-04-22T02:10:00.000Z",
    created_at: "2026-04-22T02:10:00.000Z",
    updated_at: "2026-04-22T02:10:00.000Z",
    project: {
      id: fallbackProjects[0].id,
      project_code: fallbackProjects[0].project_code,
      name: fallbackProjects[0].name,
      slug: fallbackProjects[0].slug,
    },
    actor: {
      id: "00000000-0000-4000-8000-000000000002",
      full_name: "Ria Asyurani",
      email: "ria@aimstudio.id",
      role: "director",
    },
  },
  {
    id: "91000000-0000-4000-8000-000000000002",
    project_id: fallbackProjects[1].id,
    actor_id: "00000000-0000-4000-8000-000000000003",
    event_type: "document_added",
    entity_type: "document",
    entity_id: fallbackDocuments[1].id,
    summary: "Tender issue drawing set uploaded to the project record.",
    metadata: {},
    occurred_at: "2026-04-21T09:20:00.000Z",
    created_at: "2026-04-21T09:20:00.000Z",
    updated_at: "2026-04-21T09:20:00.000Z",
    project: {
      id: fallbackProjects[1].id,
      project_code: fallbackProjects[1].project_code,
      name: fallbackProjects[1].name,
      slug: fallbackProjects[1].slug,
    },
    actor: {
      id: "00000000-0000-4000-8000-000000000003",
      full_name: "Luthfiyyah",
      email: "luthfiyyah@aimstudio.id",
      role: "senior_associate",
    },
  },
  {
    id: "91000000-0000-4000-8000-000000000003",
    project_id: fallbackProjects[2].id,
    actor_id: "00000000-0000-4000-8000-000000000001",
    event_type: "invoice_status_changed",
    entity_type: "invoice",
    entity_id: fallbackInvoices[1].id,
    summary: "Concept framing invoice is now overdue and requires client follow-up.",
    metadata: {},
    occurred_at: "2026-04-18T10:20:00.000Z",
    created_at: "2026-04-18T10:20:00.000Z",
    updated_at: "2026-04-18T10:20:00.000Z",
    project: {
      id: fallbackProjects[2].id,
      project_code: fallbackProjects[2].project_code,
      name: fallbackProjects[2].name,
      slug: fallbackProjects[2].slug,
    },
    actor: {
      id: fallbackViewerProfile.id,
      full_name: fallbackViewerProfile.full_name,
      email: fallbackViewerProfile.email,
      role: fallbackViewerProfile.role,
    },
  },
  {
    id: "91000000-0000-4000-8000-000000000004",
    project_id: fallbackProjects[3].id,
    actor_id: null,
    event_type: "note_created",
    entity_type: "note",
    entity_id: fallbackNotes[2].id,
    summary: "Closeout note added covering final archive package and invoice timing.",
    metadata: {},
    occurred_at: "2026-04-20T03:20:00.000Z",
    created_at: "2026-04-20T03:20:00.000Z",
    updated_at: "2026-04-20T03:20:00.000Z",
    project: {
      id: fallbackProjects[3].id,
      project_code: fallbackProjects[3].project_code,
      name: fallbackProjects[3].name,
      slug: fallbackProjects[3].slug,
    },
    actor: null,
  },
];

function buildProjectFinanceSummaries(): ProjectFinanceSummaryRow[] {
  return fallbackProjects.map((project) => {
    const projectInvoices = fallbackInvoices.filter((invoice) => invoice.project_id === project.id);
    const projectObligations = fallbackVendorObligations.filter(
      (obligation) => obligation.project_id === project.id,
    );

    const totalInvoiced = projectInvoices.reduce(
      (sum, invoice) => sum + invoice.invoice_amount,
      0,
    );
    const totalPaid = projectInvoices
      .filter((invoice) => invoice.status === "paid")
      .reduce((sum, invoice) => sum + invoice.invoice_amount, 0);
    const outstandingReceivable = projectInvoices
      .filter((invoice) => invoice.status === "issued" || invoice.status === "overdue")
      .reduce((sum, invoice) => sum + invoice.invoice_amount, 0);
    const unpaidInvoiceTax = projectInvoices
      .filter((invoice) => invoice.tax_status === "unpaid")
      .reduce((sum, invoice) => sum + invoice.tax_amount, 0);

    const totalVendorValue = projectObligations.reduce(
      (sum, obligation) => sum + obligation.amount,
      0,
    );
    const totalVendorPaid = projectObligations
      .filter((obligation) => obligation.status === "paid")
      .reduce((sum, obligation) => sum + obligation.amount, 0);
    const outstandingPayable = projectObligations
      .filter((obligation) => obligation.status === "due" || obligation.status === "overdue")
      .reduce((sum, obligation) => sum + obligation.amount, 0);
    const unpaidVendorTax = projectObligations
      .filter((obligation) => obligation.tax_status === "unpaid")
      .reduce((sum, obligation) => sum + obligation.tax_amount, 0);

    return {
      project_id: project.id,
      contract_value: project.contract_value,
      total_invoiced: totalInvoiced,
      total_paid: totalPaid,
      outstanding_receivable: outstandingReceivable,
      total_vendor_value: totalVendorValue,
      total_vendor_paid: totalVendorPaid,
      outstanding_payable: outstandingPayable,
      total_tax_unpaid: unpaidInvoiceTax + unpaidVendorTax,
    };
  });
}

function buildProjectAttentionItems(): ProjectAttentionItemRow[] {
  const items: ProjectAttentionItemRow[] = [];

  for (const project of fallbackProjects) {
    const clientName = project.client?.name ?? "Unknown client";

    if (project.health_status === "watch") {
      items.push({
        attention_item_id: `${project.id}:watch`,
        project_id: project.id,
        project_code: project.project_code,
        project_name: project.name,
        client_name: clientName,
        attention_label: "watch",
        attention_summary: "Project health is watch and should be reviewed by leadership.",
        created_at: project.updated_at,
      });
    }

    if (project.health_status === "at_risk") {
      items.push({
        attention_item_id: `${project.id}:at_risk`,
        project_id: project.id,
        project_code: project.project_code,
        project_name: project.name,
        client_name: clientName,
        attention_label: "at_risk",
        attention_summary:
          "Project health is at risk and needs immediate leadership attention.",
        created_at: project.updated_at,
      });
    }

    const overdueInvoice = fallbackInvoices.find(
      (invoice) => invoice.project_id === project.id && invoice.status === "overdue",
    );

    if (overdueInvoice) {
      items.push({
        attention_item_id: `${project.id}:overdue_invoice`,
        project_id: project.id,
        project_code: project.project_code,
        project_name: project.name,
        client_name: clientName,
        attention_label: "overdue_invoice",
        attention_summary: `Invoice ${overdueInvoice.invoice_number} is overdue and needs receivable follow-up.`,
        created_at: overdueInvoice.updated_at,
      });
    }

    const overdueVendorObligation = fallbackVendorObligations.find(
      (obligation) =>
        obligation.project_id === project.id && obligation.status === "overdue",
    );

    if (overdueVendorObligation) {
      items.push({
        attention_item_id: `${project.id}:unpaid_vendor`,
        project_id: project.id,
        project_code: project.project_code,
        project_name: project.name,
        client_name: clientName,
        attention_label: "unpaid_vendor",
        attention_summary: `${overdueVendorObligation.title} is overdue and needs vendor payment follow-up.`,
        created_at: overdueVendorObligation.updated_at,
      });
    }

    const isStale =
      project.last_reviewed_at === null ||
      new Date(project.last_reviewed_at).getTime() <
        Date.parse("2026-04-09T00:00:00.000Z");

    if (isStale) {
      items.push({
        attention_item_id: `${project.id}:stale_review`,
        project_id: project.id,
        project_code: project.project_code,
        project_name: project.name,
        client_name: clientName,
        attention_label: "stale_review",
        attention_summary:
          "Project review is stale and should be refreshed in the next leadership check.",
        created_at: project.last_reviewed_at ?? project.updated_at,
      });
    }
  }

  return items.sort((left, right) => right.created_at.localeCompare(left.created_at));
}

function buildProjectAttentionSummaries(
  rows: ProjectAttentionItemRow[],
): ProjectAttentionSummaryRow[] {
  const countByProjectId = new Map<string, number>();

  for (const row of rows) {
    countByProjectId.set(row.project_id, (countByProjectId.get(row.project_id) ?? 0) + 1);
  }

  return fallbackProjects.map((project) => {
    const attentionCount = countByProjectId.get(project.id) ?? 0;

    return {
      project_id: project.id,
      attention_count: attentionCount,
      needs_attention: attentionCount > 0,
    };
  });
}

function buildFinanceOverview(
  rows: ProjectFinanceSummaryRow[],
): FinanceOverviewRow {
  return rows.reduce<FinanceOverviewRow>(
    (summary, row) => ({
      contract_value_total: summary.contract_value_total + row.contract_value,
      total_invoiced: summary.total_invoiced + row.total_invoiced,
      total_paid: summary.total_paid + row.total_paid,
      outstanding_receivable:
        summary.outstanding_receivable + row.outstanding_receivable,
      outstanding_payable: summary.outstanding_payable + row.outstanding_payable,
      unpaid_tax_total: summary.unpaid_tax_total + row.total_tax_unpaid,
    }),
    {
      contract_value_total: 0,
      total_invoiced: 0,
      total_paid: 0,
      outstanding_receivable: 0,
      outstanding_payable: 0,
      unpaid_tax_total: 0,
    },
  );
}

function buildDashboardSnapshot(): DashboardSnapshotRow {
  const summaries = buildProjectAttentionSummaries(buildProjectAttentionItems());

  return {
    active_projects: fallbackProjects.filter(
      (project) => project.lifecycle_status === "active",
    ).length,
    projects_needing_attention: summaries.filter((row) => row.needs_attention).length,
  };
}

const fallbackProjectFinanceSummaries = buildProjectFinanceSummaries();
const fallbackProjectAttentionItems = buildProjectAttentionItems();
const fallbackProjectAttentionSummaries = buildProjectAttentionSummaries(
  fallbackProjectAttentionItems,
);

const fallbackStudioOsSource: FallbackStudioOsSource = {
  studioProfile: fallbackStudioProfile,
  projects: fallbackProjects,
  projectFinanceSummaries: fallbackProjectFinanceSummaries,
  projectAttentionItems: fallbackProjectAttentionItems,
  projectAttentionSummaries: fallbackProjectAttentionSummaries,
  financeOverview: buildFinanceOverview(fallbackProjectFinanceSummaries),
  dashboardSnapshot: buildDashboardSnapshot(),
  invoices: fallbackInvoices,
  vendorObligations: fallbackVendorObligations,
  documents: fallbackDocuments,
  notes: fallbackNotes,
  activityEvents: fallbackActivityEvents,
};

export function getFallbackViewerProfile() {
  return fallbackViewerProfile;
}

export function getFallbackStudioOsSource() {
  return fallbackStudioOsSource;
}
