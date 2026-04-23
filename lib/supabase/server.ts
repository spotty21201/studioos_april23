import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { getSupabaseEnv } from "@/lib/supabase/env";

export async function createSupabaseServerClient() {
  const env = getSupabaseEnv();

  if (!env) {
    throw new Error("Missing Supabase server environment variables.");
  }

  const cookieStore = await cookies();

  return createServerClient(env.url, env.anonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        // Server Components can read request cookies, but Next.js only allows
        // cookie mutation inside a Server Action or Route Handler. Supabase may
        // attempt to refresh session cookies during auth reads, so writes must
        // be ignored in plain render paths to avoid runtime failures.
        void cookiesToSet;
      },
    },
  });
}
