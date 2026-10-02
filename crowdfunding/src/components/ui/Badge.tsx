import { Clock, Flame, Sparkles, Star, Target, TrendingUp } from "lucide-react";
import type { BadgeType } from "@/lib/types";
import { cn } from "@/lib/cn";

const badgeStyles: Record<BadgeType, { cls: string; Icon: typeof Flame }> = {
  Trending: { cls: "bg-orange-500 text-white", Icon: TrendingUp },
  Popular: { cls: "bg-violet-600 text-white", Icon: Flame },
  "Almost Funded": { cls: "bg-brand-600 text-white", Icon: Target },
  New: { cls: "bg-sky-500 text-white", Icon: Sparkles },
  "Ending Soon": { cls: "bg-rose-500 text-white", Icon: Clock },
  "Staff Pick": { cls: "bg-slate-900 text-white", Icon: Star },
};

export function CampaignBadge({ type, className }: { type: BadgeType; className?: string }) {
  const { cls, Icon } = badgeStyles[type];
  return (
    <span className={cn("inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold shadow-sm", cls, className)}>
      <Icon className="h-3 w-3" />
      {type}
    </span>
  );
}

const statusStyles: Record<string, string> = {
  Active: "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
  Draft: "bg-slate-100 text-slate-700 ring-slate-500/20",
  "Under Review": "bg-amber-50 text-amber-700 ring-amber-600/20",
  Completed: "bg-sky-50 text-sky-700 ring-sky-600/20",
  Cancelled: "bg-rose-50 text-rose-700 ring-rose-600/20",
  Funding: "bg-amber-50 text-amber-700 ring-amber-600/20",
  Funded: "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
  Delivered: "bg-sky-50 text-sky-700 ring-sky-600/20",
  Pledged: "bg-slate-100 text-slate-700 ring-slate-500/20",
  Authorised: "bg-sky-50 text-sky-700 ring-sky-600/20",
  Paid: "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
  "Card update needed": "bg-rose-50 text-rose-700 ring-rose-600/20",
  Pending: "bg-amber-50 text-amber-700 ring-amber-600/20",
  Approved: "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
  Rejected: "bg-rose-50 text-rose-700 ring-rose-600/20",
  "Changes Requested": "bg-violet-50 text-violet-700 ring-violet-600/20",
  Low: "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
  Medium: "bg-amber-50 text-amber-700 ring-amber-600/20",
  High: "bg-rose-50 text-rose-700 ring-rose-600/20",
  Verified: "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
  "Pending KYC": "bg-amber-50 text-amber-700 ring-amber-600/20",
  Flagged: "bg-rose-50 text-rose-700 ring-rose-600/20",
  Scheduled: "bg-sky-50 text-sky-700 ring-sky-600/20",
  "Paid out": "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
  "On hold": "bg-amber-50 text-amber-700 ring-amber-600/20",
  Open: "bg-rose-50 text-rose-700 ring-rose-600/20",
  Investigating: "bg-amber-50 text-amber-700 ring-amber-600/20",
  Resolved: "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
};

export function StatusBadge({ status, className }: { status: string; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ring-inset",
        statusStyles[status] ?? "bg-slate-100 text-slate-700 ring-slate-500/20",
        className,
      )}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current opacity-70" />
      {status}
    </span>
  );
}
