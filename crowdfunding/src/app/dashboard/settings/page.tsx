"use client";

import { useState } from "react";
import { Building2, CreditCard, KeyRound, ShieldCheck } from "lucide-react";
import { useApp } from "@/context/AppContext";
import { PageHeader, Panel } from "@/components/dashboard/AppShell";
import { Button } from "@/components/ui/Button";
import { Dropdown } from "@/components/ui/Dropdown";
import { Switch } from "@/components/ui/Switch";

export default function SettingsPage() {
  const { toast } = useApp();
  const [prefs, setPrefs] = useState({ backers: true, comments: true, milestones: true, saved: true, newsletter: false, twofa: true });
  const [lang, setLang] = useState("en");
  const [currency, setCurrency] = useState("EUR");
  const toggle = (k: keyof typeof prefs) => (v: boolean) => setPrefs({ ...prefs, [k]: v });

  return (
    <div className="max-w-3xl space-y-6">
      <PageHeader title="Settings" description="Manage notifications, payments and account security." />
      <Panel title="Email notifications">
        <div className="divide-y divide-slate-100">
          {[
            ["backers", "New backers", "When someone supports one of your campaigns"],
            ["comments", "Comments & questions", "When backers comment or message you"],
            ["milestones", "Funding milestones", "When you reach 25%, 50%, 75% and 100%"],
            ["saved", "Saved campaign reminders", "48 hours before a saved campaign ends"],
            ["newsletter", "Fundora Weekly", "Our editors' favourite new projects"],
          ].map(([k, t, d]) => (
            <div key={k} className="flex items-center justify-between gap-4 py-4">
              <div>
                <p className="font-semibold text-slate-900">{t}</p>
                <p className="text-sm text-slate-500">{d}</p>
              </div>
              <Switch checked={prefs[k as keyof typeof prefs]} onChange={toggle(k as keyof typeof prefs)} label={t} />
            </div>
          ))}
        </div>
      </Panel>
      <Panel title="Preferences">
        <div className="grid gap-4 sm:grid-cols-2">
          <div><p className="mb-1.5 text-sm font-semibold text-slate-700">Language</p><Dropdown value={lang} onChange={setLang} options={[{ value: "en", label: "English" }, { value: "de", label: "Deutsch" }, { value: "fr", label: "Français" }, { value: "es", label: "Español" }, { value: "pt", label: "Português" }]} /></div>
          <div><p className="mb-1.5 text-sm font-semibold text-slate-700">Display currency</p><Dropdown value={currency} onChange={setCurrency} options={[{ value: "EUR", label: "€ Euro" }, { value: "GBP", label: "£ Pound" }, { value: "USD", label: "$ US Dollar" }]} /></div>
        </div>
      </Panel>
      <Panel title="Payments & payouts">
        <div className="space-y-3">
          <div className="flex items-center gap-4 rounded-2xl border border-slate-200 p-4">
            <CreditCard className="h-6 w-6 text-slate-500" />
            <div className="flex-1"><p className="font-semibold">Visa •••• 4242</p><p className="text-sm text-slate-500">Default card for pledges · expires 08/29</p></div>
            <Button variant="ghost" size="sm">Edit</Button>
          </div>
          <div className="flex items-center gap-4 rounded-2xl border border-slate-200 p-4">
            <Building2 className="h-6 w-6 text-slate-500" />
            <div className="flex-1"><p className="font-semibold">ING Bank •••• 7731</p><p className="text-sm text-slate-500">Payout account · verified</p></div>
            <ShieldCheck className="h-5 w-5 text-brand-600" />
          </div>
        </div>
      </Panel>
      <Panel title="Security">
        <div className="flex items-center justify-between gap-4">
          <div><p className="font-semibold">Two-factor authentication</p><p className="text-sm text-slate-500">Required for payouts above €10,000</p></div>
          <Switch checked={prefs.twofa} onChange={toggle("twofa")} label="Two-factor authentication" />
        </div>
        <Button variant="outline" className="mt-4"><KeyRound className="h-4 w-4" /> Change password</Button>
      </Panel>
      <div className="flex justify-end gap-3">
        <Button variant="ghost">Cancel</Button>
        <Button onClick={() => toast({ title: "Settings saved" })}>Save settings</Button>
      </div>
    </div>
  );
}
