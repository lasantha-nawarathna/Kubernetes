"use client";

import Link from "next/link";
import { AlertOctagon, ClipboardCheck, Megaphone, Users, Wallet } from "lucide-react";
import { DashboardStatCard } from "@/components/DashboardStatCard";
import { PageHeader, Panel } from "@/components/dashboard/AppShell";
import { ApprovalTable } from "@/components/admin/ApprovalTable";
import { DailyContributionsChart } from "@/components/dashboard/Charts";
import { StatusBadge } from "@/components/ui/Badge";
import admin from "@/data/admin.json";
import { compactNumber, formatMoney, getAnalytics } from "@/lib/data";

export default function AdminDashboard() {
  const s = admin.stats;
  const volume = getAnalytics(4_870_000, 52_000, 0, 3);
  return (
    <div className="space-y-6">
      <PageHeader title="Platform overview" description="Thursday, 2 October 2026 · All systems operational" />
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-5">
        <DashboardStatCard label="Total Users" value={compactNumber(s.totalUsers)} icon={<Users className="h-5 w-5" />} change={3.4} />
        <DashboardStatCard label="Active Campaigns" value={s.activeCampaigns.toLocaleString()} icon={<Megaphone className="h-5 w-5" />} change={5.2} tone="sky" />
        <DashboardStatCard label="Total Raised" value={`€${compactNumber(s.totalRaised)}`} icon={<Wallet className="h-5 w-5" />} change={11.8} tone="violet" hint="year to date" />
        <DashboardStatCard label="Pending Reviews" value={s.pendingReviews.toString()} icon={<ClipboardCheck className="h-5 w-5" />} tone="amber" hint="avg. wait 9h" />
        <DashboardStatCard label="Reported Campaigns" value={s.reported.toString()} icon={<AlertOctagon className="h-5 w-5" />} change={-12} tone="rose" />
      </div>

      <Panel title="Campaigns requiring approval" action={<Link href="/admin/campaigns" className="text-sm font-semibold text-brand-700 hover:underline">View queue →</Link>}>
        <ApprovalTable />
      </Panel>

      <div className="grid gap-6 xl:grid-cols-3">
        <Panel title="Daily pledge volume (30 days)" className="xl:col-span-2">
          <DailyContributionsChart data={volume} />
        </Panel>
        <Panel title="Recent reports" action={<Link href="/admin/reports" className="text-sm font-semibold text-brand-700 hover:underline">All</Link>}>
          <ul className="space-y-3">
            {admin.reports.map((r) => (
              <li key={r.id} className="rounded-2xl border border-slate-100 p-3">
                <div className="flex items-start justify-between gap-2">
                  <p className="font-semibold text-slate-900">{r.campaign}</p>
                  <StatusBadge status={r.severity} />
                </div>
                <p className="mt-1 text-sm text-slate-500">{r.reason} · {r.reports} reports · {r.date}</p>
              </li>
            ))}
          </ul>
          <p className="mt-4 text-xs text-slate-400">Payouts this month: {formatMoney(1_284_300)}</p>
        </Panel>
      </div>
    </div>
  );
}
