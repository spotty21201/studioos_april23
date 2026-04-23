import { Bell, Search, SlidersHorizontal } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import type { WorkspaceViewer } from "@/lib/studio-data";

type AppTopbarProps = {
  viewer: WorkspaceViewer;
};

export function AppTopbar({ viewer }: AppTopbarProps) {
  return (
    <header className="sticky top-0 z-40 border-b border-border-strong bg-white">
      <div className="flex h-[4.5rem] items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <div className="flex min-w-0 flex-1 items-center gap-3">
          <div className="relative hidden max-w-md flex-1 sm:block">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-text-tertiary" />
            <input
              aria-label="Search across AIM StudioOS"
              className="h-11 w-full rounded-[2px] border border-border bg-surface px-11 text-sm text-text-primary outline-none placeholder:text-text-tertiary focus:border-border-strong focus:ring-2 focus:ring-border-muted"
              placeholder="Search projects, documents, notes, or invoices..."
              type="search"
            />
          </div>
          <button className="inline-flex h-11 w-11 items-center justify-center rounded-[2px] border border-border bg-surface text-text-secondary hover:border-border-strong hover:text-text-primary sm:hidden">
            <Search className="h-4 w-4" />
          </button>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <button className="inline-flex h-11 w-11 items-center justify-center rounded-[2px] border border-border bg-surface text-text-secondary hover:border-border-strong hover:text-text-primary">
            <SlidersHorizontal className="h-4 w-4" />
          </button>
          <button className="inline-flex h-11 w-11 items-center justify-center rounded-[2px] border border-border bg-surface text-text-secondary hover:border-border-strong hover:text-text-primary">
            <Bell className="h-4 w-4" />
          </button>
          <div className="hidden items-center gap-3 rounded-[2px] border border-border bg-surface px-2 py-1.5 sm:flex">
            <Avatar name={viewer.name} size="sm" />
            <div className="pr-2">
              <p className="text-sm font-medium text-text-primary">{viewer.name}</p>
              <p className="text-xs text-text-secondary">{viewer.title}</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
