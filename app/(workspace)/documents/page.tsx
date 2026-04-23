import Link from "next/link";
import { PageHeader } from "@/components/ui/page-header";
import { SectionPanel } from "@/components/ui/section-panel";
import { StatusBadge } from "@/components/ui/status-badge";
import { formatShortDate } from "@/lib/format";
import { getDocumentsPageData } from "@/lib/studio-data";

export default async function DocumentsPage() {
  const documents = await getDocumentsPageData();

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Record Visibility"
        title="Documents"
        description="Cross-project document visibility with clean linkage back to project context. V1 supports uploaded files and external links only, and document completeness is not part of the live attention contract."
        actions={
          <Link
            href="/documents/new"
            className="inline-flex h-11 items-center justify-center rounded-full bg-accent px-5 text-sm font-medium text-white hover:bg-accent-strong"
          >
            Add Document
          </Link>
        }
      />

      <SectionPanel
        title="Document Index"
        description={`${documents.totalCount} records currently available from the backend source.`}
      >
        <div className="overflow-hidden rounded-[22px] border border-border/80">
          <table className="min-w-full divide-y divide-border/80 text-left">
            <thead className="bg-surface-muted/70 text-[11px] uppercase tracking-[0.14em] text-text-tertiary">
              <tr>
                <th className="px-5 py-4 font-medium">Title</th>
                <th className="px-5 py-4 font-medium">Project</th>
                <th className="px-5 py-4 font-medium">Category</th>
                <th className="px-5 py-4 font-medium">Source</th>
                <th className="px-5 py-4 font-medium">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/70 bg-white/75">
              {documents.items.map((document) => (
                <tr key={document.id} className="align-top">
                  <td className="px-5 py-4">
                    <Link
                      href={`/documents/${document.id}/edit`}
                      className="text-sm font-semibold text-text-primary hover:text-accent"
                    >
                      {document.title}
                    </Link>
                    <p className="mt-1 text-sm text-text-secondary">{document.reference}</p>
                  </td>
                  <td className="px-5 py-4">
                    <p className="text-sm font-semibold text-text-primary">
                      {document.projectCode}
                    </p>
                    <p className="mt-1 text-sm text-text-secondary">
                      {document.projectName}
                    </p>
                  </td>
                  <td className="px-5 py-4">
                    <StatusBadge value={document.category} />
                  </td>
                  <td className="px-5 py-4 text-sm text-text-secondary">
                    {document.sourceType === "file" ? "Stored file" : "External link"}
                  </td>
                  <td className="px-5 py-4 text-sm text-text-secondary">
                    {document.documentDate ? formatShortDate(document.documentDate) : "-"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SectionPanel>
    </div>
  );
}
