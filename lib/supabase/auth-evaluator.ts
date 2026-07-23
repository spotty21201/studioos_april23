import { type SupabaseEnvMode } from "./env";
import { getFallbackViewerProfile } from "./fallback";
import type { ProfileRow } from "./view-contracts";

export type ServerAuthState = {
  authEnabled: boolean;
  isAuthenticated: boolean;
  canAccessWorkspace: boolean;
  userId: string | null;
  profile: ProfileRow | null;
  warning: string | null;
  mode: SupabaseEnvMode;
};

export function normalizeAuthWarning(message: string | null): string | null {
  if (!message) {
    return null;
  }

  if (
    message.includes("Auth session missing!") ||
    message.includes("Auth session or user missing")
  ) {
    return null;
  }

  if (message.includes("Could not find the table 'public.profiles' in the schema cache")) {
    return "Authenticated, but profile lookup is currently unavailable because the `profiles` table is missing from the Supabase schema cache.";
  }

  return message;
}

export function evaluateAuthStateParams(params: {
  mode: SupabaseEnvMode;
  user: { id: string; email?: string } | null;
  userError?: { message: string } | null;
  profile?: ProfileRow | null;
  profileError?: { message: string } | null;
}): ServerAuthState {
  const { mode, user, userError, profile, profileError } = params;

  if (mode === "allowed_local_preview") {
    return {
      authEnabled: false,
      isAuthenticated: false,
      canAccessWorkspace: true,
      userId: null,
      profile: getFallbackViewerProfile(),
      warning:
        "Supabase auth is not configured. Running in local development preview mode.",
      mode: "allowed_local_preview",
    };
  }

  if (mode === "production_config_error") {
    return {
      authEnabled: false,
      isAuthenticated: false,
      canAccessWorkspace: false,
      userId: null,
      profile: null,
      warning:
        "Supabase configuration is missing or invalid in this production environment. Workspace access is disabled.",
      mode: "production_config_error",
    };
  }

  // Configured Live mode
  if (userError || !user) {
    return {
      authEnabled: true,
      isAuthenticated: false,
      canAccessWorkspace: false,
      userId: null,
      profile: null,
      warning: userError ? normalizeAuthWarning(userError.message) : null,
      mode: "configured_live",
    };
  }

  if (profileError || !profile) {
    return {
      authEnabled: true,
      isAuthenticated: true,
      canAccessWorkspace: false,
      userId: user.id,
      profile: null,
      warning:
        "Your user account is authenticated, but no active workspace profile was found for your account.",
      mode: "configured_live",
    };
  }

  if (!profile.is_active) {
    return {
      authEnabled: true,
      isAuthenticated: true,
      canAccessWorkspace: false,
      userId: user.id,
      profile,
      warning: "Your user account is marked inactive. Workspace access is restricted.",
      mode: "configured_live",
    };
  }

  return {
    authEnabled: true,
    isAuthenticated: true,
    canAccessWorkspace: true,
    userId: user.id,
    profile,
    warning: null,
    mode: "configured_live",
  };
}
