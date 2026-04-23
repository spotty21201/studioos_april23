import { createBrowserClient } from "@supabase/ssr";
import { getSupabaseEnv } from "@/lib/supabase/env";

export function createSupabaseBrowserClient() {
  const env = getSupabaseEnv();

  if (!env) {
    throw new Error("Missing Supabase browser environment variables.");
  }

  return createBrowserClient(env.url, env.anonKey);
}
