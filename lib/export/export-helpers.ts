// Shared formatting + row mapping for project and finance exports.
// Both the CSV route handlers and the XLSX workbook builders use these
// functions so the two formats always produce identical field values.

export const PROJECT_EXPORT_HEADERS = [
  "Project Code",
  "Name",
  "Client",
  "Stage",
  "Health",
  "Location",
  "Start Date",
  "Target End",
  "Contract Value (IDR)",
  "Client Manager",
  "Project Manager",
  "Last Updated",
];

export const FINANCE_EXPORT_HEADERS = [
  "Project",
  "Invoice Number",
  "Title",
  "Issued Date",
  "Due Date",
  "Paid Date",
  "Amount (IDR)",
  "Tax %",
  "Tax Amount (IDR)",
  "Status",
];

const STATUS_LABELS: Record<string, string> = {
  active: "Active",
  proposal: "Proposal",
  on_hold: "On hold",
  completed: "Completed",
  cancelled: "Cancelled",
  on_track: "On track",
  watch: "Needs a closer look",
  at_risk: "Action needed",
  draft: "Draft",
  issued: "Issued",
  paid: "Paid",
  overdue: "Overdue",
  planned: "Planned",
  due: "Due",
  needs_attention: "Flagged for review",
  overdue_invoice: "Invoice overdue",
  unpaid_vendor: "Payment pending",
  stale_review: "Not reviewed recently",
  not_applicable: "Not applicable",
  connected: "Connected",
  not_configured: "Not configured",
  file: "Stored file",
  external_link: "Web link",
  meeting_note: "Meeting note",
  agreement: "Agreement",
  issue: "Issue",
  reminder: "Reminder",
  follow_up: "Follow up",
  decision: "Decision",
};

export function humanizeStatus(value: string | null | undefined): string {
  if (!value) return "";
  return STATUS_LABELS[value] ?? value;
}

export function formatExportCurrency(value: number | null | undefined): string {
  return new Intl.NumberFormat("en-US").format(Number(value) || 0);
}

export function formatTaxPercent(value: number | null | undefined): string {
  return `${Number(value) || 0}%`;
}

export interface ProjectExportRow {
  project_code?: string;
  name?: string;
  client_name?: string;
  lifecycle_status?: string;
  health_status?: string;
  location?: string | null;
  start_date?: string | null;
  target_end_date?: string | null;
  contract_value?: number;
  project_owner_name?: string | null;
  project_lead_name?: string | null;
  updated_at?: string | null;
}

export function mapProjectExportRow(p: ProjectExportRow): string[] {
  return [
    p.project_code ?? "",
    p.name ?? "",
    p.client_name ?? "",
    humanizeStatus(p.lifecycle_status),
    humanizeStatus(p.health_status),
    p.location ?? "",
    p.start_date ?? "",
    p.target_end_date ?? "",
    formatExportCurrency(p.contract_value),
    p.project_owner_name ?? "",
    p.project_lead_name ?? "",
    p.updated_at ?? "",
  ];
}

export interface InvoiceExportRow {
  project_name?: string;
  invoice_number?: string;
  title?: string;
  issued_date?: string | null;
  due_date?: string | null;
  paid_at?: string | null;
  invoice_amount?: number;
  tax_percentage?: number;
  tax_amount?: number;
  status?: string;
}

export function mapInvoiceExportRow(inv: InvoiceExportRow): string[] {
  return [
    inv.project_name ?? "",
    inv.invoice_number ?? "",
    inv.title ?? "",
    inv.issued_date ?? "",
    inv.due_date ?? "",
    inv.paid_at ?? "",
    formatExportCurrency(inv.invoice_amount),
    formatTaxPercent(inv.tax_percentage),
    formatExportCurrency(inv.tax_amount),
    humanizeStatus(inv.status),
  ];
}
