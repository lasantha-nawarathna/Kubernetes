"use client";

import Link from "next/link";
import { AlertCircle, CalendarClock, CreditCard, Gift, MessageSquare } from "lucide-react";
import { PageHeader } from "@/components/dashboard/AppShell";
import { DashboardStatCard } from "@/components/DashboardStatCard";
import { StatusBadge } from "@/components/ui/Badge";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { SmartImage } from "@/components/ui/SmartImage";
import { buttonClass } from "@/components/ui/Button";
import dashboard from "@/data/dashboard.json";
import { formatMoney, getCampaign, getCreator, percentFunded } from "@/lib/data";
import { HandHeart, Package, Wallet } from "lucide-react";

export default function BackedPage() {
  const backed = dashboard.backed.map((b) => ({ ...b, campaign: getCampaign(b.campaignId)! }));
  const total = backed.reduce((s, b) => s + b.amount, 0);

  return (
    <div>
      <PageHeader title="Backed Campaigns" description="Projects you've supported and the status of your rewards." />
      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <DashboardStatCard label="Total contributed" value={formatMoney(total)} icon={<Wallet className="h-5 w-5" />} />
        <DashboardStatCard label="Projects backed" value={backed.length.toString()} icon={<HandHeart className="h-5 w-5" />} tone="violet" />
        <DashboardStatCard label="Rewards on the way" value={backed.filter((b) => b.status !== "Delivered").length.toString()} icon={<Package className="h-5 w-5" />} tone="sky" />
      </div>
      <div className="space-y-4">
        {backed.map((b) => {
          const c = b.campaign;
          return (
            <article key={b.campaignId} className="flex flex-col gap-5 rounded-3xl border border-slate-100 bg-white p-4 shadow-soft sm:p-5 lg:flex-row lg:items-center">
              <Link href={`/campaign/${c.id}`} className="flex min-w-0 flex-1 gap-4">
                <SmartImage src={c.image} alt={c.title} width={300} className="h-24 w-28 shrink-0 rounded-2xl sm:w-36" />
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <StatusBadge status={b.status} />
                    <span className="text-xs text-slate-400">Backed {b.date}</span>
                  </div>
                  <h3 className="mt-1.5 truncate font-bold text-slate-900 hover:text-brand-700">{c.title}</h3>
                  <p className="text-sm text-slate-500">by {getCreator(c.creatorId).name}</p>
                  <div className="mt-2 flex max-w-xs items-center gap-2">
                    <ProgressBar value={percentFunded(c)} size="sm" />
                    <span className="text-xs font-semibold text-slate-600">{percentFunded(c)}%</span>
                  </div>
                </div>
              </Link>
              <div className="grid grid-cols-2 gap-3 text-sm sm:grid-cols-4 lg:w-[560px] lg:shrink-0">
                <Info icon={<Wallet className="h-4 w-4" />} label="Contribution" value={formatMoney(b.amount)} />
                <Info icon={<Gift className="h-4 w-4" />} label="Reward" value={b.reward} />
                <Info icon={<CalendarClock className="h-4 w-4" />} label="Est. delivery" value={b.delivery} />
                <div className="rounded-2xl bg-slate-50 p-3">
                  <p className="flex items-center gap-1 text-xs text-slate-500"><CreditCard className="h-4 w-4" /> Payment</p>
                  <StatusBadge status={b.payment} className="mt-1" />
                </div>
              </div>
              <div className="flex gap-2 lg:flex-col">
                {b.payment === "Card update needed" ? (
                  <button className={buttonClass("danger", "sm")}><AlertCircle className="h-4 w-4" /> Update card</button>
                ) : (
                  <Link href={`/campaign/${c.id}`} className={buttonClass("outline", "sm")}>View</Link>
                )}
                <Link href="/dashboard/messages" className={buttonClass("ghost", "sm")}><MessageSquare className="h-4 w-4" /> Message</Link>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}

function Info({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-slate-50 p-3">
      <p className="flex items-center gap-1 text-xs text-slate-500">{icon} {label}</p>
      <p className="mt-1 truncate font-semibold text-slate-900" title={value}>{value}</p>
    </div>
  );
}
