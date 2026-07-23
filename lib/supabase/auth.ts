import "server-only";

import { cache } from "react";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getSupabaseEnvMode } from "@/lib/supabase/env";
import {
  evaluateAuthStateParams,
  normalizeAuthWarning,
  type ServerAuthState,
} from "@/lib/supabase/auth-evaluator";
import type { ProfileRow } from "@/lib/supabase/view-contracts";

export type { ServerAuthState };

export const getServerAuthState = cache(async (): Promise<ServerAuthState> => {
  const mode = getSupabaseEnvMode();

  if (mode === "allowed_local_preview" || mode === "production_config_error") {
    return evaluateAuthStateParams({ mode, user: null });
  }

  try {
    const supabase = await createSupabaseServerClient();
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return evaluateAuthStateParams({
        mode: "configured_live",
        user: null,
        userError,
      });
    }

    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("id, email, full_name, role, is_active, created_at, updated_at")
      .eq("id", user.id)
      .maybeSingle();

    return evaluateAuthStateParams({
      mode: "configured_live",
      user,
      profile: (profile as ProfileRow | null) ?? null,
      profileError,
    });
  } catch (error) {
    return {
      authEnabled: true,
      isAuthenticated: false,
      canAccessWorkspace: false,
      userId: null,
      profile: null,
      warning: normalizeAuthWarning(
        error instanceof Error ? error.message : "Unknown auth failure.",
      ),
      mode: "configured_live",
    };
  }
});
