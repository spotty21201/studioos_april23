"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { navigationItems } from "@/lib/navigation";
import { SignOutButton } from "@/components/auth/sign-out-button";
import { NavigationPendingIndicator } from "@/components/shell/navigation-pending-indicator";

export function MobileNav() {
  const pathname = usePathname();

  return (
    <nav className="border-b border-border-strong bg-white px-4 py-3 lg:hidden">
      <div className="flex items-center gap-2 overflow-x-auto">
        {navigationItems.map(({ href, label }) => {
          const active =
            pathname === href || (href !== "/dashboard" && pathname.startsWith(href));

          return (
            <Link
              key={href}
              href={href}
              className={`whitespace-nowrap rounded-[2px] border px-4 py-2 text-sm ${
                active
                  ? "border-black bg-black text-white"
                  : "border-border-muted bg-surface-muted text-text-secondary"
              }`}
            >
              <span className="inline-flex items-center gap-2">
                {label}
                <NavigationPendingIndicator label={label} />
              </span>
            </Link>
          );
        })}
        <div className="ml-auto shrink-0">
          <SignOutButton
            className="whitespace-nowrap rounded-[2px] border border-critical bg-critical-soft px-3 py-2 text-xs font-medium text-critical hover:bg-critical hover:text-white"
          >
            Sign Out
          </SignOutButton>
        </div>
      </div>
    </nav>
  );
}
