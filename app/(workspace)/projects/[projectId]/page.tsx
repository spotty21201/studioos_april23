import { notFound } from "next/navigation";
import Link from "next/link";
import { Landmark, Receipt, WalletCards, Waypoints } from "lucide-react";
import { ProjectNoteForm } from "@/components/forms/project-note-form";
import { ArchiveProjectSection } from "@/components/ui/archive-project-section";
import { MetricCard } from "@/components/ui/metric-card";
import { PageHeader } from "@/components/ui/page-header";
import { ProjectStatusBadge } from "@/components/ui/project-status-badge";
import { SectionPanel } from "@/components/ui/section-panel";
import { StatusBadge } from "@/components/ui/status-badge";
import { formatCurrencyIdr, formatDateTime, formatShortDate } from "@/lib/format";
import { getProjectDetailPageData } from "@/lib/studio-data";

type ProjectDetailPageProps = {
  params: Promise<{ projectId: string }>;
  searchParams: Promise<{ tab?: string }>;
};

export default async function ProjectDetailPage({
  params,
  searchParams,

}: ProjectDetailPageProps) {
  const { projectId } = await params;
  const tabQuery = String((await searchParams).tab ?? "overview");
  const detail = await getProjectDetailPageData(projectId);

  if (!detail) {
    notFound();
  }

  const tabs: Array<{ key: string; label: string }> = [
    { key: "overview", label: "Overview" },
    { key: "finance", label: "Finance" },
    { key: "notes", label: "Notes" },
    { key: "activity", label: "Activity" },
  ];

  const showOverview =
    tabQuery !== "finance" &&
    tabQuery !== "notes" &&
    tabQuery !== "activity";

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow={detail.project.projectCode}
        title={detail.project.name}
          description={
            detail.project.summary ??
            "Key information about this project, client, dates, and responsibilities."
          }
        actions={
          <>
            <ProjectStatusBadge
              lifecycleValue={detail.project.lifecycleStatus}
              healthValue={detail.project.healthStatus}
            />
            <Link
              href={`/projects/${detail.project.id}/edit`}
              className="inline-flex h-11 items-center justify-center rounded-[2px] border border-black bg-white px-5 text-sm font-medium text-black hover:bg-surface-muted"
            >
              Edit
            </Link>
          </>
        }
      />

      {/* Tab Navigation */}
      <div className="flex gap-0 border-b border-border">
        {tabs.map((t) => {
          const isActive = t.key === tabQuery;
          return (
            <Link
              key={t.key}
              href={`/projects/${detail.project.id}?tab=${t.key}`}
              className={`relative px-4 py-3 text-sm font-medium transition-colors ${
                isActive
                  ? "text-accent"
                  : "text-text-secondary hover:text-text-primary"
              }`}
            >
              {t.label}
              {isActive && (
                <span className="absolute bottom-0 left-0 right-0 h-px bg-accent" />
              )}
            </Link>
          );
        })}
      </div>

      {/* Overview + Attention */}
      {showOverview && (
        <>
          <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <MetricCard
            label="Total Contract Value"
              value={formatCurrencyIdr(detail.financeSummary.contractValue.amount, {
                compact: true,
              })}
              supportingText={detail.project.clientName}
              icon={Waypoints}
            />
          <MetricCard
            label="Unpaid by Client"
            value={formatCurrencyIdr(
              detail.financeSummary.outstandingReceivable.amount,
              { compact: true },
            )}
            supportingText="Open client invoices"
              icon={Landmark}
              tone="accent"
            />
          <MetricCard
            label="Unpaid to Vendors"
            value={formatCurrencyIdr(detail.financeSummary.outstandingPayable.amount, {
              compact: true,
            })}
            supportingText="Open vendor obligations"
              icon={WalletCards}
              tone="warning"
            />
          <MetricCard
            label="Tax Still to Be Paid"
            value={formatCurrencyIdr(detail.financeSummary.unpaidTax.amount, {
              compact: true,
            })}
            supportingText="Combined tax across invoices and vendor obligations"
              icon={Receipt}
            />
          </section>

          <section className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
            <SectionPanel
              title="Project Overview"
              description="Key information about this project, client, dates, and responsibilities."
            >
              <dl className="grid gap-5 sm:grid-cols-2">
                <div>
                  <dt className="eyebrow">Primary Client</dt>
                  <dd className="mt-2 text-sm font-medium text-text-primary">
                    {detail.project.clientName}
                  </dd>
                </div>
                <div>
                  <dt className="eyebrow">Primary Contact at Client</dt>
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
                  <dt className="eyebrow">Client Manager</dt>
                  <dd className="mt-2 text-sm font-medium text-text-primary">
                    {detail.project.projectOwnerName ?? (
                      <>
                        Not set
                        <span className="ml-1 text-xs text-critical">(Assign someone so follow-up responsibility is clear)</span>
                      </>
                    )}
                  </dd>
                </div>
                <div>
                  <dt className="eyebrow">Project Manager</dt>
                  <dd className="mt-2 text-sm font-medium text-text-primary">
                    {detail.project.projectLeadName ?? (
                      <>
                        Not set
                        <span className="ml-1 text-xs text-text-secondary">(Person who handles day-to-day project work)</span>
                      </>
                    )}
                  </dd>
                </div>
                <div>
                  <dt className="eyebrow">Location</dt>
                  <dd className="mt-2 text-sm font-medium text-text-primary">
                    {detail.project.location ?? "Not set"}
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
                  <dt className="eyebrow">End Date</dt>
                  <dd className="mt-2 text-sm font-medium text-text-primary">
                    {detail.project.targetEndDate
                      ? formatShortDate(detail.project.targetEndDate)
                      : "Not set"}
                  </dd>
                </div>
              </dl>
            </SectionPanel>

            <SectionPanel
              title="What Needs Attention"
              description="These are the open issues and follow-ups for this project."
            >
              <div className="space-y-3">
                {detail.attentionItems.length > 0 ? (
                  detail.attentionItems.map((item) => (
                    <div
                      key={item.id}
                      className="rounded-[4px] border border-border bg-white px-4 py-4"
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
                  <div className="rounded-[4px] border border-border bg-white px-4 py-4 text-sm text-text-secondary">
                    No project issues are currently reported for this record. Nothing is flagged right now.
                  </div>
                )}
              </div>
            </SectionPanel>
          </section>

          {/* Notes & Activity - always shown below tabs on overview or when no specific tab */}
          {tabQuery !== "notes" && tabQuery !== "activity" && (
            <section className="grid gap-6 xl:grid-cols-2">
              <SectionPanel
                title="Notes"
                description="Keep important project notes, decisions, and meeting outcomes here."
              >
                <div className="space-y-6">
                  <p className="text-xs text-text-secondary">Use this note to record a decision, meeting outcome, issue, or follow-up.</p>
                  <div className="rounded-[4px] border border-border bg-surface-muted p-4">
                    <ProjectNoteForm projectId={detail.project.id} />
                  </div>
                  {detail.notes.map((note) => (
                    <div
                      key={note.id}
                      className="rounded-[4px] border border-border bg-white px-4 py-4"
                    >
                      <div className="flex items-center justify-between gap-4">
                        <p className="text-sm font-semibold text-text-primary">
                          <Link
                            href={`/projects/${detail.project.id}/notes/${note.id}/edit`}
                            className="hover:text-accent"
                          >
                            {note.title ?? "Untitled note"}
                          </Link>
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
                    <div className="rounded-[4px] border border-border bg-white px-4 py-4 text-sm text-text-secondary">
                      No notes are linked to this project yet.
                    </div>
                  ) : null}
                </div>
              </SectionPanel>

              <SectionPanel title="Activity" description="Recent updates to this project.">
                <div className="space-y-4">
                  {detail.activity.map((item) => (
                    <div key={item.id} className="border-b border-border pb-4 last:border-b-0">
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
                    <div className="rounded-[4px] border border-border bg-white px-4 py-4 text-sm text-text-secondary">
                      No activity has been recorded for this project yet.
                    </div>
                  ) : null}
                </div>
              </SectionPanel>
            </section>
          )}
        </>
      )}

      {/* Finance Tab */}
      {tabQuery === "finance" && (
        <SectionPanel
          title="Project Finance"
          description="Invoices and vendor obligations tied directly to this project."
          action={
            <div className="flex flex-wrap gap-2">
              <Link
                href={`/finance/invoices/new?projectId=${detail.project.id}`}
                className="inline-flex h-10 items-center justify-center rounded-[2px] border border-black bg-white px-4 text-sm font-medium text-black hover:bg-surface-muted"
              >
                Add Invoice
              </Link>
              <Link
                href={`/finance/vendor-obligations/new?projectId=${detail.project.id}`}
                className="inline-flex h-10 items-center justify-center rounded-[2px] border border-black bg-white px-4 text-sm font-medium text-black hover:bg-surface-muted"
              >
                Add Vendor Payment
              </Link>
            </div>
          }
        >
          <div className="space-y-6">
            <div className="overflow-hidden rounded-[8px] border border-border">
              <table className="min-w-full divide-y divide-border text-left">
                <thead className="bg-surface-muted text-[11px] uppercase tracking-[0.14em] text-text-tertiary">
                  <tr>
                    <th className="px-5 py-4 font-medium">Invoices</th>
                    <th className="px-5 py-4 font-medium">Status</th>
                    <th className="px-5 py-4 font-medium text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-muted bg-white">
                  {detail.invoices.map((invoice) => (
                    <tr key={invoice.id}>
                      <td className="px-5 py-4">
                        <Link
                          href={`/finance/invoices/${invoice.id}/edit`}
                          className="text-sm font-semibold text-text-primary hover:text-accent"
                        >
                          {invoice.invoiceNumber}
                        </Link>
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

            <div className="overflow-hidden rounded-[8px] border border-border">
              <table className="min-w-full divide-y divide-border text-left">
                <thead className="bg-surface-muted text-[11px] uppercase tracking-[0.14em] text-text-tertiary">
                  <tr>
                    <th className="px-5 py-4 font-medium">Vendor Obligations</th>
                    <th className="px-5 py-4 font-medium">Status</th>
                    <th className="px-5 py-4 font-medium text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-muted bg-white">
                  {detail.vendorObligations.map((item) => (
                    <tr key={item.id}>
                      <td className="px-5 py-4">
                        <Link
                          href={`/finance/vendor-obligations/${item.id}/edit`}
                          className="text-sm font-semibold text-text-primary hover:text-accent"
                        >
                          {item.vendorName}
                        </Link>
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
      )}

      {/* Notes Tab (only mode) */}
      {tabQuery === "notes" && (
        <SectionPanel
          title="Notes"
          description="Keep important project notes, decisions, and meeting outcomes here."
        >
          <div className="space-y-6">
            <p className="text-xs text-text-secondary">Use this note to record a decision, meeting outcome, issue, or follow-up.</p>
            <div className="rounded-[4px] border border-border bg-surface-muted p-4">
              <ProjectNoteForm projectId={detail.project.id} />
            </div>
            {detail.notes.map((note) => (
              <div
                key={note.id}
                className="rounded-[4px] border border-border bg-white px-4 py-4"
              >
                <div className="flex items-center justify-between gap-4">
                  <p className="text-sm font-semibold text-text-primary">
                    <Link
                      href={`/projects/${detail.project.id}/notes/${note.id}/edit`}
                      className="hover:text-accent"
                    >
                      {note.title ?? "Untitled note"}
                    </Link>
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
              <div className="rounded-[4px] border border-border bg-white px-4 py-4 text-sm text-text-secondary">
                No notes are linked to this project yet.
              </div>
            ) : null}
          </div>
        </SectionPanel>
      )}

      {/* Activity Tab (only mode) */}
      {tabQuery === "activity" && (
        <SectionPanel title="Activity" description="Recent updates to this project.">
          <div className="space-y-4">
            {detail.activity.map((item) => (
              <div key={item.id} className="border-b border-border pb-4 last:border-b-0">
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
              <div className="rounded-[4px] border border-border bg-white px-4 py-4 text-sm text-text-secondary">
                No activity has been recorded for this project yet.
              </div>
            ) : null}
          </div>
        </SectionPanel>
      )}

      <ArchiveProjectSection
        projectId={detail.project.id}
        projectName={detail.project.name}
      />
    </div>
  );
}
