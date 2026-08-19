import type {
  InvoiceRecordRow,
  ProjectFinanceSummaryRow,
  ProjectRecordRow,
  VendorObligationRecordRow,
} from "@/lib/supabase/view-contracts";

const billableInvoiceStatuses = new Set(["issued", "overdue", "paid"]);
const outstandingInvoiceStatuses = new Set(["issued", "overdue"]);
const committedVendorStatuses = new Set(["planned", "due", "overdue", "paid"]);
const outstandingVendorStatuses = new Set(["due", "overdue"]);

export function reconcileProjectFinance(
  projects: ProjectRecordRow[],
  invoices: InvoiceRecordRow[],
  vendorObligations: VendorObligationRecordRow[],
): ProjectFinanceSummaryRow[] {
  const summaries = new Map<string, ProjectFinanceSummaryRow>();

  for (const project of projects) {
    summaries.set(project.id, {
      project_id: project.id,
      contract_value: project.contract_value,
      total_invoiced: 0,
      total_paid: 0,
      outstanding_receivable: 0,
      total_vendor_value: 0,
      total_vendor_paid: 0,
      outstanding_payable: 0,
      total_tax_unpaid: 0,
    });
  }

  for (const invoice of invoices) {
    const summary = summaries.get(invoice.project_id);
    if (!summary || !billableInvoiceStatuses.has(invoice.status)) continue;

    summary.total_invoiced += invoice.invoice_amount;
    if (invoice.status === "paid") summary.total_paid += invoice.invoice_amount;
    if (outstandingInvoiceStatuses.has(invoice.status)) {
      summary.outstanding_receivable += invoice.invoice_amount;
    }
    if (invoice.tax_status === "unpaid") {
      summary.total_tax_unpaid += invoice.tax_amount;
    }
  }

  for (const obligation of vendorObligations) {
    const summary = summaries.get(obligation.project_id);
    if (!summary || !committedVendorStatuses.has(obligation.status)) continue;

    summary.total_vendor_value += obligation.amount;
    if (obligation.status === "paid") summary.total_vendor_paid += obligation.amount;
    if (outstandingVendorStatuses.has(obligation.status)) {
      summary.outstanding_payable += obligation.amount;
    }
    if (obligation.tax_status === "unpaid" && obligation.status !== "planned") {
      summary.total_tax_unpaid += obligation.tax_amount;
    }
  }

  return [...summaries.values()];
}

export function summarizeCurrentFinance(
  projects: ProjectRecordRow[],
  summaries: ProjectFinanceSummaryRow[],
) {
  const currentProjectIds = new Set(
    projects.filter((project) => project.is_archived !== true).map((project) => project.id),
  );

  return summaries.reduce(
    (total, summary) => {
      if (!currentProjectIds.has(summary.project_id)) return total;

      total.contractValue += summary.contract_value;
      total.totalInvoiced += summary.total_invoiced;
      total.totalPaid += summary.total_paid;
      total.outstandingReceivable += summary.outstanding_receivable;
      total.totalVendorValue += summary.total_vendor_value;
      total.outstandingPayable += summary.outstanding_payable;
      total.unpaidTax += summary.total_tax_unpaid;
      return total;
    },
    {
      contractValue: 0,
      totalInvoiced: 0,
      totalPaid: 0,
      outstandingReceivable: 0,
      totalVendorValue: 0,
      outstandingPayable: 0,
      unpaidTax: 0,
    },
  );
}
