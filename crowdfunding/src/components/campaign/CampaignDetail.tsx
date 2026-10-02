"use client";

import Link from "next/link";
import { useState } from "react";
import {
  AlertTriangle,
  BadgeCheck,
  Bookmark,
  CalendarDays,
  Check,
  ChevronDown,
  ChevronRight,
  Clock,
  Copy,
  Flag,
  Heart,
  Lightbulb,
  Mail,
  MapPin,
  MessageCircle,
  Play,
  Send,
  Share2,
  ShieldCheck,
  Tag,
  Target,
  ThumbsUp,
  Users,
  Zap,
} from "lucide-react";
import { useApp } from "@/context/AppContext";
import { Avatar } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import { CampaignBadge } from "@/components/ui/Badge";
import { Modal } from "@/components/ui/Modal";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { SmartImage } from "@/components/ui/SmartImage";
import { Tabs } from "@/components/ui/Tabs";
import { FacebookIcon, LinkedInIcon, XIcon } from "@/components/ui/SocialIcons";
import { CreatorCard } from "@/components/CreatorCard";
import { RewardCard } from "@/components/RewardCard";
import { CampaignCard } from "@/components/CampaignCard";
import {
  campaigns,
  categoryName,
  formatMoney,
  getBreakdown,
  getCreator,
  getFaqs,
  getRewards,
  getTimeline,
  getUpdates,
  percentFunded,
  sampleBackers,
  sampleComments,
  teamMembers,
} from "@/lib/data";
import type { Campaign } from "@/lib/types";
import { cn } from "@/lib/cn";

