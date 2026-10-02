"use client";

import { useState } from "react";
import { CheckCheck } from "lucide-react";
import { useApp } from "@/context/AppContext";
import { PageHeader } from "@/components/dashboard/AppShell";
import { NotificationItem } from "@/components/NotificationItem";
import { Button } from "@/components/ui/Button";
import { Tabs } from "@/components/ui/Tabs";
import data from "@/data/notifications.json";

export default function NotificationsPage() {
  const { toast } = useApp();
  const [items, setItems] = useState(data);
  const [tab, setTab] = useState("all");
  const unread = items.filter((n) => !n.read).length;
  const list = items.filter((n) => (tab === "all" ? true : tab === "unread" ? !n.read : ["milestone", "contribution", "deadline"].includes(n.type)));

  return (
    <div className="max-w-3xl">
      <PageHeader
        title="Notifications"
        description={`You have ${unread} unread notification${unread === 1 ? "" : "s"}.`}
        actions={
          <Button
            variant="outline"
            size="sm"
            disabled={!unread}
            onClick={() => {
              setItems(items.map((n) => ({ ...n, read: true })));
              toast({ title: "All notifications marked as read" });
            }}
          >
            <CheckCheck className="h-4 w-4" /> Mark all as read
          </Button>
        }
      />
      <Tabs
        variant="pill"
        tabs={[
          { id: "all", label: "All", count: items.length },
          { id: "unread", label: "Unread", count: unread },
          { id: "campaigns", label: "My campaigns" },
        ]}
        active={tab}
        onChange={setTab}
      />
      <div className="mt-6 space-y-1 rounded-3xl border border-slate-100 bg-white p-2 shadow-soft">
        {list.map((n) => (
          <NotificationItem key={n.id} n={n} onClick={() => setItems(items.map((x) => (x.id === n.id ? { ...x, read: true } : x)))} />
        ))}
        {list.length === 0 && <p className="p-10 text-center text-slate-500">You&apos;re all caught up 🎉</p>}
      </div>
    </div>
  );
}
