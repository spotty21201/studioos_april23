import { getStudioOsSource } from "@/lib/supabase/queries";
import type {
  AttentionLabel,
  CurrencyCode,
  DocumentCategory,
  DocumentSourceType,
  InvoiceStatus,
  NoteType,
  ProfileRole,
  ProjectAttentionItemRow,
  ProjectAttentionSummaryRow,
  ProjectFinanceSummaryRow,
  ProjectHealthStatus,
  ProjectLifecycleStatus,
  ProjectRecordRow,
  TaxStatus,
  VendorObligationStatus,
} from "@/lib/supabase/view-contracts";
import type { DataSource } from "@/lib/supabase/queries";

export type DataMeta = {
  source: DataSource;
  warning: string | null;
};

export type Money = {
  amount: number;
  currency: CurrencyCode;
};

export type WorkspaceViewer = {
  name: string;
  title: string;
  email: string;
};

export type WorkspaceShellData = {
  meta: DataMeta;
  studioName: string;
  subtitle: string;
  viewer: WorkspaceViewer;
};

export type DashboardMetric = {
  key:
    | "active_projects"
    | "projects_needing_attention"
    | "overdue_invoices"
    | "unpaid_vendor_obligations"
    | "outstanding_receivables";
  label: string;
  value: number;
  currency?: CurrencyCode;
  note?: string;
};

export type AttentionItem = {
  id: string;
  projectId: string;
  projectCode: string;
  projectName: string;
  clientName: string;
  label: AttentionLabel;
  summary: string;
  createdAt: string;
};

export type ProjectListItem = {
  id: string;
  slug: string;
  projectCode: string;
  name: string;
  clientName: string;
  lifecycleStatus: ProjectLifecycleStatus;
  healthStatus: ProjectHealthStatus;
  contractValue: Money;
  outstandingReceivable: Money;
  outstandingPayable: Money;
  attentionCount: number;
  updatedAt: string;
};

export type DashboardPageData = {
  meta: DataMeta;
  metrics: DashboardMetric[];
  attentionItems: AttentionItem[];
  activeProjects: ProjectListItem[];
  overdueInvoices: InvoiceListItem[];
  unpaidVendorObligations: VendorObligationListItem[];
  recentNotes: NoteListItem[];
  recentActivity: ActivityListItem[];
};

export type ProjectsFilterState = {
  q: string;
  lifecycle: ProjectLifecycleStatus | "all";
  health: ProjectHealthStatus | "all";
};

export type ProjectsPageData = {
  meta: DataMeta;
  filters: ProjectsFilterState;
  items: ProjectListItem[];
  totalCount: number;
  filteredCount: number;
};

export type ProjectHeader = {
  id: string;
  slug: string;
  projectCode: string;
  name: string;
  clientName: string;
  primaryContactName: string | null;
  primaryContactEmail: string | null;
  projectOwnerName: string | null;
  lifecycleStatus: ProjectLifecycleStatus;
  healthStatus: ProjectHealthStatus;
  summary: string | null;
  location: string | null;
  startDate: string | null;
  targetEndDate: string | null;
  completedAt: string | null;
  lastReviewedAt: string | null;
  contractValue: Money;
};

export type FinanceSummary = {
  contractValue: Money;
  totalInvoiced: Money;
  totalPaid: Money;
  outstandingReceivable: Money;
  totalVendorValue: Money;
  outstandingPayable: Money;
  unpaidTax: Money;
};

export type InvoiceListItem = {
  id: string;
  projectId: string;
  projectCode: string;
  projectName: string;
  clientName: string;
  invoiceNumber: string;
  title: string;
  issuedDate: string | null;
  dueDate: string | null;
  invoiceAmount: Money;
  status: InvoiceStatus;
  taxAmount: Money;
  taxStatus: TaxStatus;
};

export type VendorObligationListItem = {
  id: string;
  projectId: string;
  projectCode: string;
  projectName: string;
  vendorName: string;
  title: string;
  dueDate: string | null;
  amount: Money;
  status: VendorObligationStatus;
  taxAmount: Money;
  taxStatus: TaxStatus;
};

