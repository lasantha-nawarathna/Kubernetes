"use client";

import { notFound, useParams } from "next/navigation";
import { useState, type ReactNode } from "react";
import { Ban, Check, Eye, Search, Trash2 } from "lucide-react";
import { useApp } from "@/context/AppContext";
import { PageHeader, Panel } from "@/components/dashboard/AppShell";
import { ApprovalTable } from "@/components/admin/ApprovalTable";
import { Avatar } from "@/components/ui/Avatar";
import { StatusBadge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { CategoryIcon } from "@/components/ui/CategoryIcon";
import { Switch } from "@/components/ui/Switch";
import { ProgressBar } from "@/components/ui/ProgressBar";
import admin from "@/data/admin.json";
import { campaigns, categories, categoryName, formatMoney, getCreator, percentFunded } from "@/lib/data";

function Table({ head, children, minWidth = 720 }: { head: string[]; children: ReactNode; minWidth?: number }) {
  return (
    <div className="-mx-5 overflow-x-auto sm:-mx-6">
      <table className="w-full text-sm" style={{ minWidth }}>
        <thead>
          <tr className="border-y border-slate-100 bg-slate-50/70 text-left text-xs font-semibold tracking-wider text-slate-500 uppercase">
            {head.map((h, i) => (
              <th key={h} className={i === 0 ? "px-6 py-3" : i === head.length - 1 ? "px-6 py-3 text-right" : "px-3 py-3"}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">{children}</tbody>
      </table>
    </div>
  );
}

const td = "px-3 py-3";
const tdFirst = "px-6 py-3";
const tdLast = "px-6 py-3 text-right";

const SECTIONS: Record<string, { title: string; description: string }> = {
  campaigns: { title: "Campaigns", description: "Review submissions and monitor live campaigns." },
  users: { title: "Users", description: "Creators, backers and their verification status." },
  categories: { title: "Categories", description: "Manage the categories shown on Discover." },
  reports: { title: "Reports", description: "Campaigns flagged by the community." },
  payments: { title: "Payments", description: "Payouts to creators and platform fees." },
  disputes: { title: "Disputes", description: "Backer disputes and refund requests." },
  moderation: { title: "Moderation", description: "Comments and updates held for review." },
  settings: { title: "Settings", description: "Platform-wide configuration." },
};

export default function AdminSection() {
  const { section } = useParams<{ section: string }>();
  const meta = SECTIONS[section];
  if (!meta) notFound();
  return (
    <div className="space-y-6">
      <PageHeader title={meta.title} description={meta.description} />
      {section === "campaigns" && <CampaignsSection />}
      {section === "users" && <UsersSection />}
      {section === "categories" && <CategoriesSection />}
      {section === "reports" && <ReportsSection />}
      {section === "payments" && <PaymentsSection />}
      {section === "disputes" && <DisputesSection />}
      {section === "moderation" && <ModerationSection />}
      {section === "settings" && <SettingsSection />}
    </div>
  );
}

function CampaignsSection() {
  return (
    <>
      <Panel title="Awaiting approval">
        <ApprovalTable />
      </Panel>
      <Panel title="Live campaigns">
        <Table head={["Campaign", "Category", "Raised", "Progress", "Backers", "Days left"]} minWidth={820}>
          {campaigns.map((c) => (
            <tr key={c.id} className="hover:bg-slate-50/60">
              <td className={tdFirst}>
                <p className="font-semibold text-slate-900">{c.title}</p>
                <p className="text-xs text-slate-500">{getCreator(c.creatorId).name} · {c.location}</p>
              </td>
              <td className={td}>{categoryName(c.category)}</td>
              <td className={`${td} font-semibold`}>{formatMoney(c.raised)}</td>
              <td className={td}>
                <div className="flex w-36 items-center gap-2">
                  <ProgressBar value={percentFunded(c)} size="sm" />
                  <span className="text-xs font-semibold">{percentFunded(c)}%</span>
                </div>
              </td>
              <td className={td}>{c.backers.toLocaleString()}</td>
              <td className={tdLast}>{c.daysLeft}</td>
            </tr>
          ))}
        </Table>
      </Panel>
    </>
  );
}

function UsersSection() {
  const { toast } = useApp();
  const [q, setQ] = useState("");
  const rows = admin.users.filter((u) => (u.name + u.email).toLowerCase().includes(q.toLowerCase()));
  return (
    <Panel
      title={`${rows.length} users`}
      action={
        <div className="relative">
          <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search users" className="h-9 rounded-full bg-slate-100 pr-3 pl-9 text-sm outline-none" />
        </div>
      }
    >
      <Table head={["User", "Role", "Campaigns", "Joined", "Status", "Actions"]}>
        {rows.map((u) => (
          <tr key={u.email} className="hover:bg-slate-50/60">
            <td className={tdFirst}>
              <div className="flex items-center gap-3">
                <Avatar name={u.name} size={36} />
                <div>
                  <p className="font-semibold text-slate-900">{u.name}</p>
                  <p className="text-xs text-slate-500">{u.email}</p>
                </div>
              </div>
            </td>
            <td className={td}>{u.role}</td>
            <td className={td}>{u.campaigns}</td>
            <td className={td}>{u.joined}</td>
            <td className={td}><StatusBadge status={u.status} /></td>
            <td className={tdLast}>
              <div className="flex justify-end gap-1">
                <Button size="sm" variant="ghost" aria-label="View"><Eye className="h-4 w-4" /></Button>
                <Button size="sm" variant="ghost" className="text-rose-600" onClick={() => toast({ title: "User suspended", description: u.name, variant: "warning" })} aria-label="Suspend"><Ban className="h-4 w-4" /></Button>
              </div>
            </td>
          </tr>
        ))}
      </Table>
    </Panel>
  );
}

function CategoriesSection() {
  const [enabled, setEnabled] = useState<Record<string, boolean>>(Object.fromEntries(categories.map((c) => [c.slug, true])));
  return (
    <Panel>
      <Table head={["Category", "Description", "Live campaigns", "Visible"]}>
        {categories.map((c) => (
          <tr key={c.slug} className="hover:bg-slate-50/60">
            <td className={tdFirst}>
              <span className="flex items-center gap-3 font-semibold text-slate-900">
                <span className={`flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br text-white ${c.color}`}><CategoryIcon name={c.icon} className="h-4 w-4" /></span>
                {c.name}
              </span>
            </td>
            <td className={`${td} text-slate-500`}>{c.description}</td>
            <td className={td}>{campaigns.filter((x) => x.category === c.slug).length}</td>
            <td className={tdLast}>
              <Switch checked={enabled[c.slug]} onChange={(v) => setEnabled({ ...enabled, [c.slug]: v })} label={`Show ${c.name}`} />
            </td>
          </tr>
        ))}
      </Table>
    </Panel>
  );
}

function ReportsSection() {
  const { toast } = useApp();
  const [rows, setRows] = useState(admin.reports.map((r) => ({ ...r, state: "Open" })));
  const act = (id: string, state: string, msg: string) => {
    setRows(rows.map((r) => (r.id === id ? { ...r, state } : r)));
    toast({ title: msg, variant: state === "Resolved" ? "success" : "warning" });
  };
  return (
    <Panel>
      <Table head={["Campaign", "Reason", "Reports", "Severity", "Status", "Actions"]}>
        {rows.map((r) => (
          <tr key={r.id} className="hover:bg-slate-50/60">
            <td className={`${tdFirst} font-semibold text-slate-900`}>{r.campaign}</td>
            <td className={td}>{r.reason}</td>
            <td className={td}>{r.reports}</td>
            <td className={td}><StatusBadge status={r.severity} /></td>
            <td className={td}><StatusBadge status={r.state} /></td>
            <td className={tdLast}>
              <div className="flex justify-end gap-1.5">
                <Button size="sm" variant="outline" onClick={() => act(r.id, "Resolved", "Report dismissed")}>Dismiss</Button>
                <Button size="sm" variant="danger" onClick={() => act(r.id, "Resolved", "Campaign suspended")}>Suspend</Button>
              </div>
            </td>
          </tr>
        ))}
      </Table>
    </Panel>
  );
}

function PaymentsSection() {
  return (
    <Panel>
      <Table head={["Payout ID", "Campaign", "Gross", "Platform fee", "Status", "Date"]}>
        {admin.payments.map((p) => (
          <tr key={p.id} className="hover:bg-slate-50/60">
            <td className={`${tdFirst} font-mono text-xs`}>{p.id}</td>
            <td className={`${td} font-semibold text-slate-900`}>{p.campaign}</td>
            <td className={td}>{formatMoney(p.amount)}</td>
            <td className={td}>{formatMoney(p.fee)}</td>
            <td className={td}><StatusBadge status={p.status} /></td>
            <td className={tdLast}>{p.date}</td>
          </tr>
        ))}
      </Table>
    </Panel>
  );
}

function DisputesSection() {
  const { toast } = useApp();
  return (
    <Panel>
      <Table head={["Case", "Backer", "Campaign", "Amount", "Reason", "Status", "Actions"]} minWidth={900}>
        {admin.disputes.map((d) => (
          <tr key={d.id} className="hover:bg-slate-50/60">
            <td className={`${tdFirst} font-mono text-xs`}>{d.id}</td>
            <td className={td}>{d.backer}</td>
            <td className={`${td} font-semibold text-slate-900`}>{d.campaign}</td>
            <td className={td}>{formatMoney(d.amount)}</td>
            <td className={td}>{d.reason}</td>
            <td className={td}><StatusBadge status={d.status} /></td>
            <td className={tdLast}>
              <Button size="sm" variant="outline" onClick={() => toast({ title: "Refund issued (mock)", description: `${d.id} · ${formatMoney(d.amount)}` })}>Refund</Button>
            </td>
          </tr>
        ))}
      </Table>
    </Panel>
  );
}

function ModerationSection() {
  const { toast } = useApp();
  const [items, setItems] = useState([
    { id: 1, author: "user_83921", where: "Comment on Terra Bottle", text: "This is a scam, buy from my site instead → cheap-bottles.example", flag: "Spam link" },
    { id: 2, author: "Mark T.", where: "Comment on Echoes of Kepler", text: "Honestly the trailer looked rushed. Hope the final cut is better.", flag: "Auto-flagged: negativity" },
    { id: 3, author: "Pixel Nomad", where: "Update draft · Retro Handheld", text: "Officially licensed Nintendo games included!", flag: "IP / trademark" },
  ]);
  const resolve = (id: number, msg: string) => {
    setItems(items.filter((i) => i.id !== id));
    toast({ title: msg });
  };
  return (
    <div className="space-y-4">
      {items.map((i) => (
        <Panel key={i.id}>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="flex-1">
              <p className="text-xs text-slate-500">{i.where} · by <b>{i.author}</b></p>
              <p className="mt-1 text-slate-800">&ldquo;{i.text}&rdquo;</p>
              <span className="mt-2 inline-block rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-semibold text-amber-700">{i.flag}</span>
            </div>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" onClick={() => resolve(i.id, "Content approved")}><Check className="h-4 w-4" /> Approve</Button>
              <Button size="sm" variant="danger" onClick={() => resolve(i.id, "Content removed")}><Trash2 className="h-4 w-4" /> Remove</Button>
            </div>
          </div>
        </Panel>
      ))}
      {items.length === 0 && <Panel><p className="py-8 text-center text-slate-500">Moderation queue is empty 🎉</p></Panel>}
    </div>
  );
}

function SettingsSection() {
  const { toast } = useApp();
  const [s, setS] = useState({ autoApprove: false, kyc: true, guarantee: true, maintenance: false });
  return (
    <Panel>
      <div className="divide-y divide-slate-100">
        {(
          [
            ["autoApprove", "Auto-approve low-risk campaigns", "Skip manual review for verified creators with a low risk score."],
            ["kyc", "Require KYC before payout", "Identity and bank verification for all creators."],
            ["guarantee", "Fundora Guarantee", "Offer refund protection on eligible pledges."],
            ["maintenance", "Maintenance mode", "Temporarily disable new pledges platform-wide."],
          ] as const
        ).map(([k, t, d]) => (
          <div key={k} className="flex items-center justify-between gap-4 py-4">
            <div>
              <p className="font-semibold text-slate-900">{t}</p>
              <p className="text-sm text-slate-500">{d}</p>
            </div>
            <Switch checked={s[k]} onChange={(v) => setS({ ...s, [k]: v })} label={t} />
          </div>
        ))}
        <div className="flex items-center justify-between gap-4 py-4">
          <div>
            <p className="font-semibold text-slate-900">Platform fee</p>
            <p className="text-sm text-slate-500">Charged on successfully funded campaigns.</p>
          </div>
          <span className="rounded-xl border border-slate-200 px-4 py-2 font-semibold">5%</span>
        </div>
      </div>
      <div className="mt-4 flex justify-end">
        <Button onClick={() => toast({ title: "Platform settings saved" })}>Save changes</Button>
      </div>
    </Panel>
  );
}
