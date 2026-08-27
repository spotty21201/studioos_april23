import Link from "next/link";
import { Landmark, Search, WalletCards, Waypoints } from "lucide-react";
import { MetricCard } from "@/components/ui/metric-card";
import { PageHeader } from "@/components/ui/page-header";
import { SectionPanel } from "@/components/ui/section-panel";
import { StatusBadge } from "@/components/ui/status-badge";
import { formatCurrencyIdr, formatShortDate } from "@/lib/format";
import { getFinancePageData } from "@/lib/studio-data";

type FinancePageProps = {
  searchParams: Promise<{ q?: string; status?: string }>;
};

export default async function FinancePage({ searchParams }: FinancePageProps) {
  const params = await searchParams;
  const overview = await getFinancePageData(params);

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Operations"
        title="Finance"
        description="Cross-project visibility into receivables, payables, and tax exposure. V1 stays focused on oversight rather than ledger behavior."
        actions={
          <>
            <Link
              href="/finance/invoices/new"
              className="inline-flex h-11 items-center justify-center rounded-[2px] border border-black bg-black px-5 text-sm font-medium text-white hover:bg-accent-strong"
            >
              Add Invoice
            </Link>
            <Link
              href="/finance/vendor-obligations/new"
              className="inline-flex h-11 items-center justify-center rounded-[2px] border border-black bg-white px-5 text-sm font-medium text-black hover:bg-surface-muted"
            >
              Add Vendor Obligation
            </Link>
          </>
        }
      />

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          label="Contract Value"
          value={formatCurrencyIdr(overview.summary.contractValue.amount, {
            compact: true,
          })}
          supportingText="Current project contract total"
          icon={Waypoints}
        />
        <MetricCard
          label="Invoiced"
          value={formatCurrencyIdr(overview.summary.totalInvoiced.amount, {
            compact: true,
          })}
          supportingText="Total client billing issued"
          icon={Landmark}
          tone="accent"
        />
        <MetricCard
          label="Outstanding Receivable"
          value={formatCurrencyIdr(overview.summary.outstandingReceivable.amount, {
            compact: true,
          })}
          supportingText="Open client invoices"
          icon={Landmark}
          tone="critical"
        />
        <MetricCard
          label="Outstanding Payable"
          value={formatCurrencyIdr(overview.summary.outstandingPayable.amount, {
            compact: true,
          })}
          supportingText={formatCurrencyIdr(overview.summary.unpaidTax.amount, {
            compact: true,
          })}
          icon={WalletCards}
          tone="warning"
          footer={
            <div className="text-xs uppercase tracking-[0.12em] text-text-secondary">
              Unpaid tax {formatCurrencyIdr(overview.summary.unpaidTax.amount)}
            </div>
          }
        />
      </section>

      <SectionPanel
        title="All Client Invoices"
        description={`${overview.filteredInvoiceCount} of ${overview.totalInvoiceCount} saved invoices shown. Draft invoices are not included in issued or outstanding totals until their status is changed.`}
        action={
          <div className="flex w-full flex-col gap-4 xl:flex-row xl:items-center xl:justify-between xl:gap-6">
            <form className="grid w-full flex-1 grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-[minmax(0,1fr)_170px_auto]">
              <label className="relative block">
                <span className="sr-only">Search invoices</span>
                <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-text-tertiary" />
                <input
                  type="search"
                  name="q"
                  defaultValue={overview.filters.q}
                  placeholder="Invoice, project, or client..."
                  className="h-11 w-full rounded-[2px] border border-border bg-white pl-11 pr-4 text-sm text-text-primary outline-none placeholder:text-text-tertiary focus:border-border-strong focus:ring-2 focus:ring-border-muted"
                />
              </label>
              <select
                name="status"
                aria-label="Filter invoices by status"
                defaultValue={overview.filters.status}
                className="h-11 rounded-[2px] border border-border bg-white px-4 text-sm text-text-primary outline-none focus:border-border-strong focus:ring-2 focus:ring-border-muted"
              >
                <option value="all">All statuses</option>
                <option value="draft">Draft</option>
                <option value="issued">Issued</option>
                <option value="overdue">Overdue</option>
                <option value="paid">Paid</option>
                <option value="cancelled">Cancelled</option>
              </select>
              <button
                type="submit"
                className="inline-flex h-11 items-center justify-center rounded-[2px] border border-black bg-black px-5 text-sm font-medium text-white hover:bg-accent-strong"
              >
                Apply
              </button>
            </form>
            <div className="flex flex-wrap items-center gap-2 xl:justify-end">
              <a
                href="/api/export-finance-xlsx"
                className="inline-flex h-11 items-center justify-center rounded-[2px] border border-black bg-black px-5 text-sm font-medium text-white hover:bg-accent-strong"
              >
                Export XLSX
              </a>
              <a
                href="/api/export-finance-pdf"
                className="inline-flex h-11 items-center justify-center rounded-[2px] border border-black bg-white px-5 text-sm font-medium text-black hover:bg-surface-muted"
              >
                Export PDF
              </a>
              <a
                href="/api/export-finance"
                className="inline-flex h-11 items-center px-2 text-sm font-medium text-text-secondary underline-offset-4 hover:text-accent hover:underline"
              >
                Export · CSV
              </a>
            </div>
          </div>
        }
      >
        {overview.invoices.length > 0 ? (
          <div className="overflow-x-auto rounded-[8px] border border-border">
            <table className="min-w-full divide-y divide-border text-left">
              <thead className="bg-surface-muted text-[11px] uppercase tracking-[0.14em] text-text-tertiary">
                <tr>
                  <th className="px-5 py-4 font-medium">Invoice</th>
                  <th className="px-5 py-4 font-medium">Project / Client</th>
                  <th className="px-5 py-4 font-medium text-right">Base</th>
                  <th className="px-5 py-4 font-medium text-right">VAT</th>
                  <th className="px-5 py-4 font-medium text-right">Total</th>
                  <th className="px-5 py-4 font-medium">Status</th>
                  <th className="px-5 py-4 font-medium">Dates</th>
                  <th className="px-5 py-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-muted bg-white">
                {overview.invoices.map((invoice) => (
                  <tr key={invoice.id}>
                    <td className="px-5 py-4">
                      <Link
                        href={`/finance/invoices/${invoice.id}/edit`}
                        className="text-sm font-semibold text-text-primary hover:text-accent"
                      >
                        {invoice.invoiceNumber}
                      </Link>
                      <p className="mt-1 text-sm text-text-secondary">{invoice.title}</p>
                    </td>
                    <td className="px-5 py-4">
                      <p className="text-sm font-medium text-text-primary">
                        {invoice.projectCode} / {invoice.projectName}
                      </p>
                      <p className="mt-1 text-sm text-text-secondary">{invoice.clientName}</p>
                    </td>
                    <td className="px-5 py-4 text-right text-sm font-medium text-text-primary">
                      {formatCurrencyIdr(invoice.invoiceAmount.amount)}
                    </td>
                    <td className="px-5 py-4 text-right">
                      <p className="text-sm font-medium text-text-primary">
                        {formatCurrencyIdr(invoice.taxAmount.amount)}
                      </p>
                      <p className="mt-1 text-xs text-text-tertiary">
                        {invoice.taxPercentage ?? 0}%
                      </p>
                    </td>
                    <td className="px-5 py-4 text-right text-sm font-semibold text-text-primary">
                      {formatCurrencyIdr(
                        invoice.invoiceAmount.amount + invoice.taxAmount.amount,
                      )}
                    </td>
                    <td className="px-5 py-4">
                      <StatusBadge value={invoice.status} />
                    </td>
                    <td className="px-5 py-4 text-xs leading-5 text-text-secondary">
                      <p>Issued: {invoice.issuedDate ? formatShortDate(invoice.issuedDate) : "Not issued"}</p>
                      <p>Due: {invoice.dueDate ? formatShortDate(invoice.dueDate) : "Not set"}</p>
                      <p>Paid: {invoice.paidAt ? formatShortDate(invoice.paidAt) : "Not paid"}</p>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <div className="flex justify-end gap-3 text-sm font-medium">
                        <Link
                          href={`/projects/${invoice.projectId}?tab=finance`}
                          className="text-text-secondary underline-offset-4 hover:text-accent hover:underline"
                        >
                          View
                        </Link>
                        <Link
                          href={`/finance/invoices/${invoice.id}/edit`}
                          className="text-text-primary underline-offset-4 hover:text-accent hover:underline"
                        >
                          Edit
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-[4px] border border-border bg-white px-4 py-4 text-sm text-text-secondary">
            <span>
              {overview.totalInvoiceCount === 0
                ? "No client invoices have been saved yet."
                : "No invoices match the current search and status filters."}
            </span>
            {overview.totalInvoiceCount > 0 ? (
              <Link href="/finance" className="font-medium text-text-primary underline">
                Clear filters
              </Link>
            ) : null}
          </div>
        )}
      </SectionPanel>

      <section className="grid gap-6 xl:grid-cols-2">
        <SectionPanel title="Invoices Needing Follow-up" description="These client invoices are late or still waiting for payment.">
          <div className="space-y-3">
            {overview.overdueInvoices.map((invoice) => (
              <div
                key={invoice.id}
                className="flex items-start justify-between gap-4 rounded-[4px] border border-border bg-white px-4 py-4"
              >
                <div className="space-y-1">
                  <Link
                    href={`/finance/invoices/${invoice.id}/edit`}
                    className="text-sm font-semibold text-text-primary hover:text-accent"
                  >
                    {invoice.invoiceNumber} / {invoice.title}
                  </Link>
                  <p className="text-sm text-text-secondary">
                    {invoice.projectCode} / {invoice.projectName}
                  </p>
                  <p className="text-sm text-text-secondary">{invoice.clientName}</p>
                </div>
                <div className="space-y-2 text-right">
                  <StatusBadge value={invoice.status} />
                  <p className="text-sm font-semibold text-text-primary">
                    {formatCurrencyIdr(invoice.invoiceAmount.amount)}
                  </p>
                  <p className="text-xs uppercase tracking-[0.14em] text-text-tertiary">
                    Due {invoice.dueDate ? formatShortDate(invoice.dueDate) : "TBD"}
                  </p>
                </div>
              </div>
            ))}
            {overview.overdueInvoices.length === 0 ? (
              <div className="rounded-[4px] border border-border bg-white px-4 py-4 text-sm text-text-secondary">
                No client invoices need follow-up right now.
              </div>
            ) : null}
          </div>
        </SectionPanel>

        <SectionPanel
          title="Open Vendor Obligations"
          description="Payables tracked by project and vendor."
        >
          <div className="space-y-3">
            {overview.unpaidVendorObligations.map((item) => (
              <div
                key={item.id}
                className="flex items-start justify-between gap-4 rounded-[4px] border border-border bg-white px-4 py-4"
              >
                <div className="space-y-1">
                  <Link
                    href={`/finance/vendor-obligations/${item.id}/edit`}
                    className="text-sm font-semibold text-text-primary hover:text-accent"
                  >
                    {item.title}
                  </Link>
                  <p className="text-sm text-text-secondary">
                    {item.projectCode} / {item.projectName}
                  </p>
                  <p className="text-sm text-text-secondary">{item.vendorName}</p>
                </div>
                <div className="space-y-2 text-right">
                  <StatusBadge value={item.status} />
                  <p className="text-sm font-semibold text-text-primary">
                    {formatCurrencyIdr(item.amount.amount)}
                  </p>
                  <p className="text-xs uppercase tracking-[0.14em] text-text-tertiary">
                    Due {item.dueDate ? formatShortDate(item.dueDate) : "TBD"}
                  </p>
                </div>
              </div>
            ))}
            {overview.unpaidVendorObligations.length === 0 ? (
              <div className="rounded-[4px] border border-border bg-white px-4 py-4 text-sm text-text-secondary">
                No due or overdue vendor obligations.
              </div>
            ) : null}
          </div>
        </SectionPanel>
      </section>
    </div>
  );
}