export type DocumentListItem = {
  id: string;
  projectId: string;
  projectCode: string;
  projectName: string;
  title: string;
  category: DocumentCategory;
  sourceType: DocumentSourceType;
  documentDate: string | null;
  reference: string;
  linkHref: string | null;
  updatedAt: string;
};

export type NoteListItem = {
  id: string;
  projectId: string;
  projectCode: string;
  projectName: string;
  title: string | null;
  bodyPreview: string;
  noteType: NoteType;
  authorName: string;
  notedAt: string;
};

export type ActivityListItem = {
  id: string;
  projectId: string;
  projectCode: string;
  projectName: string;
  actorName: string | null;
  eventType: string;
  entityType: string;
  summary: string;
  occurredAt: string;
};

export type ProjectDetailPageData = {
  meta: DataMeta;
  project: ProjectHeader;
  financeSummary: FinanceSummary;
  attentionItems: AttentionItem[];
  invoices: InvoiceListItem[];
  vendorObligations: VendorObligationListItem[];
  documents: DocumentListItem[];
  notes: NoteListItem[];
  activity: ActivityListItem[];
};

export type FinancePageData = {
  meta: DataMeta;
  summary: FinanceSummary;
  overdueInvoices: InvoiceListItem[];
  unpaidVendorObligations: VendorObligationListItem[];
};

export type DocumentsPageData = {
  meta: DataMeta;
  items: DocumentListItem[];
  totalCount: number;
};

export type ActivityPageData = {
  meta: DataMeta;
  notes: NoteListItem[];
  activity: ActivityListItem[];
};

export type SettingsPageData = {
  meta: DataMeta;
  studioName: string;
  defaultCurrency: CurrencyCode;
  timezone: string;
  viewerRole: string | null;
  viewerEmail: string | null;
};

const currency: CurrencyCode = "IDR";

function toMeta(source: DataSource, warning: string | null): DataMeta {
  return { source, warning };
}

function money(amount: number, rowCurrency: CurrencyCode = currency): Money {
  return { amount, currency: rowCurrency };
}

