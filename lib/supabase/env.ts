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

export function getSupabaseEnv(): SupabaseEnv | null {
  const url = cleanEnvValue(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    "NEXT_PUBLIC_SUPABASE_URL",
  );
  const anonKey = cleanEnvValue(
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    "NEXT_PUBLIC_SUPABASE_ANON_KEY",
  );

  if (!url || !anonKey || !isValidHttpUrl(url)) {
    return null;
  }

  return { url, anonKey };
}

export function hasSupabaseEnv() {
  return getSupabaseEnv() !== null;
}
