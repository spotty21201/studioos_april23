"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { navigationItems } from "@/lib/navigation";

export function MobileNav() {
  const pathname = usePathname();

  return (
    <nav className="border-b border-border/80 bg-white/70 px-4 py-3 backdrop-blur-xl lg:hidden">
      <div className="flex gap-2 overflow-x-auto">
        {navigationItems.map(({ href, label }) => {
          const active =
            pathname === href || (href !== "/dashboard" && pathname.startsWith(href));

          return (
            <Link
              key={href}
              href={href}
              className={`whitespace-nowrap rounded-full px-4 py-2 text-sm ${
                active
                  ? "bg-accent text-white"
                  : "bg-surface-muted text-text-secondary"
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