export function CampaignDetail({ campaign }: { campaign: Campaign }) {
  const { isSaved, toggleSave, openContribution } = useApp();
  const creator = getCreator(campaign.creatorId);
  const rewards = getRewards(campaign);
  const faqs = getFaqs(campaign);
  const updates = getUpdates(campaign);
  const pct = percentFunded(campaign);
  const saved = isSaved(campaign.id);

  const [tab, setTab] = useState("campaign");
  const [shareOpen, setShareOpen] = useState(false);
  const [videoOpen, setVideoOpen] = useState(false);
  const [activeImage, setActiveImage] = useState(campaign.image);

  const images = [campaign.image, ...campaign.gallery];
  const related = campaigns.filter((c) => c.id !== campaign.id && (c.category === campaign.category || c.trending)).slice(0, 3);

  const tabs = [
    { id: "campaign", label: "Campaign" },
    { id: "updates", label: "Updates", count: updates.length },
    { id: "rewards", label: "Rewards", count: rewards.length },
    { id: "faq", label: "FAQ", count: faqs.length },
    { id: "comments", label: "Comments", count: 128 },
    { id: "backers", label: "Backers", count: campaign.backers },
  ];

  return (
    <div className="pb-24 lg:pb-0">
      <div className="mx-auto max-w-7xl px-4 pt-6 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1 text-sm text-slate-500">
          <Link href="/explore" className="hover:text-slate-900">Discover</Link>
          <ChevronRight className="h-4 w-4" />
          <Link href={`/categories/${campaign.category}`} className="hover:text-slate-900">{categoryName(campaign.category)}</Link>
          <ChevronRight className="h-4 w-4" />
          <span className="truncate text-slate-900">{campaign.title}</span>
        </nav>

        {/* Title */}
        <div className="mt-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <div className="flex flex-wrap gap-2">
              {campaign.badges.map((b) => (
                <CampaignBadge key={b} type={b} />
              ))}
            </div>
            <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">{campaign.title}</h1>
            <p className="mt-3 text-lg text-slate-600">{campaign.tagline}</p>
            <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-slate-500">
              <span className="flex items-center gap-2">
                <Avatar src={creator.avatar} name={creator.name} size={28} />
                <span className="font-semibold text-slate-800">{creator.name}</span>
                {creator.verified && <BadgeCheck className="h-4 w-4 text-brand-600" />}
              </span>
              <span className="flex items-center gap-1.5"><MapPin className="h-4 w-4" /> {campaign.location}</span>
              <Link href={`/categories/${campaign.category}`} className="flex items-center gap-1.5 hover:text-brand-700">
                <Tag className="h-4 w-4" /> {categoryName(campaign.category)}
              </Link>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setShareOpen(true)}>
              <Share2 className="h-4 w-4" /> Share
            </Button>
            <Button variant="outline" onClick={() => toggleSave(campaign.id, campaign.title)} aria-pressed={saved} className={saved ? "border-rose-200 bg-rose-50 text-rose-600 hover:bg-rose-50" : ""}>
              <Heart className={cn("h-4 w-4", saved && "fill-current")} /> {saved ? "Saved" : "Save"}
            </Button>
          </div>
        </div>

        {/* Media + funding */}
        <div className="mt-8 grid gap-8 lg:grid-cols-12">
          <div className="min-w-0 lg:col-span-8">
            <div className="group relative aspect-video overflow-hidden rounded-3xl shadow-soft">
              <SmartImage src={activeImage} alt={campaign.title} width={1600} className="h-full w-full" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
              <button
                onClick={() => setVideoOpen(true)}
                className="absolute top-1/2 left-1/2 flex h-20 w-20 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white/95 text-slate-900 shadow-2xl transition hover:scale-110"
                aria-label="Play campaign video"
              >
                <Play className="ml-1 h-8 w-8 fill-current" />
              </button>
              <span className="absolute bottom-4 left-4 rounded-full bg-black/50 px-3 py-1 text-xs font-semibold text-white backdrop-blur">▶ Campaign video · 2:47</span>
            </div>
            <div className="no-scrollbar mt-3 flex gap-3 overflow-x-auto">
              {images.map((src) => (
                <button
                  key={src}
                  onClick={() => setActiveImage(src)}
                  className={cn("h-16 w-24 shrink-0 overflow-hidden rounded-xl ring-2 transition sm:h-20 sm:w-32", activeImage === src ? "ring-brand-500" : "ring-transparent opacity-70 hover:opacity-100")}
                >
                  <SmartImage src={src} alt={`${campaign.title} gallery`} width={300} className="h-full w-full" />
                </button>
              ))}
            </div>
          </div>

          <aside className="min-w-0 lg:col-span-4">
            <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-lift lg:sticky lg:top-24">
              <p className="text-4xl font-extrabold tracking-tight text-brand-700">{formatMoney(campaign.raised)}</p>
              <p className="mt-1 text-slate-500">raised of <span className="font-semibold text-slate-800">{formatMoney(campaign.goal)}</span> goal</p>
              <ProgressBar value={pct} size="lg" className="mt-5" />
              <div className="mt-5 grid grid-cols-3 divide-x divide-slate-100 text-center">
                <Stat value={`${pct}%`} label="funded" />
                <Stat value={campaign.backers.toLocaleString()} label="backers" />
                <Stat value={campaign.daysLeft.toString()} label="days remaining" />
              </div>
              <Button size="lg" className="mt-6 w-full text-base" onClick={() => openContribution(campaign.id)}>
                <Zap className="h-5 w-5" /> Back This Project
              </Button>
              <Button variant="secondary" size="lg" className="mt-3 w-full" onClick={() => setShareOpen(true)}>
                <Share2 className="h-4 w-4" /> Share Campaign
              </Button>
              <div className="mt-5 space-y-2.5 rounded-2xl bg-slate-50 p-4 text-sm">
                <p className="flex items-start gap-2 text-slate-600">
                  <Target className="mt-0.5 h-4 w-4 shrink-0 text-brand-600" />
                  <span>
                    <b className="text-slate-800">{campaign.fundingType}.</b>{" "}
                    {campaign.fundingType === "All-or-Nothing" ? "You're only charged if the goal is reached by 23 Oct 2026." : "The creator receives all funds raised."}
                  </span>
                </p>
                <p className="flex items-start gap-2 text-slate-600">
                  <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-brand-600" />
                  Covered by the Fundora Guarantee.
                </p>
              </div>
              <button className="mt-4 flex w-full items-center justify-center gap-1.5 text-xs text-slate-400 hover:text-slate-600">
                <Flag className="h-3.5 w-3.5" /> Report this campaign
              </button>
            </div>
          </aside>
        </div>
      </div>

      {/* Tabs */}
      <div className="sticky top-[72px] z-30 mt-12 border-b border-slate-200 bg-white/90 backdrop-blur-xl">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Tabs tabs={tabs} active={tab} onChange={setTab} className="border-0" />
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        {tab === "campaign" && (
          <div className="grid gap-10 lg:grid-cols-12">
            <article className="prose-story min-w-0 lg:col-span-8">
              <Story campaign={campaign} />
            </article>
            <aside className="min-w-0 space-y-6 lg:col-span-4">
              <CreatorCard creator={creator} />
              <div className="space-y-4 lg:sticky lg:top-40">
                <h3 className="font-bold text-slate-900">Support this project</h3>
                {rewards.slice(0, 3).map((r, i) => (
                  <RewardCard key={r.id} reward={r} compact featured={i === 1} onSelect={() => openContribution(campaign.id, r.id)} />
                ))}
                <button onClick={() => setTab("rewards")} className="w-full text-center text-sm font-semibold text-brand-700 hover:underline">
                  See all {rewards.length} rewards
                </button>
              </div>
            </aside>
          </div>
        )}

        {tab === "updates" && (
          <div className="mx-auto max-w-3xl space-y-5">
            {updates.map((u) => (
              <article key={u.id} className="rounded-3xl border border-slate-100 bg-white p-6 shadow-soft transition hover:shadow-lift">
                <div className="flex items-center gap-3 text-sm">
                  <span className="rounded-full bg-brand-50 px-2.5 py-0.5 text-xs font-semibold text-brand-700">Update #{u.id}</span>
                  <span className="flex items-center gap-1 text-slate-500"><CalendarDays className="h-4 w-4" /> {u.date}</span>
                </div>
                <h3 className="mt-3 text-xl font-bold text-slate-900">{u.title}</h3>
                <p className="mt-2 leading-relaxed text-slate-600">{u.excerpt}</p>
                <div className="mt-4 flex items-center gap-5 border-t border-slate-100 pt-4 text-sm text-slate-500">
                  <span className="flex items-center gap-1.5"><ThumbsUp className="h-4 w-4" /> {u.likes}</span>
                  <span className="flex items-center gap-1.5"><MessageCircle className="h-4 w-4" /> {u.comments}</span>
                  <button className="ml-auto font-semibold text-brand-700 hover:underline">Read more →</button>
                </div>
              </article>
            ))}
          </div>
        )}

        {tab === "rewards" && (
          <div>
            <div className="mb-8 max-w-2xl">
              <h2 className="text-2xl font-bold text-slate-900">Choose your reward</h2>
              <p className="mt-1 text-slate-500">Pick a tier to back this project. You can also contribute any amount without a reward.</p>
            </div>
            <div className="grid gap-6 pt-3 sm:grid-cols-2 lg:grid-cols-4">
              {rewards.map((r, i) => (
                <RewardCard key={r.id} reward={r} featured={i === 1} onSelect={() => openContribution(campaign.id, r.id)} />
              ))}
            </div>
          </div>
        )}

        {tab === "faq" && <Faq faqs={faqs} />}
        {tab === "comments" && <Comments />}
        {tab === "backers" && <Backers total={campaign.backers} />}
      </div>

      {/* Related */}
      <section className="mx-auto max-w-7xl px-4 pt-6 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold text-slate-900">You might also like</h2>
        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {related.map((c) => (
            <CampaignCard key={c.id} campaign={c} />
          ))}
        </div>
      </section>

      {/* Mobile sticky CTA */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-slate-200 bg-white/95 p-3 backdrop-blur lg:hidden">
        <div className="mx-auto flex max-w-xl items-center gap-3">
          <div className="min-w-0 flex-1">
            <p className="text-sm font-bold text-slate-900">{formatMoney(campaign.raised)} <span className="font-normal text-slate-500">· {pct}%</span></p>
            <ProgressBar value={pct} size="sm" className="mt-1" />
          </div>
          <Button onClick={() => openContribution(campaign.id)}>Back This Project</Button>
        </div>
      </div>

      <ShareModal open={shareOpen} onClose={() => setShareOpen(false)} campaign={campaign} />
      <Modal open={videoOpen} onClose={() => setVideoOpen(false)} title="Campaign video" size="lg">
        <div className="relative flex aspect-video items-center justify-center overflow-hidden rounded-2xl bg-slate-900">
          <SmartImage src={campaign.image} alt={campaign.title} className="absolute inset-0 h-full w-full opacity-40" />
          <div className="relative text-center text-white">
            <Play className="mx-auto h-14 w-14" />
            <p className="mt-3 font-semibold">Video placeholder</p>
            <p className="text-sm text-white/70">The creator&apos;s pitch video would play here.</p>
          </div>
        </div>
      </Modal>
    </div>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="px-2">
      <p className="text-xl font-bold text-slate-900">{value}</p>
      <p className="text-xs text-slate-500">{label}</p>
    </div>
  );
}

