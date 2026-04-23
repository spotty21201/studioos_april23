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
      <div className="grid w-full overflow-hidden rounded-[8px] border border-border bg-white shadow-[var(--shadow-soft)] xl:grid-cols-[1.05fr_0.95fr]">
        <section className="border-b border-border bg-surface-muted px-7 py-8 xl:border-b-0 xl:border-r xl:px-10 xl:py-10">
          <div className="inline-flex items-center gap-2 rounded-[2px] border border-border bg-white px-4 py-2 text-[11px] font-medium uppercase tracking-[0.14em] text-text-secondary">
            AIM StudioOS
          </div>
          <h1 className="mt-6 max-w-xl text-[2.8rem] font-semibold leading-[1.02] tracking-[-0.06em] text-text-primary">
            Operating System for AIM Studios.
          </h1>
          <p className="mt-5 max-w-xl text-[15px] leading-7 text-text-secondary">
            StudioOS will enhance your experience managing and monitoring your AIM projects and time.
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <div className="rounded-[4px] border border-border bg-white px-5 py-5">
              <Compass className="h-5 w-5 text-accent" />
              <p className="mt-4 text-sm font-semibold text-text-primary">
                Dashboard first
              </p>
              <p className="mt-2 text-sm leading-6 text-text-secondary">
                Overview and drill-down AIM Projects and Resources.
              </p>
            </div>
            <div className="rounded-[4px] border border-border bg-white px-5 py-5">
              <ShieldCheck className="h-5 w-5 text-accent" />
              <p className="mt-4 text-sm font-semibold text-text-primary">
                Managing Studio and Resources
              </p>
              <p className="mt-2 text-sm leading-6 text-text-secondary">
                Workspace for our teams, clients projects.
              </p>
            </div>
          </div>
        </section>

        <section className="flex items-center px-7 py-8 xl:px-10 xl:py-10">
          <div className="mx-auto w-full max-w-md">
            <p className="eyebrow">Sign in</p>
            <h2 className="mt-4 text-[2rem] font-semibold tracking-[-0.05em] text-text-primary">
              AIM Studio OS.
            </h2>
            <p className="mt-3 text-[15px] leading-7 text-text-secondary">
              Sign in with your alami-group.com email address.
            </p>

            <div className="mt-8 rounded-[4px] border border-border bg-surface-muted px-5 py-5">
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
