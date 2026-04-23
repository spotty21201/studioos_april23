import { CheckCircle2, ShieldAlert } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { SectionPanel } from "@/components/ui/section-panel";
import { StatusBadge } from "@/components/ui/status-badge";
import { getSettingsPageData } from "@/lib/studio-data";
import { getServerAuthState } from "@/lib/supabase/auth";

export default async function SettingsPage() {
  const authState = await getServerAuthState();
  const settings = await getSettingsPageData({
    viewerRole: authState.profile?.role ?? null,
    viewerEmail: authState.profile?.email ?? null,
  });

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="System Foundation"
        title="Settings"
        description="Settings stays intentionally narrow in V1: studio defaults, integration readiness, and platform foundations."
      />

      <section className="grid gap-6 xl:grid-cols-2">
        <SectionPanel title="Studio Profile" description="Single-studio mode for AIM in V1.">
          <dl className="grid gap-5 sm:grid-cols-2">
            <div>
              <dt className="eyebrow">Studio</dt>
              <dd className="mt-2 text-sm font-medium text-text-primary">
                {settings.studioName}
              </dd>
            </div>
            <div>
              <dt className="eyebrow">Default Currency</dt>
              <dd className="mt-2 text-sm font-medium text-text-primary">
                {settings.defaultCurrency}
              </dd>
            </div>
            <div>
              <dt className="eyebrow">Timezone</dt>
              <dd className="mt-2 text-sm font-medium text-text-primary">
                {settings.timezone}
              </dd>
            </div>
            <div>
              <dt className="eyebrow">Viewer Role</dt>
              <dd className="mt-2 text-sm font-medium text-text-primary">
                {settings.viewerRole ?? "Preview mode"}
              </dd>
            </div>
            <div className="sm:col-span-2">
              <dt className="eyebrow">Viewer Email</dt>
              <dd className="mt-2 text-sm font-medium text-text-primary">
                {settings.viewerEmail ?? "Not available"}
              </dd>
            </div>
          </dl>
        </SectionPanel>

        <SectionPanel
          title="Integration Readiness"
          description="Current auth and data connectivity state."
        >
          <div className="space-y-4">
            <div className="flex items-start gap-4 rounded-[20px] border border-border/80 bg-white/75 px-4 py-4">
              {authState.authEnabled ? (
                <CheckCircle2 className="mt-1 h-5 w-5 text-success" />
              ) : (
                <ShieldAlert className="mt-1 h-5 w-5 text-warning" />
              )}
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <p className="text-sm font-semibold text-text-primary">
                    Supabase Environment
                  </p>
                  <StatusBadge
                    value={authState.authEnabled ? "connected" : "not_configured"}
                  />
                </div>
                <p className="text-sm leading-6 text-text-secondary">
                  Requires <code>NEXT_PUBLIC_SUPABASE_URL</code> and{" "}
                  <code>NEXT_PUBLIC_SUPABASE_ANON_KEY</code>. When available, the
                  workspace shell enforces Supabase session gating.
                </p>
              </div>
            </div>
          </div>
        </SectionPanel>
      </section>
    </div>
  );
}
