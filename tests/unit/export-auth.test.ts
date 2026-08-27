import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("@/lib/supabase/auth", () => ({
  getServerAuthState: vi.fn(),
}));

import { getServerAuthState } from "@/lib/supabase/auth";
import { getExportDenialResponse } from "@/lib/export/export-auth";

describe("export-auth — getExportDenialResponse", () => {
  beforeEach(() => {
    vi.mocked(getServerAuthState).mockReset();
  });

  it("returns null when canAccessWorkspace is true", async () => {
    vi.mocked(getServerAuthState).mockResolvedValue({
      authEnabled: true,
      isAuthenticated: true,
      canAccessWorkspace: true,
      userId: "user-123",
      profile: null,
      warning: null,
      mode: "configured_live",
    });

    const denied = await getExportDenialResponse();
    expect(denied).toBeNull();
  });

  it("returns null when local preview mode allows access", async () => {
    vi.mocked(getServerAuthState).mockResolvedValue({
      authEnabled: false,
      isAuthenticated: false,
      canAccessWorkspace: true,
      userId: null,
      profile: null,
      warning: null,
      mode: "allowed_local_preview",
    });

    const denied = await getExportDenialResponse();
    expect(denied).toBeNull();
  });

  it("returns a 401 JSON response when canAccessWorkspace is false", async () => {
    vi.mocked(getServerAuthState).mockResolvedValue({
      authEnabled: true,
      isAuthenticated: false,
      canAccessWorkspace: false,
      userId: null,
      profile: null,
      warning: null,
      mode: "configured_live",
    });

    const denied = await getExportDenialResponse();
    expect(denied).not.toBeNull();
    expect(denied!.status).toBe(401);
    expect(denied!.headers.get("Content-Type")).toBe("application/json");
    const body = await denied!.json();
    expect(body.ok).toBe(false);
    expect(typeof body.error).toBe("string");
  });
});