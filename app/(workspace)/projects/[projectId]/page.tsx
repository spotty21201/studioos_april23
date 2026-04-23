import { notFound } from "next/navigation";
import { Landmark, Receipt, WalletCards, Waypoints } from "lucide-react";
import { MetricCard } from "@/components/ui/metric-card";
import { PageHeader } from "@/components/ui/page-header";
import { SectionPanel } from "@/components/ui/section-panel";
import { StatusBadge } from "@/components/ui/status-badge";
import { formatCurrencyIdr, formatDateTime, formatShortDate } from "@/lib/format";
import { getProjectDetailPageData } from "@/lib/studio-data";

type ProjectDetailPageProps = {
  params: Promise<{ projectId: string }>;
};

export default async function ProjectDetailPage({
  params,
}: ProjectDetailPageProps) {
  const { projectId } = await params;
  const detail = await getProjectDetailPageData(projectId);

  if (!detail) {
    notFound();
  }

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow={detail.project.projectCode}
        title={detail.project.name}
        description={
          detail.project.summary ??
          "Executive briefing page for project context, finance exposure, documents, notes, and recent activity."
        }
        actions={
          <>
            <StatusBadge value={detail.project.lifecycleStatus} />
            <StatusBadge value={detail.project.healthStatus} />
          </>
        }
      />

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          label="Contract Value"
          value={formatCurrencyIdr(detail.financeSummary.contractValue.amount, {
            compact: true,
          })}
          supportingText={detail.project.clientName}
          icon={Waypoints}
        />
        <MetricCard
          label="Outstanding Receivable"
          value={formatCurrencyIdr(
            detail.financeSummary.outstandingReceivable.amount,
            { compact: true },
          )}
          supportingText="Open client invoices"
          icon={Landmark}
          tone="accent"
        />
        <MetricCard
          label="Outstanding Payable"
          value={formatCurrencyIdr(detail.financeSummary.outstandingPayable.amount, {
            compact: true,
          })}
          supportingText="Open vendor obligations"
          icon={WalletCards}
          tone="warning"
        />
        <MetricCard
          label="Unpaid Tax"
          value={formatCurrencyIdr(detail.financeSummary.unpaidTax.amount, {
            compact: true,
          })}
          supportingText="Combined unpaid tax across invoices and vendor obligations"
          icon={Receipt}
        />
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <SectionPanel
          title="Executive Overview"
          description="Current leadership-facing record, drawn directly from project and related profile tables."
        >
          <dl className="grid gap-5 sm:grid-cols-2">
            <div>
              <dt className="eyebrow">Primary Client</dt>
              <dd className="mt-2 text-sm font-medium text-text-primary">
                {detail.project.clientName}
              </dd>
            </div>
            <div>
              <dt className="eyebrow">Primary Contact</dt>
              <dd className="mt-2 text-sm font-medium text-text-primary">
                {detail.project.primaryContactName ?? "Not set"}
              </dd>
            </div>
            <div>
              <dt className="eyebrow">Contact Email</dt>
              <dd className="mt-2 text-sm font-medium text-text-primary">
                {detail.project.primaryContactEmail ?? "Not set"}
              </dd>
            </div>
            <div>
              <dt className="eyebrow">Project Owner</dt>
              <dd className="mt-2 text-sm font-medium text-text-primary">
                {detail.project.projectOwnerName ?? "Not assigned"}
              </dd>
            </div>
            <div>
              <dt className="eyebrow">Location</dt>
              <dd className="mt-2 text-sm font-medium text-text-primary">
                {detail.project.location ?? "Not set"}
              </dd>
            </div>
            <div>
              <dt className="eyebrow">Last Reviewed</dt>
              <dd className="mt-2 text-sm font-medium text-text-primary">
                {detail.project.lastReviewedAt
                  ? formatDateTime(detail.project.lastReviewedAt)
                  : "Not reviewed yet"}
              </dd>
            </div>
            <div>
              <dt className="eyebrow">Start Date</dt>
              <dd className="mt-2 text-sm font-medium text-text-primary">
                {detail.project.startDate
                  ? formatShortDate(detail.project.startDate)
                  : "Not set"}
              </dd>
            </div>
            <div>
              <dt className="eyebrow">Target End</dt>
              <dd className="mt-2 text-sm font-medium text-text-primary">
                {detail.project.targetEndDate
                  ? formatShortDate(detail.project.targetEndDate)
                  : "Not set"}
              </dd>
            </div>
          </dl>
        </SectionPanel>

        <SectionPanel
          title="Attention"
          description="Signals from the backend attention read model."
        >
          <div className="space-y-3">
            {detail.attentionItems.length > 0 ? (
              detail.attentionItems.map((item) => (
                <div
                  key={item.id}
                  className="rounded-[20px] border border-border/80 bg-white/75 px-4 py-4"
                >
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-sm font-semibold text-text-primary">
                      {item.projectCode}
                    </p>
                    <StatusBadge value={item.label} />
                  </div>
                  <p className="mt-2 text-sm leading-6 text-text-secondary">
                    {item.summary}
                  </p>
                </div>
              ))
            ) : (
              <div className="rounded-[20px] border border-border/80 bg-white/75 px-4 py-4 text-sm text-text-secondary">
                No project-level attention signals are currently reported for this record.
              </div>
            )}
          </div>
        </SectionPanel>
      </section>

      <section className="grid gap-6 xl:grid-cols-2">
        <SectionPanel
          title="Project Finance"
          description="Invoices and vendor obligations tied directly to this project."
        >
          <div className="space-y-6">
            <div className="overflow-hidden rounded-[22px] border border-border/80">
              <table className="min-w-full divide-y divide-border/80 text-left">
                <thead className="bg-surface-muted/70 text-[11px] uppercase tracking-[0.14em] text-text-tertiary">
                  <tr>
                    <th className="px-5 py-4 font-medium">Invoices</th>
                    <th className="px-5 py-4 font-medium">Status</th>
                    <th className="px-5 py-4 font-medium text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/70 bg-white/75">
                  {detail.invoices.map((invoice) => (
                    <tr key={invoice.id}>
                      <td className="px-5 py-4">
                        <p className="text-sm font-semibold text-text-primary">
                          {invoice.invoiceNumber}
                        </p>
                        <p className="mt-1 text-sm text-text-secondary">
                          {invoice.title}
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
                  {detail.invoices.length === 0 ? (
                    <tr>
                      <td colSpan={3} className="px-5 py-6 text-sm text-text-secondary">
                        No invoices are linked to this project yet.
                      </td>
                    </tr>
                  ) : null}
                </tbody>
              </table>
            </div>

            <div className="overflow-hidden rounded-[22px] border border-border/80">
              <table className="min-w-full divide-y divide-border/80 text-left">
                <thead className="bg-surface-muted/70 text-[11px] uppercase tracking-[0.14em] text-text-tertiary">
                  <tr>
                    <th className="px-5 py-4 font-medium">Vendor Obligations</th>
                    <th className="px-5 py-4 font-medium">Status</th>
                    <th className="px-5 py-4 font-medium text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/70 bg-white/75">
                  {detail.vendorObligations.map((item) => (
                    <tr key={item.id}>
                      <td className="px-5 py-4">
                        <p className="text-sm font-semibold text-text-primary">
                          {item.vendorName}
                        </p>
                        <p className="mt-1 text-sm text-text-secondary">{item.title}</p>
                      </td>
                      <td className="px-5 py-4">
                        <StatusBadge value={item.status} />
                      </td>
                      <td className="px-5 py-4 text-right text-sm font-medium text-text-primary">
                        {formatCurrencyIdr(item.amount.amount)}
                      </td>
                    </tr>
                  ))}
                  {detail.vendorObligations.length === 0 ? (
                    <tr>
                      <td colSpan={3} className="px-5 py-6 text-sm text-text-secondary">
                        No vendor obligations are linked to this project yet.
                      </td>
                    </tr>
                  ) : null}
                </tbody>
              </table>
            </div>
          </div>
        </SectionPanel>

        <SectionPanel
          title="Documents"
          description="Files and links currently attached to this project record. Missing-document detection is intentionally not part of the live attention read model."
        >
          <div className="space-y-3">
            {detail.documents.map((document) => (
              <div
                key={document.id}
                className="rounded-[20px] border border-border/80 bg-white/75 px-4 py-4"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    {document.linkHref ? (
                      <a
                        href={document.linkHref}
                        target="_blank"
                        rel="noreferrer"
                        className="text-sm font-semibold text-text-primary hover:text-accent"
                      >
                        {document.title}
                      </a>
                    ) : (
                      <p className="text-sm font-semibold text-text-primary">
                        {document.title}
                      </p>
                    )}
                    <p className="mt-1 text-sm text-text-secondary">
                      {document.reference}
                    </p>
                  </div>
                  <StatusBadge value={document.category} />
                </div>
              </div>
            ))}
            {detail.documents.length === 0 ? (
              <div className="rounded-[20px] border border-border/80 bg-white/75 px-4 py-4 text-sm text-text-secondary">
                No documents are linked to this project yet.
              </div>
            ) : null}
          </div>
        </SectionPanel>
      </section>

      <section className="grid gap-6 xl:grid-cols-2">
        <SectionPanel title="Notes" description="Project-attached institutional memory.">
          <div className="space-y-4">
            {detail.notes.map((note) => (
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
                  {note.authorName} / {formatDateTime(note.notedAt)}
                </p>
              </div>
            ))}
            {detail.notes.length === 0 ? (
              <div className="rounded-[20px] border border-border/80 bg-white/75 px-4 py-4 text-sm text-text-secondary">
                No notes are linked to this project yet.
              </div>
            ) : null}
          </div>
        </SectionPanel>

        <SectionPanel title="Activity" description="Recent changes for this project record.">
          <div className="space-y-4">
            {detail.activity.map((item) => (
              <div key={item.id} className="border-b border-border/80 pb-4 last:border-b-0">
                <div className="flex items-start justify-between gap-4">
                  <p className="text-sm font-medium text-text-primary">{item.summary}</p>
                  <StatusBadge value={item.entityType} tone="neutral" />
                </div>
                <p className="mt-2 text-xs uppercase tracking-[0.14em] text-text-tertiary">
                  {formatDateTime(item.occurredAt)}
                </p>
              </div>
            ))}
            {detail.activity.length === 0 ? (
              <div className="rounded-[20px] border border-border/80 bg-white/75 px-4 py-4 text-sm text-text-secondary">
                No activity has been recorded for this project yet.
              </div>
            ) : null}
          </div>
        </SectionPanel>
      </section>
    </div>
  );
}
