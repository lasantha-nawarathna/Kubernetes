"use client";

import type { ReactNode } from "react";
import { BarChart3, Bell, Bookmark, HandHeart, LayoutDashboard, LogOut, Megaphone, MessageSquare, Settings, User } from "lucide-react";
import { AppShell } from "@/components/dashboard/AppShell";
import dashboard from "@/data/dashboard.json";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const u = dashboard.currentUser;
  return (
    <AppShell
      title="Creator workspace"
      user={{ name: u.name, subtitle: u.email, avatar: u.avatar }}
      nav={[
        { href: "/dashboard", label: "Dashboard", Icon: LayoutDashboard, exact: true },
        { href: "/dashboard/campaigns", label: "My Campaigns", Icon: Megaphone },
        { href: "/dashboard/analytics", label: "Analytics", Icon: BarChart3 },
        { href: "/dashboard/backed", label: "Backed Campaigns", Icon: HandHeart },
        { href: "/dashboard/saved", label: "Saved Campaigns", Icon: Bookmark },
        { href: "/dashboard/messages", label: "Messages", Icon: MessageSquare, badge: 3 },
        { href: "/dashboard/notifications", label: "Notifications", Icon: Bell, badge: 3 },
        { href: "/dashboard/profile", label: "Profile", Icon: User },
        { href: "/dashboard/settings", label: "Settings", Icon: Settings },
      ]}
      footerNav={[{ href: "/", label: "Logout", Icon: LogOut, exact: true }]}
    >
      {children}
    </AppShell>
  );
}
