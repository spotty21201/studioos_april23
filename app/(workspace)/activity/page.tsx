import { PageHeader } from "@/components/ui/page-header";
import { SectionPanel } from "@/components/ui/section-panel";
import { StatusBadge } from "@/components/ui/status-badge";
import { formatDateTime } from "@/lib/format";
import { getActivityPageData } from "@/lib/studio-data";

export default async function ActivityPage() {
  const data = await getActivityPageData();

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Institutional Memory"
        title="Notes & Activity"
        description="Notes preserve project memory. Activity preserves traceability of meaningful system changes."
      />

      <section className="grid gap-6 xl:grid-cols-2">
        <SectionPanel
          title="Recent Notes"
          description="Typed, project-attached notes for leadership context."
        >
          <div className="space-y-4">
            {data.notes.map((note) => (
              <div
                key={note.id}
                className="rounded-[4px] border border-border bg-white px-4 py-4"
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

        <SectionPanel title="Recent Activity" description="Meaningful events only.">
          <div className="space-y-4">
            {data.activity.map((item) => (
              <div
                key={item.id}
                className="rounded-[4px] border border-border bg-white px-4 py-4"
              >
                <div className="flex items-center justify-between gap-4">
                  <p className="text-sm font-semibold text-text-primary">{item.summary}</p>
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
