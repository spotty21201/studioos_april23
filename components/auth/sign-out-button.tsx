"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { LogOut, AlertCircle } from "lucide-react";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";
import { handleSignOutResult } from "@/lib/auth/sign-out-handler";

type SignOutButtonProps = {
  className?: string;
  variant?: "button" | "menu-item" | "icon";
  children?: React.ReactNode;
};

export function SignOutButton({
  className,
  variant = "button",
  children,
}: SignOutButtonProps) {
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function handleSignOut() {
    if (isPending) return;
    setIsPending(true);
    setErrorMessage(null);

    try {
      const supabase = createSupabaseBrowserClient();
      const res = await supabase.auth.signOut();
      const outcome = handleSignOutResult(res);

      if (!outcome.success) {
        setErrorMessage(outcome.errorMessage);
        setIsPending(false);
        return;
      }

      router.replace("/login");
      router.refresh();
    } catch {
      setErrorMessage("Unable to sign out right now. Please try again.");
      setIsPending(false);
    }
  }

  return (
    <div className="inline-flex flex-col items-start gap-1">
      {errorMessage ? (
        <div
          role="alert"
          className="flex items-center gap-1.5 text-xs text-critical bg-critical-soft px-2 py-1 rounded-[2px]"
        >
          <AlertCircle className="h-3.5 w-3.5 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      ) : null}

      {variant === "icon" ? (
        <button
          type="button"
          onClick={handleSignOut}
          disabled={isPending}
          aria-label="Sign Out"
          title="Sign Out"
          className={
            className ??
            "inline-flex h-11 w-11 items-center justify-center rounded-[2px] border border-border bg-surface text-text-secondary hover:border-border-strong hover:text-text-primary disabled:opacity-50"
          }
        >
          <LogOut className="h-4 w-4" />
        </button>
      ) : variant === "menu-item" ? (
        <button
          type="button"
          onClick={handleSignOut}
          disabled={isPending}
          className={
            className ??
            "flex w-full items-center gap-2 text-xs font-medium text-critical hover:underline disabled:opacity-50"
          }
        >
          <LogOut className="h-3.5 w-3.5" />
          {children ?? (isPending ? "Signing out..." : "Sign Out")}
        </button>
      ) : (
        <button
          type="button"
          onClick={handleSignOut}
          disabled={isPending}
          className={
            className ??
            "inline-flex h-10 items-center justify-center gap-2 rounded-[2px] border border-border bg-white px-4 text-sm font-medium text-text-primary shadow-sm hover:border-border-strong hover:bg-surface-muted disabled:opacity-50"
          }
        >
          <LogOut className="h-4 w-4" />
          {children ?? (isPending ? "Signing out..." : "Sign Out")}
        </button>
      )}
    </div>
  );
}
