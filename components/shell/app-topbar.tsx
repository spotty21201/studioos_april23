import { Avatar } from "@/components/ui/avatar";
import { SignOutButton } from "@/components/auth/sign-out-button";
import type { WorkspaceViewer } from "@/lib/studio-data";

type AppTopbarProps = {
  viewer: WorkspaceViewer;
};

export function AppTopbar({ viewer }: AppTopbarProps) {
  return (
    <header className="sticky top-0 z-40 border-b border-border-strong bg-white">
      <div className="flex h-[4.5rem] items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <div />

        <div className="flex items-center gap-3">
          <div className="hidden items-center gap-3 rounded-[2px] border border-border bg-surface px-2 py-1.5 sm:flex">
            <Avatar name={viewer.name} size="sm" />
            <div className="pr-2">
              <p className="text-sm font-medium text-text-primary">{viewer.name}</p>
              <p className="text-xs text-text-secondary">{viewer.title}</p>
            </div>
          </div>
          <SignOutButton variant="icon" />
        </div>
      </div>
    </header>
  );
}
