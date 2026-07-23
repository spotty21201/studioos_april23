import { describe, it, expect } from "vitest";
import { handleSignOutResult } from "../../lib/auth/sign-out-handler";

describe("Production Sign Out Failure Handling (lib/auth/sign-out-handler.ts)", () => {
  it("returns success: true when error is null", () => {
    const outcome = handleSignOutResult({ error: null });
    expect(outcome.success).toBe(true);
    expect(outcome.errorMessage).toBeNull();
  });

  it("returns recoverable calm error message when sign-out returns an error", () => {
    const outcome = handleSignOutResult({
      error: { message: "Network connection lost" },
    });
    expect(outcome.success).toBe(false);
    expect(outcome.errorMessage).toBe("Unable to sign out right now. Please try again.");
  });
});
