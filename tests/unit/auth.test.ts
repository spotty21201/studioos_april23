import { describe, it, expect } from "vitest";
import { evaluateAuthStateParams } from "../../lib/supabase/auth-evaluator";
import type { ProfileRow } from "../../lib/supabase/view-contracts";

describe("Production Auth & Authorization Evaluation (lib/supabase/auth-evaluator.ts)", () => {
  const activeProfile: ProfileRow = {
    id: "user-123",
    email: "user@example.com",
    full_name: "Active Principal",
    role: "principal",
    is_active: true,
    created_at: "2026-01-01T00:00:00Z",
    updated_at: "2026-01-01T00:00:00Z",
  };

  const inactiveProfile: ProfileRow = {
    ...activeProfile,
    is_active: false,
    full_name: "Inactive Team Member",
  };

  it("handles allowed_local_preview mode (dev without Supabase env)", () => {
    const state = evaluateAuthStateParams({
      mode: "allowed_local_preview",
      user: null,
    });

    expect(state.authEnabled).toBe(false);
    expect(state.isAuthenticated).toBe(false);
    expect(state.canAccessWorkspace).toBe(true);
    expect(state.mode).toBe("allowed_local_preview");
    expect(state.profile).not.toBeNull();
  });

  it("handles production_config_error mode (prod without Supabase env) by failing closed", () => {
    const state = evaluateAuthStateParams({
      mode: "production_config_error",
      user: null,
    });

    expect(state.authEnabled).toBe(false);
    expect(state.isAuthenticated).toBe(false);
    expect(state.canAccessWorkspace).toBe(false);
    expect(state.mode).toBe("production_config_error");
    expect(state.profile).toBeNull();
  });

  it("handles configured_live with no authenticated user", () => {
    const state = evaluateAuthStateParams({
      mode: "configured_live",
      user: null,
    });

    expect(state.authEnabled).toBe(true);
    expect(state.isAuthenticated).toBe(false);
    expect(state.canAccessWorkspace).toBe(false);
    expect(state.mode).toBe("configured_live");
    expect(state.profile).toBeNull();
  });

  it("handles configured_live with authentication lookup error", () => {
    const state = evaluateAuthStateParams({
      mode: "configured_live",
      user: null,
      userError: { message: "Invalid session token" },
    });

    expect(state.authEnabled).toBe(true);
    expect(state.isAuthenticated).toBe(false);
    expect(state.canAccessWorkspace).toBe(false);
    expect(state.warning).toBe("Invalid session token");
  });

  it("handles authenticated user with active profile -> grants workspace access", () => {
    const state = evaluateAuthStateParams({
      mode: "configured_live",
      user: { id: "user-123", email: "user@example.com" },
      profile: activeProfile,
    });

    expect(state.authEnabled).toBe(true);
    expect(state.isAuthenticated).toBe(true);
    expect(state.canAccessWorkspace).toBe(true);
    expect(state.userId).toBe("user-123");
    expect(state.profile?.is_active).toBe(true);
    expect(state.warning).toBeNull();
  });

  it("handles authenticated user with inactive profile -> restricts workspace access", () => {
    const state = evaluateAuthStateParams({
      mode: "configured_live",
      user: { id: "user-123", email: "user@example.com" },
      profile: inactiveProfile,
    });

    expect(state.authEnabled).toBe(true);
    expect(state.isAuthenticated).toBe(true);
    expect(state.canAccessWorkspace).toBe(false);
    expect(state.userId).toBe("user-123");
    expect(state.profile?.is_active).toBe(false);
    expect(state.warning).toContain("inactive");
  });

  it("handles authenticated user with missing profile -> fails closed", () => {
    const state = evaluateAuthStateParams({
      mode: "configured_live",
      user: { id: "user-999", email: "missing@example.com" },
      profile: null,
    });

    expect(state.authEnabled).toBe(true);
    expect(state.isAuthenticated).toBe(true);
    expect(state.canAccessWorkspace).toBe(false);
    expect(state.profile).toBeNull();
    expect(state.warning).toContain("no active workspace profile was found");
  });

  it("handles profile lookup error -> fails closed without synthesizing active profile", () => {
    const state = evaluateAuthStateParams({
      mode: "configured_live",
      user: { id: "user-123", email: "user@example.com" },
      profileError: { message: "Database connection failed" },
    });

    expect(state.authEnabled).toBe(true);
    expect(state.isAuthenticated).toBe(true);
    expect(state.canAccessWorkspace).toBe(false);
    expect(state.profile).toBeNull();
  });
});
