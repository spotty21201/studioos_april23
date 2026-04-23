import Link from "next/link";
import { notFound } from "next/navigation";
import { DocumentForm } from "@/components/forms/document-form";
import { DataSourceNotice } from "@/components/ui/data-source-notice";
import { PageHeader } from "@/components/ui/page-header";
import { SectionPanel } from "@/components/ui/section-panel";
import { getDocumentEditFormData } from "@/lib/studio-form-data";

type EditDocumentPageProps = {
  params: Promise<{ documentId: string }>;
};

export default async function EditDocumentPage({ params }: EditDocumentPageProps) {
  const { documentId } = await params;
  const data = await getDocumentEditFormData(documentId);

  if (!data) {
    notFound();
  }

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow={data.document.project?.project_code ?? "Document"}
        title="Edit Document"
        description="Update a project document link or stored file reference."
        actions={
          <Link
            href={`/projects/${data.document.project_id}`}
            className="inline-flex h-11 items-center justify-center rounded-full border border-border bg-white px-5 text-sm font-medium text-text-primary hover:border-border-strong"
          >
            Back to Project
          </Link>
        }
      />

      {data.options.warning ? (
        <DataSourceNotice title="Form data notice" message={data.options.warning} />
      ) : null}

      <SectionPanel
        title="Document Reference"
        description="No storage upload workflow is added; this edits metadata and references only."
      >
        <DocumentForm mode="edit" options={data.options} document={data.document} />
      </SectionPanel>
    </div>
  );
}
