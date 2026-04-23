"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { navigationItems } from "@/lib/navigation";

export function MobileNav() {
  const pathname = usePathname();

  return (
    <nav className="border-b border-border-strong bg-white px-4 py-3 lg:hidden">
      <div className="flex gap-2 overflow-x-auto">
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
              {label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
