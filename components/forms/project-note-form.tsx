"use client";

import { useActionState } from "react";
import {
  createProjectNoteAction,
  updateProjectNoteAction,
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
import type { NoteRecordRow } from "@/lib/supabase/view-contracts";

type ProjectNoteFormProps = {
  mode?: "create" | "edit";
  projectId: string;
  note?: NoteRecordRow;
};

const initialState: FormActionState = {
  message: null,
  fieldErrors: {},
};

function toDateTimeLocal(value: string | null | undefined) {
  if (!value) {
    return "";
  }

  return new Date(value).toISOString().slice(0, 16);
}

export function ProjectNoteForm({
  mode = "create",
  projectId,
  note,
}: ProjectNoteFormProps) {
  const [state, formAction] = useActionState(
    mode === "edit" ? updateProjectNoteAction : createProjectNoteAction,
    initialState,
  );

  return (
    <form action={formAction} className="space-y-4">
      <input type="hidden" name="project_id" value={projectId} />
      {note ? <input type="hidden" name="note_id" value={note.id} /> : null}
      <FormError message={state.message} />

      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Title" htmlFor="note-title">
          <input
            id="note-title"
            name="title"
            className={inputClass}
            defaultValue={note?.title ?? ""}
            placeholder="Leadership check-in"
          />
        </Field>
        <Field label="Type" htmlFor="note-type">
          <select
            id="note-type"
            name="note_type"
            className={selectClass}
            defaultValue={note?.note_type ?? "meeting_note"}
          >
            <option value="meeting_note">Meeting note</option>
            <option value="agreement">Agreement</option>
            <option value="issue">Issue</option>
            <option value="reminder">Reminder</option>
            <option value="follow_up">Follow up</option>
            <option value="decision">Decision</option>
          </select>
        </Field>
      </div>

      <Field label="Note" htmlFor="note-body" required error={state.fieldErrors.body}>
        <textarea
          id="note-body"
          name="body"
          className={textareaClass}
          defaultValue={note?.body ?? ""}
          placeholder="Project note..."
          required
        />
      </Field>

      <div className="grid gap-4 md:grid-cols-[1fr_auto] md:items-end">
        <Field label="Noted at" htmlFor="noted-at" error={state.fieldErrors.noted_at}>
          <input
            id="noted-at"
            name="noted_at"
            type="datetime-local"
            className={inputClass}
            defaultValue={toDateTimeLocal(note?.noted_at)}
          />
        </Field>
        <div className="flex justify-end">
          <SubmitButton>{mode === "edit" ? "Save Note" : "Add Note"}</SubmitButton>
        </div>
      </div>
    </form>
  );
}
