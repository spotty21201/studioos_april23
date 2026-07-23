import { describe, it, expect } from "vitest";
import WorkspaceLoading from "../../app/(workspace)/loading";
import WorkspaceError from "../../app/(workspace)/error";

type VNode = {
  type?: unknown;
  props?: {
    role?: string;
    type?: string;
    onClick?: () => void;
    children?: unknown;
  };
};

function findElementBy(
  vnode: unknown,
  predicate: (node: VNode) => boolean,
): VNode | null {
  if (!vnode || typeof vnode !== "object") return null;
  const node = vnode as VNode;
  if (predicate(node)) return node;
  const props = node.props;
  if (props && props.children) {
    const children = Array.isArray(props.children)
      ? props.children
      : [props.children];
    for (const child of children) {
      const found = findElementBy(child, predicate);
      if (found) return found;
    }
  }
  return null;
}

describe("Workspace Loading & Error Components", () => {
  it("exports a valid WorkspaceLoading function component", () => {
    expect(typeof WorkspaceLoading).toBe("function");
    const vnode = WorkspaceLoading();
    expect(vnode.props.role).toBe("status");
  });

  it("exports a valid WorkspaceError function component with reset callback", () => {
    expect(typeof WorkspaceError).toBe("function");
    let resetCalled = false;
    const vnode = WorkspaceError({
      error: new Error("Test error"),
      reset: () => {
        resetCalled = true;
      },
    });

    expect(vnode.props.role).toBe("alert");

    // Stable element discovery avoiding hard-coded array index indexing
    const buttonNode = findElementBy(
      vnode,
      (node) => node.type === "button" && typeof node.props?.onClick === "function",
    );

    expect(buttonNode).not.toBeNull();
    expect(buttonNode?.props?.type).toBe("button");

    if (buttonNode?.props?.onClick) {
      buttonNode.props.onClick();
    }
    expect(resetCalled).toBe(true);
  });
});
