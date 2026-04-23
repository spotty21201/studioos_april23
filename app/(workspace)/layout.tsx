import { redirect } from "next/navigation";
import { AppSidebar } from "@/components/shell/app-sidebar";
import { AppTopbar } from "@/components/shell/app-topbar";
import { MobileNav } from "@/components/shell/mobile-nav";
import { DataSourceNotice } from "@/components/ui/data-source-notice";
import { getWorkspaceShellData } from "@/lib/studio-data";
import { getServerAuthState } from "@/lib/supabase/auth";

export default async function WorkspaceLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const authState = await getServerAuthState();

  if (authState.authEnabled && !authState.isAuthenticated) {
    redirect("/login");
  }

  const shell = await getWorkspaceShellData(authState.profile);
  const noticeMessage = authState.warning ?? shell.meta.warning;

  return (
    <div className="min-h-screen lg:flex">
      <AppSidebar
        studioName={shell.studioName}
        subtitle={shell.subtitle}
        viewer={shell.viewer}
      />
      <div className="min-w-0 flex-1">
        <AppTopbar viewer={shell.viewer} />
        <MobileNav />
        <main className="mx-auto w-full max-w-[1440px] px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
          {noticeMessage ? (
            <div className="mb-6">
              <DataSourceNotice
                title="Workspace data notice"
                message={noticeMessage}
              />
            </div>
          ) : null}
          {children}
        </main>
      </div>
    </div>
  );
}
