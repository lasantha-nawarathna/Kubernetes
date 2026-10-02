"use client";

import Link from "next/link";
import { ArrowRight, Eye, Megaphone, Percent, Plus, Users, Wallet } from "lucide-react";
import { DashboardStatCard } from "@/components/DashboardStatCard";
import { NotificationItem } from "@/components/NotificationItem";
import { PageHeader, Panel } from "@/components/dashboard/AppShell";
import { FundingProgressChart } from "@/components/dashboard/Charts";
import { Avatar } from "@/components/ui/Avatar";
import { ButtonLink } from "@/components/ui/Button";
import { StatusBadge } from "@/components/ui/Badge";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { SmartImage } from "@/components/ui/SmartImage";
import dashboard from "@/data/dashboard.json";
import notifications from "@/data/notifications.json";
import { compactNumber, formatMoney, getAnalytics, percentFunded } from "@/lib/data";

export default function DashboardPage() {
  const mine = dashboard.myCampaigns;
  const totalRaised = mine.reduce((s, c) => s + (c.status === "Cancelled" ? 0 : c.raised), 0);
  const totalBackers = mine.reduce((s, c) => s + c.backers, 0);
  const views = mine.reduce((s, c) => s + c.views, 0);
  const active = mine.filter((c) => c.status === "Active");
  const verdant = mine[0];
  const series = getAnalytics(verdant.raised, verdant.backers, verdant.goal);

  return (
    <div className="space-y-6">
      <PageHeader
        title={`Good afternoon, ${dashboard.currentUser.name.split(" ")[0]} 👋`}
        description="Here's how your campaigns are performing today."
        actions={
          <ButtonLink href="/start">
            <Plus className="h-4 w-4" /> New campaign
          </ButtonLink>
        }
      />

      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-5">
        <DashboardStatCard label="Total Raised" value={formatMoney(totalRaised)} icon={<Wallet className="h-5 w-5" />} change={12.4} hint="all campaigns" />
        <DashboardStatCard label="Total Backers" value={totalBackers.toLocaleString()} icon={<Users className="h-5 w-5" />} change={8.1} tone="sky" />
        <DashboardStatCard label="Active Campaigns" value={active.length.toString()} icon={<Megaphone className="h-5 w-5" />} tone="violet" hint="1 under review" />
        <DashboardStatCard label="Campaign Views" value={compactNumber(views)} icon={<Eye className="h-5 w-5" />} change={-3.2} tone="amber" />
        <DashboardStatCard label="Conversion Rate" value={`${((totalBackers / views) * 100).toFixed(1)}%`} icon={<Percent className="h-5 w-5" />} change={0.6} tone="rose" hint="views → backers" />
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <Panel
          className="xl:col-span-2"
          title="Funding progress · Verdant"
          action={<Link href="/dashboard/analytics" className="text-sm font-semibold text-brand-700 hover:underline">Full analytics →</Link>}
        >
          <div className="mb-2 flex flex-wrap items-baseline gap-x-4">
            <p className="text-3xl font-extrabold text-slate-900">{formatMoney(verdant.raised)}</p>
            <p className="text-sm text-slate-500">{percentFunded(verdant)}% of {formatMoney(verdant.goal)} · {verdant.daysLeft} days left</p>
          </div>
          <FundingProgressChart data={series} goal={verdant.goal} height={260} />
        </Panel>

        <Panel title="Latest Contributions" action={<span className="flex items-center gap-1.5 text-xs font-semibold text-brand-600"><span className="h-2 w-2 animate-pulse rounded-full bg-brand-500" /> Live</span>}>
          <ul className="space-y-1">
            {dashboard.latestContributions.map((c, i) => (
              <li key={i} className="flex items-center gap-3 rounded-2xl p-2 transition hover:bg-slate-50">
                <Avatar src={c.avatar} name={c.name === "Anonymous" ? "?" : c.name} size={38} />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-slate-900">{c.name}</p>
                  <p className="truncate text-xs text-slate-500">{c.reward} · {c.time}</p>
                </div>
                <span className="text-sm font-bold text-brand-700">+{formatMoney(c.amount)}</span>
              </li>
            ))}
          </ul>
        </Panel>
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <Panel className="xl:col-span-2" title="My campaigns" action={<Link href="/dashboard/campaigns" className="text-sm font-semibold text-brand-700 hover:underline">Manage all →</Link>}>
          <div className="divide-y divide-slate-100">
            {mine.slice(0, 4).map((c) => (
              <div key={c.id} className="flex items-center gap-4 py-3">
                <SmartImage src={c.image} alt={c.title} width={200} className="h-14 w-14 shrink-0 rounded-2xl" />
                <div className="min-w-0 flex-1">
                  <p className="truncate font-semibold text-slate-900">{c.title}</p>
                  <ProgressBar value={percentFunded(c)} size="sm" className="mt-2 max-w-xs" />
                </div>
                <div className="hidden text-right sm:block">
                  <p className="text-sm font-bold text-slate-900">{formatMoney(c.raised)}</p>
                  <p className="text-xs text-slate-500">{percentFunded(c)}% funded</p>
                </div>
                <StatusBadge status={c.status} />
              </div>
            ))}
          </div>
        </Panel>
        <Panel title="Notifications" action={<Link href="/dashboard/notifications" className="text-sm font-semibold text-brand-700 hover:underline">View all</Link>}>
          <div className="-mx-2 space-y-1">
            {notifications.slice(0, 4).map((n) => (
              <NotificationItem key={n.id} n={n} compact />
            ))}
          </div>
          <Link href="/dashboard/notifications" className="mt-3 flex items-center justify-center gap-1 text-sm font-semibold text-slate-600 hover:text-slate-900">
            See all activity <ArrowRight className="h-4 w-4" />
          </Link>
        </Panel>
      </div>
    </div>
  );
}
