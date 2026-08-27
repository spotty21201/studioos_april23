"use client";

import { useState } from "react";
import { useActionState } from "react";
import { deleteProjectNoteAction } from "@/app/(workspace)/actions";

type DeleteProjectNoteButtonProps = {
  projectId: string;
  noteId: string;
  returnTab?: string;
};

export function DeleteProjectNoteButton({
  projectId,
  noteId,
  returnTab,
}: DeleteProjectNoteButtonProps) {
  const [armed, setArmed] = useState(false);
  const [state, formAction] = useActionState(deleteProjectNoteAction, {
    message: null,
    fieldErrors: {},
  });

  if (!armed) {
    return (
      <button
        type="button"
        onClick={() => setArmed(true)}
        className="inline-flex h-9 items-center justify-center rounded-[2px] border border-border bg-white px-3 text-xs font-medium text-text-secondary hover:bg-surface-muted hover:text-critical"
      >
        Delete
      </button>
    );
  }

  return (
    <form action={formAction} className="flex flex-col items-end gap-1">
      <input type="hidden" name="project_id" value={projectId} />
      <input type="hidden" name="note_id" value={noteId} />
      {returnTab ? <input type="hidden" name="return_tab" value={returnTab} /> : null}
      <div className="flex items-center gap-2">
        <button
          type="submit"
          className="inline-flex h-9 items-center justify-center rounded-[2px] border border-critical/60 bg-white px-3 text-xs font-medium text-critical hover:bg-critical-soft"
        >
          Confirm delete
        </button>
        <button
          type="button"
          onClick={() => setArmed(false)}
          className="inline-flex h-9 items-center justify-center rounded-[2px] border border-border bg-white px-3 text-xs font-medium text-text-secondary hover:bg-surface-muted"
        >
          Cancel
        </button>
      </div>
      {state.message ? (
        <p
          role="alert"
          className="text-xs font-medium text-critical"
        >
          {state.message}
        </p>
      ) : null}
    </form>
  );
}