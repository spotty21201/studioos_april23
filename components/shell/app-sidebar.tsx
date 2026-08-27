"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight } from "lucide-react";
import { navigationItems } from "@/lib/navigation";
import { Avatar } from "@/components/ui/avatar";
import { SignOutButton } from "@/components/auth/sign-out-button";
import { NavigationPendingIndicator } from "@/components/shell/navigation-pending-indicator";
import type { WorkspaceViewer } from "@/lib/studio-data";

type AppSidebarProps = {
  studioName: string;
  subtitle: string;
  viewer: WorkspaceViewer;
};

export function AppSidebar({ studioName, subtitle, viewer }: AppSidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="hidden w-64 shrink-0 border-r border-border-strong bg-white px-4 py-6 lg:flex lg:flex-col">
      <div className="mb-6 px-2">
        <div className="text-[1.2rem] font-semibold tracking-[-0.05em] text-accent">
          {studioName} StudioOS
        </div>
        <p className="mt-1 max-w-[14rem] text-sm leading-6 text-text-secondary">
          {subtitle}
        </p>
      </div>

      <nav className="space-y-1.5">
        {navigationItems.map(({ href, label, icon: Icon }) => {
          const active =
            pathname === href || (href !== "/dashboard" && pathname.startsWith(href));

          return (
            <Link
              key={href}
              href={href}
              className={`group flex items-center justify-between rounded-[2px] px-4 py-2.5 ${
                active
                  ? "bg-black text-white"
                  : "text-text-secondary hover:bg-surface-muted hover:text-text-primary"
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className="h-4 w-4" strokeWidth={1.9} />
                <span className="text-sm font-medium">{label}</span>
              </div>
              <div className="flex items-center gap-2">
                <NavigationPendingIndicator label={label} />
                <ChevronRight
                  className={`h-4 w-4 transition-transform ${
                    active ? "translate-x-0 opacity-100" : "opacity-0 group-hover:opacity-60"
                  }`}
                  strokeWidth={1.9}
                />
              </div>
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto rounded-[4px] border border-border bg-surface-muted px-4 py-3">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Avatar name={viewer.name} />
            <div>
              <p className="text-sm font-medium text-text-primary">{viewer.name}</p>
              <p className="text-xs text-text-secondary">{viewer.title}</p>
            </div>
          </div>
        </div>
        <div className="mt-4 rounded-[2px] border border-border-muted bg-white px-3 py-2.5 text-xs leading-5 text-text-secondary">
          Focus on what your projects need today — risks, decisions, and follow-ups.
        </div>
        <div className="mt-3 pt-2 border-t border-border-muted">
          <SignOutButton variant="menu-item" />
        </div>
      </div>
    </aside>
  );
}
