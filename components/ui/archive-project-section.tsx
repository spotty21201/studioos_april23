"use client";

import { useState } from "react";

type ArchiveProjectSectionProps = {
  projectId: string;
  projectName: string;
};

export function ArchiveProjectSection({ projectId, projectName }: ArchiveProjectSectionProps) {
  const [showConfirm, setShowConfirm] = useState(false);
  const [confirmName, setConfirmName] = useState("");
  const [message, setMessage] = useState<{ type: "error" | "success"; text: string } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleArchive(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage(null);
    if (confirmName.trim().toLowerCase() !== projectName.trim().toLowerCase()) {
      setMessage({ type: "error", text: "The project name does not match. Please type it exactly as shown." });
      return;
    }
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/archive-project", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ project_id: projectId, confirm_project_name: confirmName }),
      });
      const result = await res.json();
      if (result.ok) {
        setMessage({ type: "success", text: "Project archived. It is now hidden from active work but its records are kept." });
        window.setTimeout(() => {
          window.location.href = "/projects";
        }, 1200);
      } else {
        setMessage({ type: "error", text: result.error ?? "Something went wrong." });
      }
    } catch {
      setMessage({ type: "error", text: "Network error. Please try again." });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="rounded-[8px] border border-border bg-white p-6">
      {!showConfirm ? (
        <>
          <h3 className="mb-2 text-sm font-semibold text-text-primary">Archive Project</h3>
          <p className="mb-4 text-sm leading-5 text-text-secondary">
            Archiving hides this project from active work and the dashboard. Nothing is permanently
            deleted — the project and its history can be restored later by an administrator.
          </p>
          <button
            type="button"
            onClick={() => setShowConfirm(true)}
            disabled={isSubmitting}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-[2px] border border-critical/60 bg-white px-4 text-sm font-medium text-critical hover:bg-critical-soft disabled:cursor-not-allowed disabled:opacity-50"
          >
            Archive this project
          </button>
        </>
      ) : (
        <form onSubmit={handleArchive} className="space-y-4">
          <h3 className="text-sm font-semibold text-text-primary">Confirm archiving</h3>
          <p className="leading-5 text-xs text-text-secondary">
            To confirm, type the project name below. This hides the project from active views but
            keeps all of its records for later review.
          </p>
          <label htmlFor="archive-confirm-name" className="block text-sm font-medium text-text-primary">
            Project name
          </label>
          <input
            id="archive-confirm-name"
            name="confirm_project_name"
            type="text"
            required
            value={confirmName}
            onChange={(e) => setConfirmName(e.target.value)}
            autoComplete="off"
            placeholder={`Type "${projectName}"`}
            className="h-11 w-full rounded-[2px] border border-border bg-white px-4 text-sm text-text-primary outline-none transition-colors placeholder:text-text-tertiary focus:border-border-strong focus:ring-2 focus:ring-border-muted"
          />
          {message && (
            <p
              role={message.type === "error" ? "alert" : "status"}
              className={`text-sm font-medium ${message.type === "error" ? "text-critical" : "text-success"}`}
            >
              {message.text}
            </p>
          )}
          <div className="flex gap-3">
            <button
              type="submit"
              disabled={isSubmitting || !confirmName.trim() || message?.type === "success"}
              className="inline-flex h-10 items-center justify-center rounded-[2px] border border-critical/60 bg-white px-4 text-sm font-medium text-critical hover:bg-critical-soft disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isSubmitting ? "Archiving..." : "Yes, archive this project"}
            </button>
            <button
              type="button"
              onClick={() => {
                setShowConfirm(false);
                setConfirmName("");
                setMessage(null);
              }}
              className="inline-flex h-10 items-center justify-center rounded-[2px] border border-border bg-white px-4 text-sm font-medium text-text-secondary hover:bg-surface-muted"
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
