import { describe, expect, it, vi } from "vitest";

vi.mock("next/link", () => ({
  useLinkStatus: () => ({ pending: true }),
}));

import { NavigationPendingIndicator } from "../../components/shell/navigation-pending-indicator";

describe("workspace navigation feedback", () => {
  it("announces an in-progress route transition", () => {
    const vnode = NavigationPendingIndicator({ label: "Dashboard" });

    expect(vnode?.props.role).toBe("status");
    expect(vnode?.props["aria-live"]).toBe("polite");
  });
});
