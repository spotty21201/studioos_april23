import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { getSupabaseEnv, getSupabaseEnvMode } from "../../lib/supabase/env";

describe("Environment & Configuration Parsing", () => {
  const originalEnv = { ...process.env };

  beforeEach(() => {
    delete process.env.NEXT_PUBLIC_SUPABASE_URL;
    delete process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  });

  afterEach(() => {
    process.env = { ...originalEnv };
  });

  it("returns null when Supabase env variables are missing", () => {
    expect(getSupabaseEnv()).toBeNull();
  });

  it("returns null when Supabase URL is invalid", () => {
    process.env.NEXT_PUBLIC_SUPABASE_URL = "not-a-valid-url";
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSJ9.signature";
    expect(getSupabaseEnv()).toBeNull();
  });

  it("returns valid config when proper environment variables are provided", () => {
    process.env.NEXT_PUBLIC_SUPABASE_URL = "https://example.supabase.co";
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSJ9.signature";

    const env = getSupabaseEnv();
    expect(env).not.toBeNull();
    expect(env?.url).toBe("https://example.supabase.co");
  });

  it("identifies allowed_local_preview mode in development without env", () => {
    Object.defineProperty(process.env, "NODE_ENV", { value: "development", configurable: true });
    expect(getSupabaseEnvMode()).toBe("allowed_local_preview");
  });

  it("identifies production_config_error mode in production without env", () => {
    Object.defineProperty(process.env, "NODE_ENV", { value: "production", configurable: true });
    expect(getSupabaseEnvMode()).toBe("production_config_error");
  });

  it("identifies configured_live mode when valid env is present", () => {
    process.env.NEXT_PUBLIC_SUPABASE_URL = "https://example.supabase.co";
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSJ9.signature";
    expect(getSupabaseEnvMode()).toBe("configured_live");
  });
});
