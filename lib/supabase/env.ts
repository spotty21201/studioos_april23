export type SupabaseEnv = {
  url: string;
  anonKey: string;
};


function cleanEnvValue(value: string | undefined, key: string) {
  if (!value) {
    return null;
  }

  let cleaned = value.trim();

  if (
    (cleaned.startsWith('"') && cleaned.endsWith('"')) ||
    (cleaned.startsWith("'") && cleaned.endsWith("'"))
  ) {
    cleaned = cleaned.slice(1, -1).trim();
  }

  if (cleaned.startsWith(`${key}=`)) {
    cleaned = cleaned.slice(key.length + 1).trim();
  }

  return cleaned.length > 0 ? cleaned : null;
}

function isValidHttpUrl(value: string) {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

function decodeJwtPayload(value: string): Record<string, unknown> | null {
  const parts = value.split(".");
  if (parts.length !== 3) {
    return null;
  }
  try {
    let b64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
    while (b64.length % 4 !== 0) {
      b64 += "=";
    }
    const decoded = atob(b64);
    return JSON.parse(decoded) as Record<string, unknown>;
  } catch {
    return null;
  }
}

// Supabase publishes two generations of client-side ("publishable") keys:
//   - Legacy JWT anon key: `eyJ...` (three dot-separated segments)
//   - New publishable key:  `sb_publishable_<token>`
// The server/secret equivalents are `sb_secret_<token>` and the legacy
// `service_role` JWT, both of which must never be used as the anon key.
function isLikelySupabaseAnonKey(value: string) {
  if (value.startsWith("sb_publishable_")) {
    // New publishable key format. Reject obvious non-publishable prefixes
    // that a misconfigured secret/service-role/PAT value could slip in as.
    const token = value.slice("sb_publishable_".length);
    if (token.length === 0 || token.includes(" ") || token.includes("=")) {
      return false;
    }
    return true;
  }

  if (value.startsWith("sb_")) {
    // Any other `sb_...` key (e.g. `sb_secret_...`) is a secret,
    // service-role, or admin credential that must never be used as the
    // public anon key.
    return false;
  }

  const parts = value.split(".");

  if (
    parts.length !== 3 ||
    !value.startsWith("eyJ") ||
    parts.some((part) => part.length === 0)
  ) {
    return false;
  }

  // Reject service-role keys, personal access tokens, and other non-anon
  // credentials that must never be used as the public anon key.
  const payload = decodeJwtPayload(value);
  if (!payload) {
    return false;
  }

  const role = payload.role;
  if (typeof role === "string" && role !== "anon" && role !== "authenticated") {
    return false;
  }

  // Supabase personal access tokens carry a `scope` claim and/or an
  // access-token issuer; the anon key has neither.
  if (typeof payload.scope === "string" && payload.scope.length > 0) {
    return false;
  }
  if (
    typeof payload.iss === "string" &&
    payload.iss.toLowerCase().includes("access-token")
  ) {
    return false;
  }

  return true;
}

export function getSupabaseEnv(): SupabaseEnv | null {
  const url = cleanEnvValue(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    "NEXT_PUBLIC_SUPABASE_URL",
  );
  const anonKey = cleanEnvValue(
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    "NEXT_PUBLIC_SUPABASE_ANON_KEY",
  );

  if (!url || !isValidHttpUrl(url)) {
    return null;
  }

  if (!anonKey || !isLikelySupabaseAnonKey(anonKey)) {
    return null;
  }

  return { url, anonKey };
}

export function hasSupabaseEnv(): boolean {
  return getSupabaseEnv() !== null;
}

export type SupabaseEnvMode =
  | "configured_live"
  | "allowed_local_preview"
  | "production_config_error";

export function getSupabaseEnvMode(): SupabaseEnvMode {
  if (hasSupabaseEnv()) {
    return "configured_live";
  }
  if (process.env.NODE_ENV === "development") {
    return "allowed_local_preview";
  }
  return "production_config_error";
}
