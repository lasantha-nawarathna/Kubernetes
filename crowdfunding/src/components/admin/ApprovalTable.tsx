"use client";

import { useState } from "react";
import { Check, MessageSquareWarning, X } from "lucide-react";
import { useApp } from "@/context/AppContext";
import { StatusBadge } from "@/components/ui/Badge";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { SmartImage } from "@/components/ui/SmartImage";
import admin from "@/data/admin.json";
import { formatMoney } from "@/lib/data";

type Row = (typeof admin.pending)[number];

export function ApprovalTable({ limit }: { limit?: number }) {
  const { toast } = useApp();
  const [rows, setRows] = useState<Row[]>(admin.pending);
  const [changesFor, setChangesFor] = useState<Row | null>(null);
  const [note, setNote] = useState("");

  const setStatus = (id: string, status: string) => setRows((r) => r.map((x) => (x.id === id ? { ...x, status } : x)));
  const visible = limit ? rows.slice(0, limit) : rows;

  return (
    <>
      <div className="-mx-5 overflow-x-auto sm:-mx-6">
        <table className="w-full min-w-[820px] text-sm">
          <thead>
            <tr className="border-y border-slate-100 bg-slate-50/70 text-left text-xs font-semibold tracking-wider text-slate-500 uppercase">
              <th className="px-6 py-3">Campaign</th>
              <th className="px-3 py-3">Category</th>
              <th className="px-3 py-3 text-right">Goal</th>
              <th className="px-3 py-3">Submitted</th>
              <th className="px-3 py-3">Risk</th>
              <th className="px-3 py-3">Status</th>
              <th className="px-6 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {visible.map((r) => (
              <tr key={r.id} className="transition hover:bg-slate-50/60">
                <td className="px-6 py-3">
                  <div className="flex items-center gap-3">
                    <SmartImage src={r.image} alt={r.title} width={160} className="h-11 w-14 shrink-0 rounded-xl" />
                    <div className="min-w-0">
                      <p className="max-w-[240px] truncate font-semibold text-slate-900">{r.title}</p>
                      <p className="text-xs text-slate-500">by {r.creator}</p>
                    </div>
                  </div>
                </td>
                <td className="px-3 py-3 text-slate-600">{r.category}</td>
                <td className="px-3 py-3 text-right font-semibold text-slate-900">{formatMoney(r.goal)}</td>
                <td className="px-3 py-3 text-slate-500">{r.submitted}</td>
                <td className="px-3 py-3"><StatusBadge status={r.risk} /></td>
                <td className="px-3 py-3"><StatusBadge status={r.status} /></td>
                <td className="px-6 py-3">
                  {r.status === "Pending" ? (
                    <div className="flex justify-end gap-1.5">
                      <Button
                        size="sm"
                        onClick={() => {
                          setStatus(r.id, "Approved");
                          toast({ title: "Campaign approved", description: r.title });
                        }}
                      >
                        <Check className="h-4 w-4" /> Approve
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => { setChangesFor(r); setNote(""); }}>
                        <MessageSquareWarning className="h-4 w-4" /> Request Changes
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-rose-600 hover:border-rose-200 hover:bg-rose-50"
                        onClick={() => {
                          setStatus(r.id, "Rejected");
                          toast({ title: "Campaign rejected", description: r.title, variant: "warning" });
                        }}
                      >
                        <X className="h-4 w-4" /> Reject
                      </Button>
                    </div>
                  ) : (
                    <div className="flex justify-end">
                      <button onClick={() => setStatus(r.id, "Pending")} className="text-xs font-semibold text-slate-500 hover:text-slate-900">Undo</button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal
        open={!!changesFor}
        onClose={() => setChangesFor(null)}
        title="Request changes"
        description={changesFor?.title}
        footer={
          <div className="flex justify-end gap-2">
            <Button variant="ghost" onClick={() => setChangesFor(null)}>Cancel</Button>
            <Button
              onClick={() => {
                if (changesFor) setStatus(changesFor.id, "Changes Requested");
                toast({ title: "Change request sent", description: `${changesFor?.creator} has been notified.`, variant: "info" });
                setChangesFor(null);
              }}
            >
              Send request
            </Button>
          </div>
        }
      >
        <p className="mb-3 text-sm text-slate-500">Common reasons</p>
        <div className="mb-4 flex flex-wrap gap-2">
          {["Add a realistic delivery timeline", "Show a working prototype", "Clarify use of funds", "Remove guaranteed-return claims"].map((t) => (
            <button key={t} onClick={() => setNote((n) => (n ? `${n}\n• ${t}` : `• ${t}`))} className="rounded-full border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 hover:border-brand-300 hover:text-brand-700">
              + {t}
            </button>
          ))}
        </div>
        <textarea value={note} onChange={(e) => setNote(e.target.value)} rows={5} placeholder="Explain what the creator needs to change…" className="w-full rounded-2xl border border-slate-200 p-3 text-sm outline-none focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10" />
      </Modal>
    </>
  );
}