function roleToTitle(role: ProfileRole) {
  return role
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function buildViewer(profile: {
  full_name: string;
  role: ProfileRole;
  email: string;
}): WorkspaceViewer {
  return {
    name: profile.full_name,
    title: roleToTitle(profile.role),
    email: profile.email,
  };
}

function previewText(body: string) {
  if (body.length <= 180) {
    return body;
  }

  return `${body.slice(0, 177).trimEnd()}...`;
}

function buildProjectFinanceMap(rows: ProjectFinanceSummaryRow[]) {
  return new Map(rows.map((row) => [row.project_id, row]));
}

function buildProjectAttentionSummaryMap(rows: ProjectAttentionSummaryRow[]) {
  return new Map(rows.map((row) => [row.project_id, row]));
}

function sortAttentionItems(left: AttentionItem, right: AttentionItem) {
  return right.createdAt.localeCompare(left.createdAt);
}

function mapAttentionItem(item: ProjectAttentionItemRow): AttentionItem {
  return {
    id: item.attention_item_id,
    projectId: item.project_id,
    projectCode: item.project_code,
    projectName: item.project_name,
    clientName: item.client_name,
    label: item.attention_label,
    summary: item.attention_summary,
    createdAt: item.created_at,
  };
}

function mapProjectListItem(
  project: ProjectRecordRow,
  finance: ProjectFinanceSummaryRow | undefined,
  attentionSummary: ProjectAttentionSummaryRow | undefined,
): ProjectListItem {
  return {
    id: project.id,
    slug: project.slug,
    projectCode: project.project_code,
    name: project.name,
    clientName: project.client?.name ?? "Unknown client",
    lifecycleStatus: project.lifecycle_status,
    healthStatus: project.health_status,
    contractValue: money(project.contract_value, project.currency),
    outstandingReceivable: money(finance?.outstanding_receivable ?? 0, project.currency),
    outstandingPayable: money(finance?.outstanding_payable ?? 0, project.currency),
    attentionCount: attentionSummary?.attention_count ?? 0,
    updatedAt: project.updated_at,
  };
}

function mapFinanceSummary(
  row: ProjectFinanceSummaryRow | null | undefined,
  contractValue = 0,
): FinanceSummary {
  return {
    contractValue: money(row?.contract_value ?? contractValue),
    totalInvoiced: money(row?.total_invoiced ?? 0),
    totalPaid: money(row?.total_paid ?? 0),
    outstandingReceivable: money(row?.outstanding_receivable ?? 0),
    totalVendorValue: money(row?.total_vendor_value ?? 0),
    outstandingPayable: money(row?.outstanding_payable ?? 0),
    unpaidTax: money(row?.total_tax_unpaid ?? 0),
  };
}

function mapInvoiceItem(invoice: {
  id: string;
  project_id: string;
  invoice_number: string;
  title: string;
  issued_date: string | null;
  due_date: string | null;
  invoice_amount: number;
  status: InvoiceStatus;
  tax_amount: number;
  tax_status: TaxStatus;
  project: { project_code: string; name: string } | null;
  client: { name: string } | null;
}): InvoiceListItem {
  return {
    id: invoice.id,
    projectId: invoice.project_id,
    projectCode: invoice.project?.project_code ?? "Unknown",
    projectName: invoice.project?.name ?? "Unknown project",
    clientName: invoice.client?.name ?? "Unknown client",
    invoiceNumber: invoice.invoice_number,
    title: invoice.title,
    issuedDate: invoice.issued_date,
    dueDate: invoice.due_date,
    invoiceAmount: money(invoice.invoice_amount),
    status: invoice.status,
    taxAmount: money(invoice.tax_amount),
    taxStatus: invoice.tax_status,
  };
}

function mapVendorObligationItem(item: {
  id: string;
  project_id: string;
  title: string;
  due_date: string | null;
  amount: number;
  status: VendorObligationStatus;
  tax_amount: number;
  tax_status: TaxStatus;
  project: { project_code: string; name: string } | null;
  vendor: { name: string } | null;
}): VendorObligationListItem {
  return {
    id: item.id,
    projectId: item.project_id,
    projectCode: item.project?.project_code ?? "Unknown",
    projectName: item.project?.name ?? "Unknown project",
    vendorName: item.vendor?.name ?? "Unknown vendor",
    title: item.title,
    dueDate: item.due_date,
    amount: money(item.amount),
    status: item.status,
    taxAmount: money(item.tax_amount),
    taxStatus: item.tax_status,
  };
}

function mapDocumentItem(item: {
  id: string;
  project_id: string;
  title: string;
  category: DocumentCategory;
  source_type: DocumentSourceType;
  document_date: string | null;
  file_path: string | null;
  external_url: string | null;
  updated_at: string;
  project: { project_code: string; name: string } | null;
}): DocumentListItem {
  const reference = item.external_url
    ? item.external_url
    : item.file_path
      ? `Stored file reference: ${item.file_path}`
      : "Unavailable";

  return {
    id: item.id,
    projectId: item.project_id,
    projectCode: item.project?.project_code ?? "Unknown",
    projectName: item.project?.name ?? "Unknown project",
    title: item.title,
    category: item.category,
    sourceType: item.source_type,
    documentDate: item.document_date,
    reference,
    linkHref: item.external_url,
    updatedAt: item.updated_at,
  };
}

function mapNoteItem(item: {
  id: string;
  project_id: string;
  title: string | null;
  body: string;
  note_type: NoteType;
  noted_at: string;
  author: { full_name: string } | null;
  project: { project_code: string; name: string } | null;
}): NoteListItem {
  return {
    id: item.id,
    projectId: item.project_id,
    projectCode: item.project?.project_code ?? "Unknown",
    projectName: item.project?.name ?? "Unknown project",
    title: item.title,
    bodyPreview: previewText(item.body),
    noteType: item.note_type,
    authorName: item.author?.full_name ?? "Unknown author",
    notedAt: item.noted_at,
  };
}

function mapActivityItem(item: {
  id: string;
  project_id: string;
  event_type: string;
  entity_type: string;
  summary: string;
  occurred_at: string;
  actor: { full_name: string } | null;
  project: { project_code: string; name: string } | null;
}): ActivityListItem {
  return {
    id: item.id,
    projectId: item.project_id,
    projectCode: item.project?.project_code ?? "Unknown",
    projectName: item.project?.name ?? "Unknown project",
    actorName: item.actor?.full_name ?? null,
    eventType: item.event_type,
    entityType: item.entity_type,
    summary: item.summary,
    occurredAt: item.occurred_at,
  };
}

export async function getWorkspaceShellData(
  viewer: { full_name: string; role: ProfileRole; email: string } | null,
): Promise<WorkspaceShellData> {
  const source = await getStudioOsSource();
  const fallbackViewer = buildViewer({
    full_name: "AIM Principal Preview",
    role: "principal",
    email: "principal-preview@aimstudio.id",
  });

  return {
    meta: toMeta(source.source, source.warning),
    studioName: source.data.studioProfile?.studio_name ?? "AIM",
    subtitle: "The operating system and dashboard for AIM.",
    viewer: viewer ? buildViewer(viewer) : fallbackViewer,
  };
}

export async function getDashboardPageData(): Promise<DashboardPageData> {
  const source = await getStudioOsSource();
  const financeMap = buildProjectFinanceMap(source.data.projectFinanceSummaries);
  const attentionSummaryMap = buildProjectAttentionSummaryMap(
    source.data.projectAttentionSummaries,
  );
  const projects = source.data.projects.map((project) =>
    mapProjectListItem(
      project,
      financeMap.get(project.id),
      attentionSummaryMap.get(project.id),
    ),
  );
  const attentionItems = source.data.projectAttentionItems
    .map(mapAttentionItem)
    .sort(sortAttentionItems);
  const overdueInvoices = source.data.invoices
    .filter((invoice) => invoice.status === "overdue")
    .map(mapInvoiceItem)
    .sort((left, right) => (right.dueDate ?? "").localeCompare(left.dueDate ?? ""));
  const unpaidVendorObligations = source.data.vendorObligations
    .filter((item) => item.status === "due" || item.status === "overdue")
    .map(mapVendorObligationItem)
    .sort((left, right) => (right.dueDate ?? "").localeCompare(left.dueDate ?? ""));
  const recentNotes = source.data.notes
    .slice()
    .sort((left, right) => right.noted_at.localeCompare(left.noted_at))
    .slice(0, 4)
    .map(mapNoteItem);
  const recentActivity = source.data.activityEvents
    .slice()
    .sort((left, right) => right.occurred_at.localeCompare(left.occurred_at))
    .slice(0, 5)
    .map(mapActivityItem);

  return {
    meta: toMeta(source.source, source.warning),
    metrics: [
      {
        key: "active_projects",
        label: "Active Projects",
        value: source.data.dashboardSnapshot?.active_projects ?? 0,
        note: "Current live projects",
      },
      {
        key: "projects_needing_attention",
        label: "Projects Needing Attention",
        value: source.data.dashboardSnapshot?.projects_needing_attention ?? 0,
        note: "From the dashboard snapshot view",
      },
      {
        key: "overdue_invoices",
        label: "Overdue Invoices",
        value: overdueInvoices.length,
        note: "Client billing requiring follow-up",
      },
      {
        key: "unpaid_vendor_obligations",
        label: "Open Vendor Obligations",
        value: unpaidVendorObligations.length,
        note: "Due or overdue vendor commitments",
      },
      {
        key: "outstanding_receivables",
        label: "Outstanding Receivables",
        value: source.data.financeOverview?.outstanding_receivable ?? 0,
        currency,
        note: "Current receivable exposure",
      },
    ],
    attentionItems: attentionItems.slice(0, 6),
    activeProjects: projects
      .filter(
        (project) =>
          project.lifecycleStatus === "active" || project.lifecycleStatus === "on_hold",
      )
      .sort((left, right) => right.updatedAt.localeCompare(left.updatedAt))
      .slice(0, 6),
    overdueInvoices: overdueInvoices.slice(0, 5),
    unpaidVendorObligations: unpaidVendorObligations.slice(0, 5),
    recentNotes,
    recentActivity,
  };
}

export async function getProjectsPageData(input?: {
  q?: string;
  lifecycle?: string;
  health?: string;
}): Promise<ProjectsPageData> {
  const source = await getStudioOsSource();
  const financeMap = buildProjectFinanceMap(source.data.projectFinanceSummaries);
  const attentionSummaryMap = buildProjectAttentionSummaryMap(
    source.data.projectAttentionSummaries,
  );
  const filters: ProjectsFilterState = {
    q: input?.q?.trim() ?? "",
    lifecycle:
      input?.lifecycle === "proposal" ||
      input?.lifecycle === "active" ||
      input?.lifecycle === "on_hold" ||
      input?.lifecycle === "completed" ||
      input?.lifecycle === "cancelled"
        ? input.lifecycle
        : "all",
    health:
      input?.health === "on_track" ||
      input?.health === "watch" ||
      input?.health === "at_risk"
        ? input.health
        : "all",
  };

  const allItems = source.data.projects
    .map((project) =>
      mapProjectListItem(
        project,
        financeMap.get(project.id),
        attentionSummaryMap.get(project.id),
      ),
    )
    .sort((left, right) => right.updatedAt.localeCompare(left.updatedAt));

  const query = filters.q.toLowerCase();
  const items = allItems.filter((item) => {
    const matchesQuery =
      query.length === 0 ||
      item.projectCode.toLowerCase().includes(query) ||
      item.name.toLowerCase().includes(query) ||
      item.clientName.toLowerCase().includes(query);
    const matchesLifecycle =
      filters.lifecycle === "all" || item.lifecycleStatus === filters.lifecycle;
    const matchesHealth =
      filters.health === "all" || item.healthStatus === filters.health;

    return matchesQuery && matchesLifecycle && matchesHealth;
  });

  return {
    meta: toMeta(source.source, source.warning),
    filters,
    items,
    totalCount: allItems.length,
    filteredCount: items.length,
  };
}

export async function getProjectDetailPageData(
  projectId: string,
): Promise<ProjectDetailPageData | null> {
  const source = await getStudioOsSource();
  const project = source.data.projects.find(
    (item) => item.id === projectId || item.slug === projectId,
  );

  if (!project) {
    return null;
  }

  const financeMap = buildProjectFinanceMap(source.data.projectFinanceSummaries);
  const attentionItems = source.data.projectAttentionItems
    .filter((item) => item.project_id === project.id)
    .map(mapAttentionItem)
    .sort(sortAttentionItems);
  const invoices = source.data.invoices
    .filter((item) => item.project_id === project.id)
    .map(mapInvoiceItem)
    .sort((left, right) => (right.dueDate ?? "").localeCompare(left.dueDate ?? ""));
  const vendorObligations = source.data.vendorObligations
    .filter((item) => item.project_id === project.id)
    .map(mapVendorObligationItem)
    .sort((left, right) => (right.dueDate ?? "").localeCompare(left.dueDate ?? ""));
  const documents = source.data.documents
    .filter((item) => item.project_id === project.id)
    .map(mapDocumentItem)
    .sort((left, right) => right.updatedAt.localeCompare(left.updatedAt));
  const notes = source.data.notes
    .filter((item) => item.project_id === project.id)
    .map(mapNoteItem)
    .sort((left, right) => right.notedAt.localeCompare(left.notedAt));
  const activity = source.data.activityEvents
    .filter((item) => item.project_id === project.id)
    .map(mapActivityItem)
    .sort((left, right) => right.occurredAt.localeCompare(left.occurredAt));

  return {
    meta: toMeta(source.source, source.warning),
    project: {
      id: project.id,
      slug: project.slug,
      projectCode: project.project_code,
      name: project.name,
      clientName: project.client?.name ?? "Unknown client",
      primaryContactName: project.primary_contact?.full_name ?? null,
      primaryContactEmail: project.primary_contact?.email ?? null,
      projectOwnerName: project.project_owner?.full_name ?? null,
      lifecycleStatus: project.lifecycle_status,
      healthStatus: project.health_status,
      summary: project.summary,
      location: project.location,
      startDate: project.start_date,
      targetEndDate: project.target_end_date,
      completedAt: project.completed_at,
      lastReviewedAt: project.last_reviewed_at,
      contractValue: money(project.contract_value, project.currency),
    },
    financeSummary: mapFinanceSummary(
      financeMap.get(project.id) ?? null,
      project.contract_value,
    ),
    attentionItems,
    invoices,
    vendorObligations,
    documents,
    notes,
    activity,
  };
}

export async function getFinancePageData(): Promise<FinancePageData> {
  const source = await getStudioOsSource();
  const overdueInvoices = source.data.invoices
    .filter((invoice) => invoice.status === "overdue")
    .map(mapInvoiceItem)
    .sort((left, right) => (right.dueDate ?? "").localeCompare(left.dueDate ?? ""));
  const unpaidVendorObligations = source.data.vendorObligations
    .filter((item) => item.status === "due" || item.status === "overdue")
    .map(mapVendorObligationItem)
    .sort((left, right) => (right.dueDate ?? "").localeCompare(left.dueDate ?? ""));

  return {
    meta: toMeta(source.source, source.warning),
    summary: {
      contractValue: money(source.data.financeOverview?.contract_value_total ?? 0),
      totalInvoiced: money(source.data.financeOverview?.total_invoiced ?? 0),
      totalPaid: money(source.data.financeOverview?.total_paid ?? 0),
      outstandingReceivable: money(
        source.data.financeOverview?.outstanding_receivable ?? 0,
      ),
      totalVendorValue: money(
        source.data.projectFinanceSummaries.reduce(
          (sum, row) => sum + row.total_vendor_value,
          0,
        ),
      ),
      outstandingPayable: money(
        source.data.financeOverview?.outstanding_payable ?? 0,
      ),
      unpaidTax: money(source.data.financeOverview?.unpaid_tax_total ?? 0),
    },
    overdueInvoices,
    unpaidVendorObligations,
  };
}

export async function getDocumentsPageData(): Promise<DocumentsPageData> {
  const source = await getStudioOsSource();
  const items = source.data.documents
    .map(mapDocumentItem)
    .sort((left, right) => right.updatedAt.localeCompare(left.updatedAt));

  return {
    meta: toMeta(source.source, source.warning),
    items,
    totalCount: items.length,
  };
}

export async function getActivityPageData(): Promise<ActivityPageData> {
  const source = await getStudioOsSource();

  return {
    meta: toMeta(source.source, source.warning),
    notes: source.data.notes
      .map(mapNoteItem)
      .sort((left, right) => right.notedAt.localeCompare(left.notedAt)),
    activity: source.data.activityEvents
      .map(mapActivityItem)
      .sort((left, right) => right.occurredAt.localeCompare(left.occurredAt)),
  };
}

export async function getSettingsPageData(input?: {
  viewerRole?: ProfileRole | null;
  viewerEmail?: string | null;
}): Promise<SettingsPageData> {
  const source = await getStudioOsSource();

  return {
    meta: toMeta(source.source, source.warning),
    studioName: source.data.studioProfile?.studio_name ?? "AIM",
    defaultCurrency: source.data.studioProfile?.default_currency ?? currency,
    timezone: source.data.studioProfile?.timezone ?? "Asia/Jakarta",
    viewerRole: input?.viewerRole ? roleToTitle(input.viewerRole) : null,
    viewerEmail: input?.viewerEmail ?? null,
  };
}
