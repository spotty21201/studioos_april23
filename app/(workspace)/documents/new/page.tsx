import Link from "next/link";
import { PageHeader } from "@/components/ui/page-header";
import { SectionPanel } from "@/components/ui/section-panel";
import { DataSourceNotice } from "@/components/ui/data-source-notice";
import { DocumentForm } from "@/components/forms/document-form";
import { getStudioFormOptions } from "@/lib/studio-form-data";

type NewDocumentPageProps = {
  searchParams: Promise<{ projectId?: string }>;
};

export default async function NewDocumentPage({ searchParams }: NewDocumentPageProps) {
  const [{ projectId }, options] = await Promise.all([
    searchParams,
    getStudioFormOptions(),
  ]);

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Document Index"
        title="Add Document"
        description="Add an external link or stored file reference to a project record."
        actions={
          <Link
            href="/documents"
            className="inline-flex h-11 items-center justify-center rounded-full border border-border bg-white px-5 text-sm font-medium text-text-primary hover:border-border-strong"
          >
            Back to Documents
          </Link>
        }
      />

      {options.warning ? (
        <DataSourceNotice title="Form data notice" message={options.warning} />
      ) : null}

      <SectionPanel
        title="Document Reference"
        description="V1 stores metadata and references only; binary upload can remain behind Supabase Storage policy work."
      >
        <DocumentForm options={options} defaultProjectId={projectId} />
      </SectionPanel>
    </div>
  );
}
