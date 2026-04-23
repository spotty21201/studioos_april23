import Link from "next/link";
import { notFound } from "next/navigation";
import { ProjectNoteForm } from "@/components/forms/project-note-form";
import { PageHeader } from "@/components/ui/page-header";
import { SectionPanel } from "@/components/ui/section-panel";
import { getNoteEditFormData } from "@/lib/studio-form-data";

type EditProjectNotePageProps = {
  params: Promise<{
    projectId: string;
    noteId: string;
  }>;
};

export default async function EditProjectNotePage({
  params,
}: EditProjectNotePageProps) {
  const { projectId, noteId } = await params;
  const data = await getNoteEditFormData(projectId, noteId);

  if (!data) {
    notFound();
  }

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow={data.project.project_code}
        title="Edit Note"
        description="Update project-attached institutional memory."
        actions={
          <Link
            href={`/projects/${data.project.id}`}
            className="inline-flex h-11 items-center justify-center rounded-[2px] border border-black bg-white px-5 text-sm font-medium text-black hover:bg-surface-muted"
          >
            Back to Project
          </Link>
        }
      />

      <SectionPanel
        title="Project Note"
        description="Note title, type, body, and noted timestamp are editable in V1."
      >
        <ProjectNoteForm mode="edit" projectId={data.project.id} note={data.note} />
      </SectionPanel>
    </div>
  );
}