function Story({ campaign }: { campaign: Campaign }) {
  const timeline = getTimeline(campaign);
  const breakdown = getBreakdown(campaign);
  const featureIcons = [Zap, ShieldCheck, Lightbulb, Check];
  return (
    <>
      <h2 className="!mt-0">About this project</h2>
      <p className="text-lg">{campaign.story.intro}</p>

      <SmartImage src={campaign.gallery[0]} alt={`${campaign.title} — overview`} width={1400} className="mt-8 aspect-[16/9] w-full rounded-3xl" />
      <p className="!mt-2 text-center text-sm !text-slate-400">Early prototype, photographed in our studio.</p>

      <div className="mt-10 grid gap-5 sm:grid-cols-2">
        <div className="rounded-3xl border border-rose-100 bg-rose-50/60 p-6">
          <p className="flex items-center gap-2 text-sm font-bold tracking-wider text-rose-600 uppercase"><AlertTriangle className="h-4 w-4" /> The problem</p>
          <p className="!mt-3 text-slate-700">{campaign.story.problem}</p>
        </div>
        <div className="rounded-3xl border border-brand-100 bg-brand-50/60 p-6">
          <p className="flex items-center gap-2 text-sm font-bold tracking-wider text-brand-700 uppercase"><Lightbulb className="h-4 w-4" /> Our solution</p>
          <p className="!mt-3 text-slate-700">{campaign.story.solution}</p>
        </div>
      </div>

      <h2>Key features</h2>
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {campaign.story.features.map((f, i) => {
          const Icon = featureIcons[i % featureIcons.length];
          return (
            <div key={f.title} className="rounded-3xl border border-slate-100 bg-white p-6 shadow-soft">
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-50 text-brand-600"><Icon className="h-5 w-5" /></span>
              <h3 className="mt-4 font-bold text-slate-900">{f.title}</h3>
              <p className="!mt-1 text-sm">{f.text}</p>
            </div>
          );
        })}
      </div>

      <div className="mt-10 grid grid-cols-2 gap-4">
        <SmartImage src={campaign.gallery[1]} alt={`${campaign.title} detail`} width={800} className="aspect-square rounded-3xl" />
        <SmartImage src={campaign.gallery[2]} alt={`${campaign.title} in use`} width={800} className="aspect-square rounded-3xl" />
      </div>

      <h2>Development timeline</h2>
      <ol className="mt-6 space-y-0">
        {timeline.map((t, i) => (
          <li key={t.title} className="relative flex gap-4 pb-8 last:pb-0">
            {i < timeline.length - 1 && <span className={cn("absolute top-8 left-[15px] h-full w-0.5", t.done ? "bg-brand-300" : "bg-slate-200")} />}
            <span className={cn("relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full", t.done ? "bg-brand-600 text-white" : "border-2 border-slate-200 bg-white text-slate-400")}>
              {t.done ? <Check className="h-4 w-4" /> : <Clock className="h-4 w-4" />}
            </span>
            <div>
              <p className="text-xs font-bold tracking-wider text-slate-400 uppercase">{t.date}</p>
              <p className="font-bold text-slate-900">{t.title}</p>
              <p className="!mt-0.5 text-sm">{t.text}</p>
            </div>
          </li>
        ))}
      </ol>

      <h2>Meet the team</h2>
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {teamMembers.map((m) => (
          <div key={m.name} className="flex items-center gap-4 rounded-3xl border border-slate-100 p-4">
            <Avatar src={m.avatar} name={m.name} size={56} />
            <div>
              <p className="font-bold text-slate-900">{m.name}</p>
              <p className="!mt-0 text-sm">{m.role}</p>
            </div>
          </div>
        ))}
      </div>

      <h2>Risks and challenges</h2>
      <p>
        Every ambitious project carries risk. The biggest challenges we foresee are supply-chain delays for key components and scaling from prototype to
        production quality. We&apos;ve mitigated this by securing two qualified suppliers for every critical part, budgeting a 10% contingency, and partnering
        with an experienced fulfilment company.
      </p>
      <p>
        If anything changes, you&apos;ll hear it from us first. We commit to posting an update at least every two weeks until every reward is delivered.
      </p>

      <h2>Funding breakdown</h2>
      <p>Here&apos;s exactly how your contribution will be used if we reach our {formatMoney(campaign.goal)} goal.</p>
      <div className="mt-6 flex h-4 overflow-hidden rounded-full">
        {breakdown.map((b) => (
          <span key={b.label} className={b.color} style={{ width: `${b.pct}%` }} title={`${b.label} ${b.pct}%`} />
        ))}
      </div>
      <ul className="mt-6 divide-y divide-slate-100 rounded-3xl border border-slate-100">
        {breakdown.map((b) => (
          <li key={b.label} className="flex items-center gap-3 px-5 py-4">
            <span className={cn("h-3 w-3 rounded-full", b.color)} />
            <span className="flex-1 font-medium text-slate-700">{b.label}</span>
            <span className="text-sm text-slate-400">{b.pct}%</span>
            <span className="w-24 text-right font-bold text-slate-900">{formatMoney((campaign.goal * b.pct) / 100)}</span>
          </li>
        ))}
      </ul>
    </>
  );
}

