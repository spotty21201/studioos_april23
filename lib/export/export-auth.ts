import "server-only";

import { getServerAuthState } from "@/lib/supabase/auth";

/**
 * Returns a 401 Response if the current request is unauthenticated /
 * unauthorised to access the workspace. Returns null when the request
 * is allowed to proceed.
 *
 * Local preview (allowed_local_preview) still returns null so the dev
 * fallback viewer can pull exports without a Supabase session.
 */
export async function getExportDenialResponse(): Promise<Response | null> {
  const auth = await getServerAuthState();
  if (auth.canAccessWorkspace) {
    return null;
  }
  return new Response(
    JSON.stringify({ ok: false, error: "Sign in is required." }),
    { status: 401, headers: { "Content-Type": "application/json" } },
  );
}