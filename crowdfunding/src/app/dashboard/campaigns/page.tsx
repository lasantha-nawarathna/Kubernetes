"use client";

import Link from "next/link";
import { useState } from "react";
import { BarChart3, Clock, Eye, Pencil, Plus, Settings2, Users } from "lucide-react";
import { useApp } from "@/context/AppContext";
import { PageHeader } from "@/components/dashboard/AppShell";
import { ButtonLink, buttonClass } from "@/components/ui/Button";
import { StatusBadge } from "@/components/ui/Badge";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { SmartImage } from "@/components/ui/SmartImage";
import { Tabs } from "@/components/ui/Tabs";
import dashboard from "@/data/dashboard.json";
import { formatMoney, getCampaign, percentFunded } from "@/lib/data";

const STATUSES = ["All", "Active", "Draft", "Under Review", "Completed", "Cancelled"];

export default function MyCampaignsPage() {
  const { toast } = useApp();
  const [tab, setTab] = useState("All");
  const list = dashboard.myCampaigns.filter((c) => tab === "All" || c.status === tab);

  return (
    <div>
      <PageHeader
        title="My Campaigns"
        description="Create, edit and track every campaign you run."
        actions={<ButtonLink href="/start"><Plus className="h-4 w-4" /> New campaign</ButtonLink>}
      />
      <Tabs
        variant="pill"
        tabs={STATUSES.map((s) => ({ id: s, label: s, count: s === "All" ? dashboard.myCampaigns.length : dashboard.myCampaigns.filter((c) => c.status === s).length }))}
        active={tab}
        onChange={setTab}
      />
      <div className="mt-6 grid gap-5 md:grid-cols-2 2xl:grid-cols-3">
        {list.map((c) => {
          const live = getCampaign(c.id);
          const pct = percentFunded(c);
          return (
            <article key={c.id} className="flex flex-col overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-soft transition hover:shadow-lift">
              <div className="relative">
                <SmartImage src={c.image} alt={c.title} width={700} className="aspect-[16/9]" />
                <StatusBadge status={c.status} className="absolute top-3 left-3 bg-white/95 shadow-sm" />
              </div>
              <div className="flex flex-1 flex-col p-5">
                <h3 className="font-bold text-slate-900">{c.title}</h3>
                <ProgressBar value={pct} className="mt-4" />
                <div className="mt-3 flex items-end justify-between">
                  <div>
                    <p className="text-xl font-extrabold text-slate-900">{formatMoney(c.raised)}</p>
                    <p className="text-xs text-slate-500">of {formatMoney(c.goal)} goal</p>
                  </div>
                  <p className="text-sm font-bold text-brand-700">{pct}%</p>
                </div>
                <div className="mt-4 grid grid-cols-3 gap-2 rounded-2xl bg-slate-50 p-3 text-center text-xs text-slate-500">
                  <div><Users className="mx-auto h-4 w-4" /><p className="mt-1 font-bold text-slate-900">{c.backers.toLocaleString()}</p>backers</div>
                  <div><Eye className="mx-auto h-4 w-4" /><p className="mt-1 font-bold text-slate-900">{c.views.toLocaleString()}</p>views</div>
                  <div><Clock className="mx-auto h-4 w-4" /><p className="mt-1 font-bold text-slate-900">{c.status === "Completed" || c.status === "Cancelled" ? "—" : c.daysLeft}</p>days left</div>
                </div>
                <div className="mt-5 grid grid-cols-4 gap-2">
                  <Link href={live ? `/campaign/${c.id}` : "/start"} className={buttonClass("outline", "sm", "px-0")} title="View"><Eye className="h-4 w-4" /><span className="max-sm:hidden">View</span></Link>
                  <Link href="/start" className={buttonClass("outline", "sm", "px-0")} title="Edit"><Pencil className="h-4 w-4" /><span className="max-sm:hidden">Edit</span></Link>
                  <Link href="/dashboard/analytics" className={buttonClass("outline", "sm", "px-0")} title="Analytics"><BarChart3 className="h-4 w-4" /><span className="max-sm:hidden">Stats</span></Link>
                  <button onClick={() => toast({ title: "Manage campaign", description: `Opening settings for ${c.title}`, variant: "info" })} className={buttonClass("dark", "sm", "px-0")} title="Manage"><Settings2 className="h-4 w-4" /><span className="max-sm:hidden">Manage</span></button>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
