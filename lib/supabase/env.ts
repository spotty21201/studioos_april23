export type SupabaseEnv = {
  url: string;
  anonKey: string;
};

const AIM_STUDIOOS_SUPABASE_URL = "https://tmkfhrnpmxghylccrexf.supabase.co";
const AIM_STUDIOOS_SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRta2Zocm5wbXhnaHlsY2NyZXhmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY4ODk0NDgsImV4cCI6MjA5MjQ2NTQ0OH0.Uo0TfpDbBQiYgOYRcqAD-ksgzChhpmdOBd6pp7aecyg";

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
  const url =
    cleanEnvValue(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      "NEXT_PUBLIC_SUPABASE_URL",
    ) ?? AIM_STUDIOOS_SUPABASE_URL;
  const anonKey =
    cleanEnvValue(
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      "NEXT_PUBLIC_SUPABASE_ANON_KEY",
    ) ?? AIM_STUDIOOS_SUPABASE_ANON_KEY;

  if (!url || !anonKey || !isValidHttpUrl(url)) {
    return null;
  }

  return { url, anonKey };
}

export function hasSupabaseEnv() {
  return getSupabaseEnv() !== null;
}
