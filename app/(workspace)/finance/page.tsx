import Link from "next/link";
import { Landmark, WalletCards, Waypoints } from "lucide-react";
import { MetricCard } from "@/components/ui/metric-card";
import { PageHeader } from "@/components/ui/page-header";
import { SectionPanel } from "@/components/ui/section-panel";
import { StatusBadge } from "@/components/ui/status-badge";
import { formatCurrencyIdr, formatShortDate } from "@/lib/format";
import { getFinancePageData } from "@/lib/studio-data";

export default async function FinancePage() {
  const overview = await getFinancePageData();

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
              className="inline-flex h-11 items-center justify-center rounded-full bg-accent px-5 text-sm font-medium text-white hover:bg-accent-strong"
            >
              Add Invoice
            </Link>
            <Link
              href="/finance/vendor-obligations/new"
              className="inline-flex h-11 items-center justify-center rounded-full border border-border bg-white px-5 text-sm font-medium text-text-primary hover:border-border-strong"
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

      <section className="grid gap-6 xl:grid-cols-2">
        <SectionPanel title="Overdue Invoices" description="Receivables needing follow-up.">
          <div className="space-y-3">
            {overview.overdueInvoices.map((invoice) => (
              <div
                key={invoice.id}
                className="flex items-start justify-between gap-4 rounded-[20px] border border-border/80 bg-white/70 px-4 py-4"
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
              <div className="rounded-[20px] border border-border/80 bg-white/75 px-4 py-4 text-sm text-text-secondary">
                No overdue invoices are currently exposed by the backend data.
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
                className="flex items-start justify-between gap-4 rounded-[20px] border border-border/80 bg-white/70 px-4 py-4"
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
              <div className="rounded-[20px] border border-border/80 bg-white/75 px-4 py-4 text-sm text-text-secondary">
                No due or overdue vendor obligations are currently exposed by the backend data.
              </div>
            ) : null}
          </div>
        </SectionPanel>
      </section>
    </div>
  );
}
