import { redirect } from "next/navigation";
import { Compass, ShieldCheck } from "lucide-react";
import { LoginForm } from "@/components/auth/login-form";
import { DataSourceNotice } from "@/components/ui/data-source-notice";
import { getServerAuthState } from "@/lib/supabase/auth";

export const dynamic = "force-dynamic";

export default async function LoginPage() {
  const authState = await getServerAuthState();

  if (authState.authEnabled && authState.isAuthenticated) {
    redirect("/dashboard");
  }

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-[1240px] items-center px-5 py-10 sm:px-6 lg:px-8">
      <div className="grid w-full overflow-hidden rounded-[30px] border border-border/80 bg-white/80 shadow-[var(--shadow-soft)] backdrop-blur xl:grid-cols-[1.05fr_0.95fr]">
        <section className="border-b border-border/80 bg-surface-muted px-7 py-8 xl:border-b-0 xl:border-r xl:px-10 xl:py-10">
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-white/80 px-4 py-2 text-[11px] font-medium uppercase tracking-[0.14em] text-text-secondary">
            AIM StudioOS
          </div>
          <h1 className="mt-6 max-w-xl text-[2.8rem] font-semibold leading-[1.02] tracking-[-0.06em] text-text-primary">
            Calm operating visibility for studio leadership.
          </h1>
          <p className="mt-5 max-w-xl text-[15px] leading-7 text-text-secondary">
            V1 is a Principal-facing internal platform for project oversight,
            finance summaries, vendor obligations, documents, notes, and recent
            activity. It is not a workflow-heavy ERP.
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <div className="rounded-[24px] border border-border/80 bg-white/75 px-5 py-5">
              <Compass className="h-5 w-5 text-accent" />
              <p className="mt-4 text-sm font-semibold text-text-primary">
                Dashboard first
              </p>
              <p className="mt-2 text-sm leading-6 text-text-secondary">
                Overview and drill-down come before admin complexity.
              </p>
            </div>
            <div className="rounded-[24px] border border-border/80 bg-white/75 px-5 py-5">
              <ShieldCheck className="h-5 w-5 text-accent" />
              <p className="mt-4 text-sm font-semibold text-text-primary">
                Session-gated workspace
              </p>
              <p className="mt-2 text-sm leading-6 text-text-secondary">
                Workspace routes now honor Supabase session state when auth is configured.
              </p>
            </div>
          </div>
        </section>

        <section className="flex items-center px-7 py-8 xl:px-10 xl:py-10">
          <div className="mx-auto w-full max-w-md">
            <p className="eyebrow">Sign in</p>
            <h2 className="mt-4 text-[2rem] font-semibold tracking-[-0.05em] text-text-primary">
              Access AIM StudioOS
            </h2>
            <p className="mt-3 text-[15px] leading-7 text-text-secondary">
              Sign in with the current Supabase project. If this environment is not
              configured yet, read-only preview access is available below.
            </p>

            <div className="mt-8 rounded-[24px] border border-border/80 bg-surface-muted px-5 py-5">
              <p className="text-sm font-semibold text-text-primary">
                Connection status
              </p>
              <p className="mt-2 text-sm leading-6 text-text-secondary">
                {authState.authEnabled
                  ? "Authentication is configured and ready for sign-in."
                  : "Authentication is not configured in this environment."}
              </p>
            </div>

            {authState.authEnabled && authState.warning ? (
              <div className="mt-8">
                <DataSourceNotice
                  title="Authentication notice"
                  message={authState.warning}
                />
              </div>
            ) : null}

            <div className="mt-8">
              <LoginForm authEnabled={authState.authEnabled} />
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
