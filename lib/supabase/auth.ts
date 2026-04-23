import "server-only";

import { cache } from "react";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getSupabaseEnv } from "@/lib/supabase/env";
import { getFallbackViewerProfile } from "@/lib/supabase/fallback";
import type { ProfileRow } from "@/lib/supabase/view-contracts";

export type ServerAuthState = {
  authEnabled: boolean;
  isAuthenticated: boolean;
  userId: string | null;
  profile: ProfileRow | null;
  warning: string | null;
};

function normalizeAuthWarning(message: string | null): string | null {
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
    return "Authenticated, but profile lookup is currently unavailable because the `profiles` table is missing from the Supabase schema cache. The workspace is using derived viewer details until backend cache support is restored.";
  }

  return message;
}

function deriveFullName(email: string | null, fullName: string | undefined) {
  if (fullName && fullName.trim().length > 0) {
    return fullName;
  }

  if (!email) {
    return "AIM User";
  }

  const prefix = email.split("@")[0] ?? "AIM User";
  return prefix
    .split(/[._-]/g)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export const getServerAuthState = cache(async (): Promise<ServerAuthState> => {
  const env = getSupabaseEnv();

  if (!env) {
    return {
      authEnabled: false,
      isAuthenticated: false,
      userId: null,
      profile: getFallbackViewerProfile(),
      warning:
        "Supabase auth is not configured. Workspace access falls back to preview mode.",
    };
  }

  try {
    const supabase = await createSupabaseServerClient();
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error) {
      return {
        authEnabled: true,
        isAuthenticated: false,
        userId: null,
        profile: null,
        warning: normalizeAuthWarning(error.message),
      };
    }

    if (!user) {
      return {
        authEnabled: true,
        isAuthenticated: false,
        userId: null,
        profile: null,
        warning: null,
      };
    }

    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("id, email, full_name, role, is_active, created_at, updated_at")
      .eq("id", user.id)
      .maybeSingle();

    if (profileError) {
      return {
        authEnabled: true,
        isAuthenticated: true,
        userId: user.id,
        profile: {
          id: user.id,
          email: user.email ?? "",
          full_name: deriveFullName(
            user.email ?? null,
            user.user_metadata.full_name as string | undefined,
          ),
          role: "team_member",
          is_active: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
        warning: normalizeAuthWarning(profileError.message),
      };
    }

    return {
      authEnabled: true,
      isAuthenticated: true,
      userId: user.id,
      profile: (profile as ProfileRow | null) ?? null,
      warning: null,
    };
  } catch (error) {
    return {
      authEnabled: true,
      isAuthenticated: false,
      userId: null,
      profile: null,
      warning: normalizeAuthWarning(
        error instanceof Error ? error.message : "Unknown auth failure.",
      ),
    };
  }
});
