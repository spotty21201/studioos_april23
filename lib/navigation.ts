import type { LucideIcon } from "lucide-react";
import {
  Files,
  FolderKanban,
  LayoutDashboard,
  ReceiptText,
  Settings,
  ScrollText,
} from "lucide-react";

export type NavigationItem = {
  label: string;
  href: string;
  icon: LucideIcon;
};

export const navigationItems: NavigationItem[] = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Projects", href: "/projects", icon: FolderKanban },
  { label: "Finance", href: "/finance", icon: ReceiptText },
  { label: "Documents", href: "/documents", icon: Files },
  { label: "Notes & Activity", href: "/activity", icon: ScrollText },
  { label: "Settings", href: "/settings", icon: Settings },
];
