"use client";

import { useLinkStatus } from "next/link";
import { Loader2 } from "lucide-react";

export function NavigationPendingIndicator({ label }: { label: string }) {
  const { pending } = useLinkStatus();

  if (!pending) {
    return null;
  }

  return (
    <span role="status" aria-live="polite" className="inline-flex items-center">
      <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
      <span className="sr-only">Loading {label}…</span>
    </span>
  );
}
