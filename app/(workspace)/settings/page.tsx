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
        eyebrow="Settings"
        title="Settings"
        description="Manage your studio details and workspace connection."
      />

      <section className="grid gap-6 xl:grid-cols-2">
        <SectionPanel title="Your Studio" description="This workspace is set up for one studio.">
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
          title="Workspace Connection"
          description="Connection status for your studio workspace."
        >
          <div className="space-y-4">
            <div className="flex items-start gap-4 rounded-[4px] border border-border bg-white px-4 py-4">
              {authState.authEnabled ? (
                <CheckCircle2 className="mt-1 h-5 w-5 text-success" />
              ) : (
                <ShieldAlert className="mt-1 h-5 w-5 text-warning" />
              )}
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <p className="text-sm font-semibold text-text-primary">
                    Studio Workspace
                  </p>
                  <StatusBadge
                    value={authState.authEnabled ? "connected" : "not_configured"}
                  />
                </div>
                <p className="text-sm leading-6 text-text-secondary">
                  {authState.authEnabled
                    ? "This workspace is connected to your studio data source."
                    : "The workspace is in preview mode. Connect a data source to unlock full functionality."}
                </p>
              </div>
            </div>
          </div>
        </SectionPanel>
      </section>
    </div>
  );
}
