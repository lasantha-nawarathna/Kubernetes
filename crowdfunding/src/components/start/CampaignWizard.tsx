"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Bold,
  Check,
  ExternalLink,
  Heading2,
  ImagePlus,
  Italic,
  Link2,
  List,
  ListOrdered,
  PartyPopper,
  Plus,
  Quote,
  Rocket,
  Save,
  Trash2,
  Upload,
  Video,
} from "lucide-react";
import { useApp } from "@/context/AppContext";
import { Button, ButtonLink } from "@/components/ui/Button";
import { Dropdown } from "@/components/ui/Dropdown";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { SmartImage } from "@/components/ui/SmartImage";
import { CategoryIcon } from "@/components/ui/CategoryIcon";
import { RewardCard } from "@/components/RewardCard";
import { categories, categoryName, formatMoney } from "@/lib/data";
import type { FundingType, Reward } from "@/lib/types";
import { cn } from "@/lib/cn";

const STEPS = ["Basics", "Funding", "Story", "Rewards", "Preview", "Publish"];

interface Draft {
  title: string;
  description: string;
  category: string;
  location: string;
  image: string;
  goal: number;
  currency: string;
  duration: number;
  fundingType: FundingType;
  story: string;
  videoUrl: string;
  storyImages: string[];
  rewards: Reward[];
}

const initialDraft: Draft = {
  title: "Verdant Mini — Desk Herb Garden",
  description: "A tiny, self-watering herb garden for your desk with a sunrise-simulating grow light.",
  category: "design",
  location: "Amsterdam, Netherlands",
  image: "1485955900006-10f4d324d411",
  goal: 20000,
  currency: "EUR",
  duration: 30,
  fundingType: "All-or-Nothing",
  story: "",
  videoUrl: "",
  storyImages: [],
  rewards: [
    { id: "n1", amount: 10, title: "Supporter", description: "Thank you for believing in us!", items: ["Thank-you message", "Campaign updates"], delivery: "December 2026", backers: 0, limit: null },
    { id: "n2", amount: 49, title: "Early Supporter", description: "Verdant Mini at our early supporter price.", items: ["1× Verdant Mini", "3 seed pods", "Exclusive updates"], delivery: "February 2027", backers: 0, limit: 500 },
  ],
};

const input =
  "h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10";

