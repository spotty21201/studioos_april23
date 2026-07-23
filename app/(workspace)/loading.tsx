import { Loader2 } from "lucide-react";

export default function WorkspaceLoading() {
  return (
    <div
      role="status"
      aria-live="polite"
      className="flex min-h-[400px] flex-col items-center justify-center p-8 text-center"
    >
      <div className="panel-card flex max-w-md flex-col items-center rounded-[4px] px-8 py-10">
        <Loader2 className="h-8 w-8 animate-spin text-text-muted" />
        <h2 className="mt-4 text-base font-medium text-text-primary">
          Loading workspace…
        </h2>
        <p className="mt-1 text-sm text-text-secondary">
          Fetching current studio data and operational overview.
        </p>
      </div>
    </div>
  );
}
