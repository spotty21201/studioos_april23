"use client";

import { useActionState, useState } from "react";
import { restoreProjectAction } from "@/app/(workspace)/actions";

type RestoreProjectButtonProps = {
  projectId: string;
};

export function RestoreProjectButton({ projectId }: RestoreProjectButtonProps) {
  const [armed, setArmed] = useState(false);
  const [state, formAction] = useActionState(restoreProjectAction, {
    message: null,
    fieldErrors: {},
  });

  if (!armed) {
    return (
      <button
        type="button"
        onClick={() => setArmed(true)}
        className="inline-flex h-9 items-center justify-center rounded-[2px] border border-black bg-white px-3 text-xs font-medium text-text-primary hover:bg-surface-muted"
      >
        Restore
      </button>
    );
  }

  return (
    <form action={formAction} className="flex flex-col items-end gap-1">
      <input type="hidden" name="project_id" value={projectId} />
      <div className="flex items-center gap-2">
        <button
          type="submit"
          className="inline-flex h-9 items-center justify-center rounded-[2px] border border-black bg-black px-3 text-xs font-medium text-white hover:bg-accent-strong"
        >
          Confirm restore
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
        <p role="alert" className="text-xs font-medium text-critical">
          {state.message}
        </p>
      ) : null}
    </form>
  );
}