function Faq({ faqs }: { faqs: { q: string; a: string }[] }) {
  const [open, setOpen] = useState(0);
  return (
    <div className="mx-auto max-w-3xl">
      <h2 className="text-2xl font-bold text-slate-900">Frequently asked questions</h2>
      <div className="mt-6 divide-y divide-slate-100 rounded-3xl border border-slate-100 bg-white shadow-soft">
        {faqs.map((f, i) => (
          <div key={f.q}>
            <button onClick={() => setOpen(open === i ? -1 : i)} className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left font-semibold text-slate-900" aria-expanded={open === i}>
              {f.q}
              <ChevronDown className={cn("h-5 w-5 shrink-0 text-slate-400 transition", open === i && "rotate-180")} />
            </button>
            {open === i && <p className="-mt-1 px-6 pb-5 leading-relaxed text-slate-600 animate-fade-up">{f.a}</p>}
          </div>
        ))}
      </div>
      <div className="mt-6 flex items-center justify-between gap-4 rounded-3xl bg-slate-50 p-6">
        <p className="text-slate-600">Don&apos;t see your question?</p>
        <Button variant="outline"><Mail className="h-4 w-4" /> Ask the creator</Button>
      </div>
    </div>
  );
}

function Comments() {
  const { toast } = useApp();
  const [comments, setComments] = useState(sampleComments);
  const [text, setText] = useState("");
  return (
    <div className="mx-auto max-w-3xl">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (!text.trim()) return;
          setComments([{ name: "Sofia Martins", avatar: "1438761681033-6461ffad8d80", time: "Just now", text, backer: true, likes: 0 }, ...comments]);
          setText("");
          toast({ title: "Comment posted" });
        }}
        className="flex gap-3 rounded-3xl border border-slate-100 bg-white p-4 shadow-soft"
      >
        <Avatar src="1438761681033-6461ffad8d80" name="Sofia Martins" size={40} />
        <div className="flex-1">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={2}
            placeholder="Share your thoughts or ask the creator a question…"
            className="w-full resize-none rounded-2xl border-0 bg-slate-50 p-3 text-sm outline-none focus:ring-2 focus:ring-brand-500/20"
          />
          <div className="mt-2 flex justify-end">
            <Button size="sm" type="submit" disabled={!text.trim()}><Send className="h-4 w-4" /> Post comment</Button>
          </div>
        </div>
      </form>
      <ul className="mt-6 space-y-4">
        {comments.map((c, i) => (
          <li key={i} className="rounded-3xl border border-slate-100 bg-white p-5 animate-fade-up">
            <div className="flex items-center gap-3">
              <Avatar src={c.avatar} name={c.name} size={40} />
              <div>
                <p className="flex items-center gap-2 font-semibold text-slate-900">
                  {c.name}
                  {c.backer && <span className="rounded-full bg-brand-50 px-2 py-0.5 text-[11px] font-semibold text-brand-700">Backer</span>}
                </p>
                <p className="text-xs text-slate-400">{c.time}</p>
              </div>
            </div>
            <p className="mt-3 text-slate-700">{c.text}</p>
            {"reply" in c && c.reply && (
              <div className="mt-3 rounded-2xl border-l-4 border-brand-400 bg-brand-50/50 p-3 text-sm text-slate-700">
                <span className="font-semibold text-brand-700">Creator reply · </span>
                {c.reply}
              </div>
            )}
            <div className="mt-3 flex gap-4 text-sm text-slate-500">
              <button className="flex items-center gap-1 hover:text-brand-700"><ThumbsUp className="h-4 w-4" /> {c.likes}</button>
              <button className="hover:text-brand-700">Reply</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

function Backers({ total }: { total: number }) {
  return (
    <div className="mx-auto max-w-3xl">
      <div className="flex items-end justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">{total.toLocaleString()} backers</h2>
          <p className="text-slate-500">People from 46 countries are supporting this project.</p>
        </div>
        <Users className="h-10 w-10 text-brand-200" />
      </div>
      <ul className="mt-6 divide-y divide-slate-100 rounded-3xl border border-slate-100 bg-white shadow-soft">
        {sampleBackers.map((b, i) => (
          <li key={i} className="flex items-center gap-4 px-5 py-4">
            <Avatar src={b.avatar} name={b.name === "Anonymous" ? "?" : b.name} size={40} />
            <div className="flex-1">
              <p className="font-semibold text-slate-900">{b.name}</p>
              <p className="text-xs text-slate-400">{b.location} · {b.time}</p>
            </div>
            <span className="font-bold text-slate-900">{formatMoney(b.amount)}</span>
          </li>
        ))}
      </ul>
      <p className="mt-4 text-center text-sm text-slate-400">Showing the 8 most recent backers</p>
    </div>
  );
}

function ShareModal({ open, onClose, campaign }: { open: boolean; onClose: () => void; campaign: Campaign }) {
  const { toast } = useApp();
  const url = `https://fundora.app/campaign/${campaign.id}`;
  return (
    <Modal open={open} onClose={onClose} title="Share this campaign" description="Campaigns shared by backers raise 3× more on average." size="sm">
      <div className="grid grid-cols-4 gap-3">
        {[
          { label: "X", Icon: XIcon, cls: "bg-slate-900 text-white" },
          { label: "Facebook", Icon: FacebookIcon, cls: "bg-[#1877F2] text-white" },
          { label: "LinkedIn", Icon: LinkedInIcon, cls: "bg-[#0A66C2] text-white" },
          { label: "Email", Icon: Mail, cls: "bg-slate-100 text-slate-700" },
        ].map(({ label, Icon, cls }) => (
          <button
            key={label}
            onClick={() => {
              toast({ title: `Shared on ${label}`, description: campaign.title });
              onClose();
            }}
            className="flex flex-col items-center gap-2 text-xs font-medium text-slate-600"
          >
            <span className={cn("flex h-14 w-14 items-center justify-center rounded-2xl transition hover:scale-105", cls)}>
              <Icon className="h-6 w-6" />
            </span>
            {label}
          </button>
        ))}
      </div>
      <div className="mt-6 flex items-center gap-2 rounded-2xl border border-slate-200 p-1.5 pl-4">
        <Bookmark className="h-4 w-4 shrink-0 text-slate-400" />
        <span className="flex-1 truncate text-sm text-slate-600">{url}</span>
        <Button
          size="sm"
          onClick={() => {
            navigator.clipboard?.writeText(url).catch(() => {});
            toast({ title: "Link copied to clipboard" });
          }}
        >
          <Copy className="h-4 w-4" /> Copy
        </Button>
      </div>
    </Modal>
  );
}