export function CampaignWizard() {
  const { toast } = useApp();
  const [step, setStep] = useState(0);
  const [draft, setDraft] = useState<Draft>(initialDraft);
  const [publishing, setPublishing] = useState(false);

  const set = <K extends keyof Draft>(k: K, v: Draft[K]) => setDraft((d) => ({ ...d, [k]: v }));

  const canNext = [
    draft.title.trim().length > 3 && draft.description.trim().length > 10 && !!draft.category,
    draft.goal >= 500 && draft.duration > 0,
    true,
    draft.rewards.length > 0,
    true,
    true,
  ][step];

  const next = () => {
    if (step === 4) {
      setPublishing(true);
      setTimeout(() => {
        setPublishing(false);
        setStep(5);
      }, 1500);
      return;
    }
    setStep((s) => Math.min(s + 1, STEPS.length - 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      {step < 5 && (
        <>
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="text-sm font-semibold tracking-wider text-brand-600 uppercase">Start a Campaign</p>
              <h1 className="mt-1 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">Bring your idea to life</h1>
            </div>
            <Button variant="outline" size="sm" onClick={() => toast({ title: "Draft saved", description: "You can finish it later from your dashboard." })}>
              <Save className="h-4 w-4" /> Save draft
            </Button>
          </div>

          {/* Stepper */}
          <ol className="mt-8 flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
            {STEPS.map((s, i) => (
              <li key={s} className="flex shrink-0 items-center gap-2">
                <button
                  onClick={() => i < step && setStep(i)}
                  disabled={i > step}
                  className={cn(
                    "flex items-center gap-2 rounded-full py-1.5 pr-4 pl-1.5 text-sm font-semibold transition",
                    i === step ? "bg-slate-900 text-white" : i < step ? "bg-brand-50 text-brand-700 hover:bg-brand-100" : "bg-slate-100 text-slate-400",
                  )}
                >
                  <span className={cn("flex h-6 w-6 items-center justify-center rounded-full text-xs", i === step ? "bg-white text-slate-900" : i < step ? "bg-brand-600 text-white" : "bg-white text-slate-400")}>
                    {i < step ? <Check className="h-3.5 w-3.5" /> : i + 1}
                  </span>
                  {s}
                </button>
                {i < STEPS.length - 1 && <span className={cn("h-0.5 w-6", i < step ? "bg-brand-300" : "bg-slate-200")} />}
              </li>
            ))}
          </ol>
          <ProgressBar value={(step / (STEPS.length - 1)) * 100} size="sm" className="mt-3" />
        </>
      )}

      <div className="mt-8 animate-fade-up" key={step}>
        {step === 0 && <StepBasics draft={draft} set={set} />}
        {step === 1 && <StepFunding draft={draft} set={set} />}
        {step === 2 && <StepStory draft={draft} set={set} />}
        {step === 3 && <StepRewards draft={draft} set={set} />}
        {step === 4 && <StepPreview draft={draft} />}
        {step === 5 && <StepPublished draft={draft} />}
      </div>

      {step < 5 && (
        <div className="mt-10 flex items-center justify-between border-t border-slate-100 pt-6">
          <Button variant="ghost" onClick={() => setStep((s) => Math.max(0, s - 1))} disabled={step === 0}>
            <ArrowLeft className="h-4 w-4" /> Back
          </Button>
          <div className="flex items-center gap-3">
            <span className="hidden text-sm text-slate-400 sm:inline">Step {step + 1} of {STEPS.length}</span>
            <Button size="lg" onClick={next} disabled={!canNext || publishing}>
              {step === 4 ? (
                publishing ? "Publishing…" : (<><Rocket className="h-5 w-5" /> Publish campaign</>)
              ) : (
                <>Continue <ArrowRight className="h-5 w-5" /></>
              )}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

type StepProps = { draft: Draft; set: <K extends keyof Draft>(k: K, v: Draft[K]) => void };

function Field({ label, hint, children, counter }: { label: string; hint?: string; children: React.ReactNode; counter?: string }) {
  return (
    <label className="block">
      <span className="flex items-center justify-between">
        <span className="text-sm font-semibold text-slate-900">{label}</span>
        {counter && <span className="text-xs text-slate-400">{counter}</span>}
      </span>
      {hint && <span className="mt-0.5 block text-sm text-slate-500">{hint}</span>}
      <span className="mt-2 block">{children}</span>
    </label>
  );
}

function Card({ title, description, children }: { title: string; description?: string; children: React.ReactNode }) {
  return (
    <section className="rounded-3xl border border-slate-100 bg-white p-6 shadow-soft sm:p-8">
      <h2 className="text-xl font-bold text-slate-900">{title}</h2>
      {description && <p className="mt-1 text-slate-500">{description}</p>}
      <div className="mt-6 space-y-6">{children}</div>
    </section>
  );
}

function StepBasics({ draft, set }: StepProps) {
  const fileRef = useRef<HTMLInputElement>(null);
  return (
    <div className="grid gap-6 lg:grid-cols-5">
      <div className="lg:col-span-3">
        <Card title="Campaign basics" description="Make a great first impression — these appear on your campaign card.">
          <Field label="Campaign title" counter={`${draft.title.length}/60`}>
            <input className={input} maxLength={60} value={draft.title} onChange={(e) => set("title", e.target.value)} placeholder="e.g. Smart Solar Backpack" />
          </Field>
          <Field label="Short description" hint="One or two sentences that explain your project." counter={`${draft.description.length}/135`}>
            <textarea
              className={cn(input, "h-28 resize-none py-3")}
              maxLength={135}
              value={draft.description}
              onChange={(e) => set("description", e.target.value)}
            />
          </Field>
          <div>
            <p className="text-sm font-semibold text-slate-900">Category</p>
            <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-3">
              {categories.map((c) => (
                <button
                  type="button"
                  key={c.slug}
                  onClick={() => set("category", c.slug)}
                  className={cn(
                    "flex items-center gap-2 rounded-2xl border-2 px-3 py-2.5 text-left text-sm font-medium transition",
                    draft.category === c.slug ? "border-brand-600 bg-brand-50 text-brand-800" : "border-slate-100 text-slate-700 hover:border-slate-200",
                  )}
                >
                  <CategoryIcon name={c.icon} className="h-4 w-4 shrink-0" />
                  <span className="truncate">{c.name}</span>
                </button>
              ))}
            </div>
          </div>
          <Field label="Location">
            <input className={input} value={draft.location} onChange={(e) => set("location", e.target.value)} placeholder="City, Country" />
          </Field>
        </Card>
      </div>
      <div className="lg:col-span-2">
        <Card title="Campaign image" description="1600×1200px recommended. JPG or PNG.">
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className="group relative block aspect-[4/3] w-full overflow-hidden rounded-2xl border-2 border-dashed border-slate-200 transition hover:border-brand-400"
          >
            {draft.image ? (
              <>
                <SmartImage src={draft.image} alt={draft.title || "Campaign image"} width={800} className="h-full w-full" />
                <span className="absolute inset-0 flex items-center justify-center bg-slate-900/50 text-sm font-semibold text-white opacity-0 transition group-hover:opacity-100">
                  <Upload className="mr-2 h-4 w-4" /> Replace image
                </span>
              </>
            ) : (
              <span className="flex h-full flex-col items-center justify-center text-slate-400">
                <ImagePlus className="h-10 w-10" />
                <span className="mt-2 text-sm font-medium">Click to upload</span>
              </span>
            )}
          </button>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) set("image", URL.createObjectURL(f));
            }}
          />
          <div className="rounded-2xl bg-amber-50 p-4 text-sm text-amber-800">
            <b>Tip:</b> campaigns with a clear, bright product photo get 32% more clicks.
          </div>
        </Card>
      </div>
    </div>
  );
}

function StepFunding({ draft, set }: StepProps) {
  const fee = Math.round(draft.goal * 0.05);
  const processing = Math.round(draft.goal * 0.029);
  return (
    <div className="grid gap-6 lg:grid-cols-5">
      <div className="lg:col-span-3">
        <Card title="Funding" description="Set a realistic goal that covers everything you need to deliver.">
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="sm:col-span-2">
              <Field label="Funding goal">
                <div className="relative">
                  <span className="absolute top-1/2 left-4 -translate-y-1/2 font-semibold text-slate-400">€</span>
                  <input type="number" min={500} className={cn(input, "pl-9 text-lg font-bold")} value={draft.goal || ""} onChange={(e) => set("goal", Number(e.target.value))} />
                </div>
              </Field>
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-900">Currency</p>
              <Dropdown
                className="mt-2"
                value={draft.currency}
                onChange={(v) => set("currency", v)}
                options={[
                  { value: "EUR", label: "EUR — Euro" },
                  { value: "GBP", label: "GBP — Pound" },
                  { value: "USD", label: "USD — Dollar" },
                  { value: "SEK", label: "SEK — Krona" },
                ]}
              />
            </div>
          </div>
          {draft.goal > 0 && draft.goal < 500 && <p className="text-sm text-rose-600">Minimum goal is €500.</p>}

          <Field label={`Campaign duration: ${draft.duration} days`} hint="Campaigns of 30 days or less have higher success rates.">
            <input type="range" min={7} max={60} value={draft.duration} onChange={(e) => set("duration", Number(e.target.value))} className="w-full accent-brand-600" />
            <span className="mt-1 flex justify-between text-xs text-slate-400"><span>7 days</span><span>30</span><span>60 days</span></span>
          </Field>

          <div>
            <p className="text-sm font-semibold text-slate-900">Funding type</p>
            <div className="mt-2 grid gap-3 sm:grid-cols-2">
              {(
                [
                  { v: "All-or-Nothing", t: "All-or-Nothing", d: "Backers are only charged if you reach your goal. Builds trust and urgency.", tag: "Recommended" },
                  { v: "Flexible Funding", t: "Flexible Funding", d: "Keep everything you raise, even if you don't hit your goal.", tag: "" },
                ] as const
              ).map((o) => (
                <button
                  type="button"
                  key={o.v}
                  onClick={() => set("fundingType", o.v)}
                  className={cn("rounded-2xl border-2 p-4 text-left transition", draft.fundingType === o.v ? "border-brand-600 bg-brand-50/50" : "border-slate-100 hover:border-slate-200")}
                >
                  <span className="flex items-center justify-between">
                    <span className="font-bold text-slate-900">{o.t}</span>
                    {o.tag && <span className="rounded-full bg-brand-600 px-2 py-0.5 text-[11px] font-semibold text-white">{o.tag}</span>}
                  </span>
                  <span className="mt-1 block text-sm text-slate-500">{o.d}</span>
                </button>
              ))}
            </div>
          </div>
        </Card>
      </div>
      <div className="lg:col-span-2">
        <Card title="Estimated payout">
          <div className="space-y-3 text-sm">
            <Row l="Funding goal" r={formatMoney(draft.goal)} />
            <Row l="Platform fee (5%)" r={`− ${formatMoney(fee)}`} />
            <Row l="Payment processing (~2.9%)" r={`− ${formatMoney(processing)}`} />
            <div className="flex justify-between border-t border-slate-100 pt-3 text-base">
              <span className="font-semibold">You receive</span>
              <span className="font-extrabold text-brand-700">{formatMoney(draft.goal - fee - processing)}</span>
            </div>
          </div>
          <p className="text-xs text-slate-400">Fees are only charged if your campaign is successfully funded.</p>
        </Card>
      </div>
    </div>
  );
}

function Row({ l, r }: { l: string; r: string }) {
  return (
    <div className="flex justify-between">
      <span className="text-slate-500">{l}</span>
      <span className="font-semibold text-slate-900">{r}</span>
    </div>
  );
}

function StepStory({ draft, set }: StepProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const exec = (cmd: string, value?: string) => {
    editorRef.current?.focus();
    document.execCommand(cmd, false, value);
  };
  const tools = [
    { Icon: Heading2, label: "Heading", run: () => exec("formatBlock", "h2") },
    { Icon: Bold, label: "Bold", run: () => exec("bold") },
    { Icon: Italic, label: "Italic", run: () => exec("italic") },
    { Icon: List, label: "Bullet list", run: () => exec("insertUnorderedList") },
    { Icon: ListOrdered, label: "Numbered list", run: () => exec("insertOrderedList") },
    { Icon: Quote, label: "Quote", run: () => exec("formatBlock", "blockquote") },
    { Icon: Link2, label: "Link", run: () => exec("createLink", "https://") },
  ];
  const sampleImages = ["1466692476868-aef1dfb1e735", "1459411552884-841db9b3cc2a", "1416879595882-3373a0480b5b"];

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <div className="lg:col-span-2">
        <Card title="Campaign story" description="Explain what you're making, why it matters and how you'll deliver it.">
          <div className="overflow-hidden rounded-2xl border border-slate-200 focus-within:border-brand-500 focus-within:ring-4 focus-within:ring-brand-500/10">
            <div className="flex flex-wrap gap-1 border-b border-slate-100 bg-slate-50 p-2">
              {tools.map(({ Icon, label, run }) => (
                <button key={label} type="button" onMouseDown={(e) => e.preventDefault()} onClick={run} title={label} className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-600 transition hover:bg-white hover:text-slate-900 hover:shadow-sm">
                  <Icon className="h-4 w-4" />
                </button>
              ))}
              <span className="mx-1 w-px bg-slate-200" />
              <button type="button" onClick={() => set("storyImages", [...draft.storyImages, sampleImages[draft.storyImages.length % 3]])} className="flex h-9 items-center gap-1.5 rounded-lg px-2.5 text-sm font-medium text-slate-600 hover:bg-white hover:shadow-sm">
                <ImagePlus className="h-4 w-4" /> Image
              </button>
              <button type="button" onClick={() => set("videoUrl", "https://youtu.be/demo-pitch")} className="flex h-9 items-center gap-1.5 rounded-lg px-2.5 text-sm font-medium text-slate-600 hover:bg-white hover:shadow-sm">
                <Video className="h-4 w-4" /> Video
              </button>
            </div>
            <div
              ref={editorRef}
              contentEditable
              suppressContentEditableWarning
              data-placeholder="Start with the story behind your idea…"
              onInput={(e) => set("story", (e.target as HTMLDivElement).innerText)}
              className="prose-story min-h-72 p-5 text-slate-700 outline-none [&_blockquote]:border-l-4 [&_blockquote]:border-brand-300 [&_blockquote]:pl-4 [&_blockquote]:italic [&_h2]:!mt-2 [&_h2]:text-xl [&_ol]:list-decimal [&_ol]:pl-6 [&_ul]:list-disc [&_ul]:pl-6"
            >
              <h2>Why we built Verdant Mini</h2>
              <p>Most of us spend 8+ hours a day at a desk. Verdant Mini brings a little bit of nature — and fresh basil — within arm&apos;s reach.</p>
            </div>
          </div>

          {draft.videoUrl && (
            <div className="flex items-center gap-3 rounded-2xl bg-slate-900 p-4 text-white">
              <Video className="h-5 w-5 text-brand-400" />
              <span className="flex-1 truncate text-sm">{draft.videoUrl}</span>
              <button onClick={() => set("videoUrl", "")} className="text-slate-400 hover:text-white" aria-label="Remove video"><Trash2 className="h-4 w-4" /></button>
            </div>
          )}
          {draft.storyImages.length > 0 && (
            <div className="grid grid-cols-3 gap-3">
              {draft.storyImages.map((src, i) => (
                <div key={i} className="group relative">
                  <SmartImage src={src} alt={`Story image ${i + 1}`} width={400} className="aspect-square rounded-2xl" />
                  <button
                    onClick={() => set("storyImages", draft.storyImages.filter((_, j) => j !== i))}
                    className="absolute top-2 right-2 rounded-full bg-white/90 p-1.5 text-slate-600 opacity-0 shadow transition group-hover:opacity-100"
                    aria-label="Remove image"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
      <div>
        <Card title="Project details">
          {[
            ["The problem", "What need or gap does your project address?"],
            ["Your solution", "How does it work and why is it better?"],
            ["Risks & challenges", "Be honest — backers appreciate transparency."],
          ].map(([l, p]) => (
            <Field key={l} label={l}>
              <textarea className={cn(input, "h-24 resize-none py-3 text-sm")} placeholder={p} />
            </Field>
          ))}
        </Card>
      </div>
    </div>
  );
}

function StepRewards({ draft, set }: StepProps) {
  const update = (id: string, patch: Partial<Reward>) => set("rewards", draft.rewards.map((r) => (r.id === id ? { ...r, ...patch } : r)));
  const add = () =>
    set("rewards", [
      ...draft.rewards,
      { id: `n${Date.now()}`, amount: 99, title: "Premium Supporter", description: "The premium edition with limited-edition packaging.", items: ["Premium version", "Limited-edition packaging", "Name listed as supporter"], delivery: "February 2027", backers: 0, limit: 200 },
    ]);
  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Reward tiers</h2>
          <p className="text-slate-500">Most successful campaigns offer 3–6 tiers, with an early-bird option.</p>
        </div>
        <Button onClick={add}><Plus className="h-4 w-4" /> Add reward tier</Button>
      </div>
      {draft.rewards.map((r, idx) => (
        <section key={r.id} className="grid gap-6 rounded-3xl border border-slate-100 bg-white p-6 shadow-soft lg:grid-cols-5">
          <div className="space-y-4 lg:col-span-3">
            <div className="flex items-center justify-between">
              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600">Tier {idx + 1}</span>
              <button onClick={() => set("rewards", draft.rewards.filter((x) => x.id !== r.id))} className="flex items-center gap-1 text-sm font-medium text-rose-600 hover:underline" disabled={draft.rewards.length === 1}>
                <Trash2 className="h-4 w-4" /> Remove
              </button>
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              <Field label="Amount (€)">
                <input type="number" className={input} value={r.amount} onChange={(e) => update(r.id, { amount: Number(e.target.value) })} />
              </Field>
              <div className="sm:col-span-2">
                <Field label="Reward title">
                  <input className={input} value={r.title} onChange={(e) => update(r.id, { title: e.target.value })} />
                </Field>
              </div>
            </div>
            <Field label="Description">
              <input className={input} value={r.description} onChange={(e) => update(r.id, { description: e.target.value })} />
            </Field>
            <Field label="Included items" hint="One per line">
              <textarea className={cn(input, "h-24 resize-none py-3")} value={r.items.join("\n")} onChange={(e) => update(r.id, { items: e.target.value.split("\n") })} />
            </Field>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Estimated delivery">
                <input className={input} value={r.delivery} onChange={(e) => update(r.id, { delivery: e.target.value })} />
              </Field>
              <Field label="Quantity limit" hint="Leave empty for unlimited">
                <input type="number" className={input} value={r.limit ?? ""} onChange={(e) => update(r.id, { limit: e.target.value ? Number(e.target.value) : null })} />
              </Field>
            </div>
          </div>
          <div className="lg:col-span-2">
            <p className="mb-3 text-xs font-semibold tracking-wider text-slate-400 uppercase">Live preview</p>
            <RewardCard reward={{ ...r, items: r.items.filter(Boolean) }} />
          </div>
        </section>
      ))}
    </div>
  );
}

function StepPreview({ draft }: { draft: Draft }) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between rounded-2xl bg-sky-50 p-4 text-sm text-sky-800">
        <span>This is how backers will see your campaign. Review everything before publishing.</span>
      </div>
      <div className="overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-lift">
        <div className="grid lg:grid-cols-5">
          <SmartImage src={draft.image} alt={draft.title} width={1200} className="aspect-video lg:col-span-3 lg:aspect-auto lg:min-h-96" />
          <div className="p-6 sm:p-8 lg:col-span-2">
            <span className="rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-700">{categoryName(draft.category)}</span>
            <h2 className="mt-3 text-2xl font-extrabold text-slate-900">{draft.title}</h2>
            <p className="mt-2 text-slate-500">{draft.description}</p>
            <p className="mt-3 text-sm text-slate-400">{draft.location} · by Sofia Martins</p>
            <p className="mt-6 text-3xl font-extrabold text-brand-700">{formatMoney(0)}</p>
            <p className="text-sm text-slate-500">raised of {formatMoney(draft.goal)} goal</p>
            <ProgressBar value={0} className="mt-4" />
            <div className="mt-4 grid grid-cols-3 text-center text-sm">
              <div><p className="font-bold">0%</p><p className="text-slate-500">funded</p></div>
              <div><p className="font-bold">0</p><p className="text-slate-500">backers</p></div>
              <div><p className="font-bold">{draft.duration}</p><p className="text-slate-500">days</p></div>
            </div>
            <Button className="mt-6 w-full" disabled>Back This Project</Button>
          </div>
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        {[
          ["Funding type", draft.fundingType],
          ["Duration", `${draft.duration} days`],
          ["Reward tiers", `${draft.rewards.length} tiers`],
        ].map(([l, v]) => (
          <div key={l} className="rounded-2xl border border-slate-100 bg-white p-4">
            <p className="text-xs text-slate-500">{l}</p>
            <p className="font-bold text-slate-900">{v}</p>
          </div>
        ))}
      </div>
      <div className="grid gap-6 pt-3 sm:grid-cols-2 lg:grid-cols-3">
        {draft.rewards.map((r) => (
          <RewardCard key={r.id} reward={{ ...r, items: r.items.filter(Boolean) }} />
        ))}
      </div>
    </div>
  );
}

function StepPublished({ draft }: { draft: Draft }) {
  return (
    <div className="mx-auto max-w-2xl py-8 text-center">
      <div className="relative mx-auto w-fit">
        <div className="absolute inset-0 animate-ping rounded-full bg-brand-200 opacity-50" />
        <div className="relative flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-brand-500 to-teal-400 text-white shadow-xl shadow-brand-500/30">
          <PartyPopper className="h-11 w-11" />
        </div>
      </div>
      <h1 className="mt-8 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">Your campaign has been submitted! 🎉</h1>
      <p className="mt-3 text-lg text-slate-500">
        <b className="text-slate-800">{draft.title}</b> is now under review. Our team usually approves campaigns within 1–2 business days — we&apos;ll email you the moment it goes live.
      </p>
      <div className="mt-8 rounded-3xl border border-slate-100 bg-white p-6 text-left shadow-soft">
        <p className="font-bold text-slate-900">What happens next</p>
        <ol className="mt-4 space-y-4">
          {[
            ["Review", "Our Trust & Safety team checks your campaign against our guidelines.", true],
            ["Go live", `Your ${draft.duration}-day campaign starts as soon as it's approved.`, false],
            ["Share", "Tell friends, family and your community — the first 48 hours matter most.", false],
          ].map(([t, d, done], i) => (
            <li key={t as string} className="flex gap-3">
              <span className={cn("flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold", done ? "bg-amber-100 text-amber-700" : "bg-slate-100 text-slate-500")}>{i + 1}</span>
              <div>
                <p className="font-semibold text-slate-900">{t}{done && <span className="ml-2 rounded-full bg-amber-50 px-2 py-0.5 text-xs text-amber-700">In progress</span>}</p>
                <p className="text-sm text-slate-500">{d}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
      <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
        <ButtonLink href="/dashboard/campaigns" size="lg">Go to My Campaigns</ButtonLink>
        <ButtonLink href="/campaign/verdant-indoor-garden" size="lg" variant="outline"><ExternalLink className="h-4 w-4" /> View a live example</ButtonLink>
      </div>
      <p className="mt-6 text-sm text-slate-400">
        Need help? Visit the <Link href="/how-it-works" className="font-semibold text-brand-700 hover:underline">creator handbook</Link>.
      </p>
    </div>
  );
}
