"use client";

import { useMemo, useState } from "react";
import { BarChart3, Download, Eye, Globe, Percent, Users, Wallet } from "lucide-react";
import { useApp } from "@/context/AppContext";
import { DashboardStatCard } from "@/components/DashboardStatCard";
import { PageHeader, Panel } from "@/components/dashboard/AppShell";
import { BackerGrowthChart, DailyContributionsChart, FundingProgressChart, RankedBars } from "@/components/dashboard/Charts";
import { Button } from "@/components/ui/Button";
import { Dropdown } from "@/components/ui/Dropdown";
import { Tabs } from "@/components/ui/Tabs";
import dashboard from "@/data/dashboard.json";
import { compactNumber, formatMoney, getAnalytics, getCampaign, getRewards, trafficSources } from "@/lib/data";

const RANGES = [
  { id: "7", label: "7 days" },
  { id: "14", label: "14 days" },
  { id: "30", label: "30 days" },
];

export default function AnalyticsPage() {
  const { toast } = useApp();
  const options = dashboard.myCampaigns.filter((c) => c.backers > 0);
  const [id, setId] = useState(options[0].id);
  const [range, setRange] = useState("30");
  const c = options.find((o) => o.id === id)!;

  const series = useMemo(() => getAnalytics(c.raised, c.backers, c.goal, id.length), [c, id]);
  const visible = series.slice(-Number(range));
  const live = getCampaign(id) ?? getCampaign("verdant-indoor-garden")!;
  const rewards = getRewards(live).map((r) => ({ name: `${r.title} (€${r.amount})`, backers: Math.round((r.backers / live.backers) * c.backers) }));
  const avg = c.raised / c.backers;
  const conversion = (c.backers / c.views) * 100;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Campaign Analytics"
        description="Understand where your backers come from and what they love."
        actions={
          <>
            <Dropdown className="w-72" value={id} onChange={setId} options={options.map((o) => ({ value: o.id, label: o.title }))} />
            <Button variant="outline" onClick={() => toast({ title: "Report exported", description: "analytics-report.csv (mock)" })}>
              <Download className="h-4 w-4" /> Export
            </Button>
          </>
        }
      />
      <Tabs variant="pill" tabs={RANGES} active={range} onChange={setRange} />

      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-6">
        <DashboardStatCard label="Total raised" value={formatMoney(c.raised)} icon={<Wallet className="h-5 w-5" />} change={14.2} />
        <DashboardStatCard label="Backers" value={c.backers.toLocaleString()} icon={<Users className="h-5 w-5" />} change={9.8} tone="sky" />
        <DashboardStatCard label="Campaign views" value={compactNumber(c.views)} icon={<Eye className="h-5 w-5" />} change={4.1} tone="amber" />
        <DashboardStatCard label="Avg. contribution" value={formatMoney(avg)} icon={<BarChart3 className="h-5 w-5" />} change={2.3} tone="violet" />
        <DashboardStatCard label="Conversion rate" value={`${conversion.toFixed(2)}%`} icon={<Percent className="h-5 w-5" />} change={0.4} tone="rose" />
        <DashboardStatCard label="Top traffic source" value={trafficSources[0].name} icon={<Globe className="h-5 w-5" />} tone="slate" hint={`${trafficSources[0].value}% of visits`} />
      </div>

      <Panel title="Funding progress">
        <FundingProgressChart data={visible} goal={c.goal} />
      </Panel>

      <div className="grid gap-6 lg:grid-cols-2">
        <Panel title="Daily contributions">
          <DailyContributionsChart data={visible} />
        </Panel>
        <Panel title="Backer growth">
          <BackerGrowthChart data={visible} />
        </Panel>
        <Panel title="Traffic sources">
          <RankedBars data={trafficSources} nameKey="name" valueKey="value" unit="%" />
        </Panel>
        <Panel title="Popular reward tiers">
          <RankedBars data={rewards} nameKey="name" valueKey="backers" unit="backers" />
        </Panel>
      </div>
    </div>
  );
}
