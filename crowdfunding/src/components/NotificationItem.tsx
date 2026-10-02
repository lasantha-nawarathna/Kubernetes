"use client";

import { Bell, Clock, Eye, Gift, Heart, MessageSquare, Target, TrendingUp } from "lucide-react";
import { cn } from "@/lib/cn";

export interface Notification {
  id: string;
  type: string;
  title: string;
  body: string;
  time: string;
  read: boolean;
}

const styles: Record<string, { Icon: typeof Bell; cls: string }> = {
  milestone: { Icon: Target, cls: "bg-brand-100 text-brand-700" },
  contribution: { Icon: Gift, cls: "bg-violet-100 text-violet-700" },
  deadline: { Icon: Clock, cls: "bg-amber-100 text-amber-700" },
  saved: { Icon: Heart, cls: "bg-rose-100 text-rose-600" },
  comment: { Icon: MessageSquare, cls: "bg-sky-100 text-sky-700" },
  review: { Icon: Eye, cls: "bg-slate-100 text-slate-700" },
  update: { Icon: TrendingUp, cls: "bg-indigo-100 text-indigo-700" },
};

export function NotificationItem({ n, onClick, compact }: { n: Notification; onClick?: () => void; compact?: boolean }) {
  const { Icon, cls } = styles[n.type] ?? { Icon: Bell, cls: "bg-slate-100 text-slate-700" };
  return (
    <button
      onClick={onClick}
      className={cn("flex w-full items-start gap-4 rounded-2xl text-left transition hover:bg-slate-50", compact ? "p-3" : "p-4", !n.read && "bg-brand-50/40")}
    >
      <span className={cn("flex shrink-0 items-center justify-center rounded-2xl", cls, compact ? "h-9 w-9" : "h-11 w-11")}>
        <Icon className={compact ? "h-4 w-4" : "h-5 w-5"} />
      </span>
      <span className="min-w-0 flex-1">
        <span className={cn("block text-slate-900", n.read ? "font-medium" : "font-semibold", compact && "text-sm")}>{n.title}</span>
        {!compact && <span className="mt-0.5 block text-sm text-slate-500">{n.body}</span>}
        <span className="mt-1 block text-xs text-slate-400">{n.time}</span>
      </span>
      {!n.read && <span className="mt-2 h-2.5 w-2.5 shrink-0 rounded-full bg-brand-500" aria-label="Unread" />}
    </button>
  );
}
