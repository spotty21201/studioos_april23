"use client";

import { useActionState } from "react";
import {
  createDocumentAction,
  updateDocumentAction,
  type FormActionState,
} from "@/app/(workspace)/actions";
import {
  Field,
  FormError,
  SubmitButton,
  inputClass,
  selectClass,
  textareaClass,
} from "@/components/forms/form-primitives";
import type { StudioFormOptions } from "@/lib/studio-form-data";
import type { DocumentRecordRow } from "@/lib/supabase/view-contracts";

type DocumentFormProps = {
  mode?: "create" | "edit";
  options: StudioFormOptions;
  defaultProjectId?: string;
  document?: DocumentRecordRow;
};

const initialState: FormActionState = {
  message: null,
  fieldErrors: {},
};

export function DocumentForm({
  mode = "create",
  options,
  defaultProjectId,
  document,
}: DocumentFormProps) {
  const [state, formAction] = useActionState(
    mode === "edit" ? updateDocumentAction : createDocumentAction,
    initialState,
  );

  return (
    <form action={formAction} className="space-y-6">
      {document ? (
        <>
          <input type="hidden" name="document_id" value={document.id} />
          <input type="hidden" name="original_project_id" value={document.project_id} />
        </>
      ) : null}
      <FormError message={state.message} />

      <div className="grid gap-4 md:grid-cols-2">
        <Field
          label="Project"
          htmlFor="document-project"
          required
          error={state.fieldErrors.project_id}
        >
          <select
            id="document-project"
            name="project_id"
            className={selectClass}
            defaultValue={document?.project_id ?? defaultProjectId ?? ""}
            required
          >
            <option value="">Select project</option>
            {options.projects.map((project) => (
              <option key={project.id} value={project.id}>
                {project.projectCode} / {project.name}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Title" htmlFor="document-title" required error={state.fieldErrors.title}>
          <input
            id="document-title"
            name="title"
            className={inputClass}
            defaultValue={document?.title ?? ""}
            placeholder="Signed proposal"
            required
          />
        </Field>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Field label="Category" htmlFor="document-category">
          <select
            id="document-category"
            name="category"
            className={selectClass}
            defaultValue={document?.category ?? "support_document"}
          >
            <option value="proposal">Proposal</option>
            <option value="contract">Contract</option>
            <option value="client_document">Client document</option>
            <option value="deliverable">Deliverable</option>
            <option value="support_document">Support document</option>
            <option value="invoice_attachment">Invoice attachment</option>
            <option value="vendor_attachment">Vendor attachment</option>
          </select>
        </Field>
        <Field label="Source" htmlFor="document-source-type">
          <select
            id="document-source-type"
            name="source_type"
            className={selectClass}
            defaultValue={document?.source_type ?? "external_link"}
          >
            <option value="external_link">External link</option>
            <option value="file">Stored file reference</option>
          </select>
        </Field>
        <Field
          label="Document date"
          htmlFor="document-date"
          error={state.fieldErrors.document_date}
        >
          <input
            id="document-date"
            name="document_date"
            type="date"
            className={inputClass}
            defaultValue={document?.document_date ?? ""}
          />
        </Field>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Field
          label="External URL"
          htmlFor="external-url"
          error={state.fieldErrors.external_url}
        >
          <input
            id="external-url"
            name="external_url"
            type="url"
            className={inputClass}
            defaultValue={document?.external_url ?? ""}
            placeholder="https://..."
          />
        </Field>
        <Field
          label="Stored file reference"
          htmlFor="file-path"
          error={state.fieldErrors.file_path}
        >
          <input
            id="file-path"
            name="file_path"
            className={inputClass}
            defaultValue={document?.file_path ?? ""}
            placeholder="project-documents/path/file.pdf"
          />
        </Field>
      </div>

      <Field label="Description" htmlFor="document-description">
        <textarea
          id="document-description"
          name="description"
          className={textareaClass}
          defaultValue={document?.description ?? ""}
          placeholder="Document context or retrieval notes."
        />
      </Field>

      <div className="flex justify-end">
        <SubmitButton>{mode === "edit" ? "Save Document" : "Add Document"}</SubmitButton>
      </div>
    </form>
  );
}
