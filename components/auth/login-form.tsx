"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { startTransition, useState } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";

type LoginFormProps = {
  authEnabled: boolean;
};

export function LoginForm({ authEnabled }: LoginFormProps) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!authEnabled) {
      return;
    }

    setIsPending(true);
    setErrorMessage(null);

    try {
      const supabase = createSupabaseBrowserClient();
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setErrorMessage(error.message);
        setIsPending(false);
        return;
      }

      startTransition(() => {
        router.replace("/dashboard");
        router.refresh();
      });
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Unable to sign in right now.",
      );
      setIsPending(false);
    }
  }

  return (
    <form className="space-y-5" onSubmit={handleSubmit}>
      <div className="space-y-2">
        <label
          className="text-sm font-medium text-text-primary"
          htmlFor="login-email"
        >
          Email
        </label>
        <input
          id="login-email"
          type="email"
          autoComplete="email"
          value={email}
          disabled={!authEnabled || isPending}
          onChange={(event) => setEmail(event.target.value)}
          className="h-12 w-full rounded-[2px] border border-border bg-white px-4 text-sm text-text-primary outline-none placeholder:text-text-tertiary focus:border-border-strong focus:ring-2 focus:ring-border-muted disabled:cursor-not-allowed disabled:bg-surface-muted"
          placeholder="ria@alami-group.com"
          required
        />
      </div>

      <div className="space-y-2">
        <label
          className="text-sm font-medium text-text-primary"
          htmlFor="login-password"
        >
          Password
        </label>
        <input
          id="login-password"
          type="password"
          autoComplete="current-password"
          value={password}
          disabled={!authEnabled || isPending}
          onChange={(event) => setPassword(event.target.value)}
          className="h-12 w-full rounded-[2px] border border-border bg-white px-4 text-sm text-text-primary outline-none placeholder:text-text-tertiary focus:border-border-strong focus:ring-2 focus:ring-border-muted disabled:cursor-not-allowed disabled:bg-surface-muted"
          placeholder="Enter your password"
          required
        />
      </div>

      {errorMessage ? (
        <div className="rounded-[4px] border border-critical bg-critical-soft px-4 py-3 text-sm text-critical">
          {errorMessage}
        </div>
      ) : null}

      <button
        type="submit"
        disabled={!authEnabled || isPending}
        className="inline-flex h-12 w-full items-center justify-center rounded-[2px] border border-black bg-black px-4 text-sm font-medium text-white shadow-[4px_4px_0_0_rgba(0,0,0,0.08)] hover:bg-accent-strong disabled:cursor-not-allowed disabled:border-text-tertiary disabled:bg-text-tertiary"
      >
        {isPending ? "Signing in..." : "Sign In"}
      </button>

      {!authEnabled ? (
        <div className="rounded-[4px] border border-border bg-surface-muted px-4 py-4 text-sm leading-6 text-text-secondary">
          This environment is currently running without Supabase authentication. You can
          still review the interface in read-only preview.
          <div className="mt-3">
            <Link
              href="/dashboard"
              className="inline-flex items-center rounded-[2px] border border-black bg-white px-4 py-2 text-sm font-medium text-black hover:bg-surface-muted"
            >
              Open Read-Only Preview
            </Link>
          </div>
        </div>
      ) : null}
    </form>
  );
}
