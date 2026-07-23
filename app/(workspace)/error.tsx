"use client";

import Link from "next/link";
import { AlertCircle, RefreshCw, LayoutDashboard } from "lucide-react";

type WorkspaceErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function WorkspaceError({ reset }: WorkspaceErrorProps) {
  return (
    <div
      role="alert"
      className="flex min-h-[400px] flex-col items-center justify-center p-8 text-center"
    >
      <div className="panel-card max-w-lg rounded-[4px] bg-surface p-8 text-left">
        <div className="flex items-center gap-3">
          <AlertCircle className="h-6 w-6 text-critical shrink-0" />
          <h1 className="text-lg font-semibold text-text-primary">
            Unable to load workspace data
          </h1>
        </div>
        <p className="mt-3 text-sm leading-relaxed text-text-secondary">
          An unexpected issue occurred while accessing the workspace. Please try again or return to the main dashboard.
        </p>
        <div className="mt-6 flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={reset}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-[2px] border border-black bg-black px-5 text-sm font-medium text-white shadow-[4px_4px_0_0_rgba(0,0,0,0.08)] hover:bg-accent-strong focus:outline-none focus:ring-2 focus:ring-accent"
          >
            <RefreshCw className="h-4 w-4" />
            Try again.
          </button>
          <Link
            href="/dashboard"
            className="inline-flex h-11 items-center justify-center gap-2 rounded-[2px] border border-border bg-white px-5 text-sm font-medium text-text-primary hover:bg-surface-muted focus:outline-none focus:ring-2 focus:ring-accent"
          >
            <LayoutDashboard className="h-4 w-4" />
            Return to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
