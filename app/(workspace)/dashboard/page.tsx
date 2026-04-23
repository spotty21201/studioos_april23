import Link from "next/link";
import {
  AlertTriangle,
  ArrowUpRight,
  BriefcaseBusiness,
  Receipt,
  WalletCards,
} from "lucide-react";
import { MetricCard } from "@/components/ui/metric-card";
import { PageHeader } from "@/components/ui/page-header";
import { SectionPanel } from "@/components/ui/section-panel";
import { StatusBadge } from "@/components/ui/status-badge";
import { formatCurrencyIdr, formatDateTime, formatShortDate } from "@/lib/format";
import { getDashboardPageData } from "@/lib/studio-data";

const metricIconMap = {
  active_projects: BriefcaseBusiness,
  projects_needing_attention: AlertTriangle,
  overdue_invoices: Receipt,
  unpaid_vendor_obligations: WalletCards,
  outstanding_receivables: ArrowUpRight,
} as const;

const metricToneMap = {
  active_projects: "default",
  projects_needing_attention: "critical",
  overdue_invoices: "warning",
  unpaid_vendor_obligations: "warning",
  outstanding_receivables: "accent",
} as const;

export default async function DashboardPage() {
  const snapshot = await getDashboardPageData();

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Principal Workspace"
        title="Dashboard"
        description="Scan active work, identify issues, open a project, and leave with clarity. The surface stays table-first and exception-oriented."
      />

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        {snapshot.metrics.map((metric, index) => (
          <div key={metric.key} style={{ animationDelay: `${index * 60}ms` }}>
            <MetricCard
              label={metric.label}
              value={
                metric.currency
                  ? formatCurrencyIdr(metric.value, { compact: true })
                  : metric.value.toLocaleString("en-US")
              }
              supportingText={metric.note ?? "Operational overview"}
              icon={metricIconMap[metric.key]}
              tone={metricToneMap[metric.key]}
            />
          </div>
        ))}
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <SectionPanel
          title="Projects Needing Attention"
          description="Driven by the backend attention read model."
        >
          <div className="space-y-3">
            {snapshot.attentionItems.length > 0 ? (
              snapshot.attentionItems.map((item) => (
                <Link
                  key={item.id}
                  href={`/projects/${item.projectId}`}
                  className="group flex items-start justify-between gap-4 rounded-[20px] border border-border/80 bg-white/65 px-4 py-4 hover:border-border-strong hover:bg-white"
                >
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <p className="text-sm font-semibold text-text-primary">
                        {item.projectCode}
                      </p>
                      <StatusBadge value={item.label} />
                    </div>
                    <div>
                      <p className="text-base font-semibold tracking-[-0.03em] text-text-primary">
                        {item.projectName}
                      </p>
                      <p className="text-sm text-text-secondary">{item.clientName}</p>
                    </div>
                    <p className="max-w-2xl text-sm leading-6 text-text-secondary">
                      {item.summary}
                    </p>
                  </div>
                  <ArrowUpRight className="mt-1 h-4 w-4 shrink-0 text-text-tertiary transition group-hover:text-accent" />
                </Link>
              ))
            ) : (
              <div className="rounded-[20px] border border-border/80 bg-white/70 px-4 py-4 text-sm text-text-secondary">
                No active attention flags are currently exposed by the backend views.
              </div>
            )}
          </div>
        </SectionPanel>

        <SectionPanel
          title="Recent Notes"
          description="Latest project memory for quick leadership context."
        >
          <div className="space-y-4">
            {snapshot.recentNotes.map((note) => (
              <div
                key={note.id}
                className="rounded-[20px] border border-border/80 bg-white/75 px-4 py-4"
              >
                <div className="flex items-center justify-between gap-4">
                  <p className="text-sm font-semibold text-text-primary">
                    {note.title ?? "Untitled note"}
                  </p>
                  <StatusBadge value={note.noteType} />
                </div>
                <p className="mt-2 text-sm leading-6 text-text-secondary">
                  {note.bodyPreview}
                </p>
                <p className="mt-3 text-xs uppercase tracking-[0.14em] text-text-tertiary">
                  {note.projectCode} / {note.authorName} / {formatDateTime(note.notedAt)}
                </p>
              </div>
            ))}
          </div>
        </SectionPanel>
      </section>

      <section className="grid gap-6 xl:grid-cols-2">
        <SectionPanel
          title="Overdue Invoices"
          description="Open receivable issues that need follow-up."
        >
          <div className="overflow-hidden rounded-[22px] border border-border/80">
            <table className="min-w-full divide-y divide-border/80 text-left">
              <thead className="bg-surface-muted/70 text-[11px] uppercase tracking-[0.14em] text-text-tertiary">
                <tr>
                  <th className="px-5 py-4 font-medium">Invoice</th>
                  <th className="px-5 py-4 font-medium">Project</th>
                  <th className="px-5 py-4 font-medium">Status</th>
                  <th className="px-5 py-4 font-medium text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/70 bg-white/75">
                {snapshot.overdueInvoices.map((invoice) => (
                  <tr key={invoice.id}>
                    <td className="px-5 py-4">
                      <p className="text-sm font-semibold text-text-primary">
                        {invoice.invoiceNumber}
                      </p>
                      <p className="mt-1 text-sm text-text-secondary">
                        Due {invoice.dueDate ? formatShortDate(invoice.dueDate) : "TBD"}
                      </p>
                    </td>
                    <td className="px-5 py-4">
                      <Link
                        href={`/projects/${invoice.projectId}`}
                        className="text-sm font-semibold text-text-primary hover:text-accent"
                      >
                        {invoice.projectCode}
                      </Link>
                      <p className="mt-1 text-sm text-text-secondary">
                        {invoice.projectName}
                      </p>
                    </td>
                    <td className="px-5 py-4">
                      <StatusBadge value={invoice.status} />
                    </td>
                    <td className="px-5 py-4 text-right text-sm font-medium text-text-primary">
                      {formatCurrencyIdr(invoice.invoiceAmount.amount)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </SectionPanel>

        <SectionPanel
          title="Vendor Obligations"
          description="Due and overdue vendor commitments across projects."
        >
          <div className="overflow-hidden rounded-[22px] border border-border/80">
            <table className="min-w-full divide-y divide-border/80 text-left">
              <thead className="bg-surface-muted/70 text-[11px] uppercase tracking-[0.14em] text-text-tertiary">
                <tr>
                  <th className="px-5 py-4 font-medium">Vendor</th>
                  <th className="px-5 py-4 font-medium">Project</th>
                  <th className="px-5 py-4 font-medium">Status</th>
                  <th className="px-5 py-4 font-medium text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/70 bg-white/75">
                {snapshot.unpaidVendorObligations.map((item) => (
                  <tr key={item.id}>
                    <td className="px-5 py-4">
                      <p className="text-sm font-semibold text-text-primary">
                        {item.vendorName}
                      </p>
                      <p className="mt-1 text-sm text-text-secondary">{item.title}</p>
                    </td>
                    <td className="px-5 py-4">
                      <Link
                        href={`/projects/${item.projectId}`}
                        className="text-sm font-semibold text-text-primary hover:text-accent"
                      >
                        {item.projectCode}
                      </Link>
                      <p className="mt-1 text-sm text-text-secondary">
                        {item.projectName}
                      </p>
                    </td>
                    <td className="px-5 py-4">
                      <StatusBadge value={item.status} />
                    </td>
                    <td className="px-5 py-4 text-right text-sm font-medium text-text-primary">
                      {formatCurrencyIdr(item.amount.amount)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </SectionPanel>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <SectionPanel
          title="Active Projects"
          description="Current live work sorted by most recently updated record."
        >
          <div className="overflow-hidden rounded-[22px] border border-border/80">
            <table className="min-w-full divide-y divide-border/80 text-left">
              <thead className="bg-surface-muted/70 text-[11px] uppercase tracking-[0.14em] text-text-tertiary">
                <tr>
                  <th className="px-5 py-4 font-medium">Project</th>
                  <th className="px-5 py-4 font-medium">Status</th>
                  <th className="px-5 py-4 font-medium">Client</th>
                  <th className="px-5 py-4 font-medium text-right">Receivable</th>
                  <th className="px-5 py-4 font-medium text-right">Payable</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/70 bg-white/75">
                {snapshot.activeProjects.map((project) => (
                  <tr key={project.id}>
                    <td className="px-5 py-4">
                      <Link
                        href={`/projects/${project.id}`}
                        className="text-sm font-semibold text-text-primary hover:text-accent"
                      >
                        {project.projectCode}
                      </Link>
                      <p className="mt-1 text-sm text-text-secondary">{project.name}</p>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex flex-col gap-2">
                        <StatusBadge value={project.lifecycleStatus} />
                        <StatusBadge value={project.healthStatus} />
                      </div>
                    </td>
                    <td className="px-5 py-4 text-sm text-text-secondary">
                      {project.clientName}
                    </td>
                    <td className="px-5 py-4 text-right text-sm font-medium text-text-primary">
                      {formatCurrencyIdr(project.outstandingReceivable.amount)}
                    </td>
                    <td className="px-5 py-4 text-right text-sm font-medium text-text-primary">
                      {formatCurrencyIdr(project.outstandingPayable.amount)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </SectionPanel>

        <SectionPanel
          title="Recent Activity"
          description="Latest cross-project changes from the current activity stream."
        >
          <div className="space-y-4">
            {snapshot.recentActivity.map((item) => (
              <div
                key={item.id}
                className="rounded-[20px] border border-border/80 bg-white/75 px-4 py-4"
              >
                <div className="flex items-center justify-between gap-4">
                  <p className="text-sm font-semibold text-text-primary">
                    {item.summary}
                  </p>
                  <StatusBadge value={item.entityType} tone="neutral" />
                </div>
                <p className="mt-2 text-sm text-text-secondary">
                  {item.projectCode} / {item.projectName}
                </p>
                <p className="mt-3 text-xs uppercase tracking-[0.14em] text-text-tertiary">
                  {formatDateTime(item.occurredAt)}
                </p>
              </div>
            ))}
          </div>
        </SectionPanel>
      </section>
    </div>
  );
}
