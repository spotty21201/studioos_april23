"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight } from "lucide-react";
import { navigationItems } from "@/lib/navigation";
import { Avatar } from "@/components/ui/avatar";
import type { WorkspaceViewer } from "@/lib/studio-data";

type AppSidebarProps = {
  studioName: string;
  subtitle: string;
  viewer: WorkspaceViewer;
};

export function AppSidebar({ studioName, subtitle, viewer }: AppSidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="hidden w-72 shrink-0 border-r border-border/80 bg-white/80 px-5 py-6 backdrop-blur-xl lg:flex lg:flex-col">
      <div className="mb-10 px-2">
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
              className={`group flex items-center justify-between rounded-2xl px-4 py-3 ${
                active
                  ? "bg-accent text-white shadow-[0_14px_28px_rgba(23,56,76,0.14)]"
                  : "text-text-secondary hover:bg-surface-muted hover:text-text-primary"
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className="h-4 w-4" strokeWidth={1.9} />
                <span className="text-sm font-medium">{label}</span>
              </div>
              <ChevronRight
                className={`h-4 w-4 transition-transform ${
                  active ? "translate-x-0 opacity-100" : "opacity-0 group-hover:opacity-60"
                }`}
                strokeWidth={1.9}
              />
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto rounded-[24px] border border-border/80 bg-surface-muted px-4 py-4">
        <div className="flex items-center gap-3">
          <Avatar name={viewer.name} />
          <div>
            <p className="text-sm font-medium text-text-primary">{viewer.name}</p>
            <p className="text-xs text-text-secondary">{viewer.title}</p>
          </div>
        </div>
        <div className="mt-4 rounded-2xl bg-white/70 px-3 py-2.5 text-xs leading-5 text-text-secondary">
          Principal overview mode is active. Surfaces prioritize visibility,
          exceptions, and briefing-level clarity.
        </div>
      </div>
    </aside>
  );
}
