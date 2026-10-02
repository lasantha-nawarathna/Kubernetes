"use client";

import type { ReactNode } from "react";
import { AlertOctagon, CreditCard, FolderTree, Gavel, LayoutDashboard, LogOut, Megaphone, Settings, ShieldAlert, Users } from "lucide-react";
import { AppShell } from "@/components/dashboard/AppShell";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <AppShell
      title="Admin console"
      user={{ name: "Jordan Admin", subtitle: "Trust & Safety · Super admin" }}
      nav={[
        { href: "/admin", label: "Dashboard", Icon: LayoutDashboard, exact: true },
        { href: "/admin/campaigns", label: "Campaigns", Icon: Megaphone, badge: 27 },
        { href: "/admin/users", label: "Users", Icon: Users },
        { href: "/admin/categories", label: "Categories", Icon: FolderTree },
        { href: "/admin/reports", label: "Reports", Icon: AlertOctagon, badge: 9 },
        { href: "/admin/payments", label: "Payments", Icon: CreditCard },
        { href: "/admin/disputes", label: "Disputes", Icon: Gavel },
        { href: "/admin/moderation", label: "Moderation", Icon: ShieldAlert },
        { href: "/admin/settings", label: "Settings", Icon: Settings },
      ]}
      footerNav={[{ href: "/", label: "Exit admin", Icon: LogOut, exact: true }]}
    >
      {children}
    </AppShell>
  );
}
