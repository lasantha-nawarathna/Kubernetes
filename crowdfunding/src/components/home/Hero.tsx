import Link from "next/link";
import { ArrowRight, BadgeCheck, Heart, Plus, ShieldCheck, Sparkles } from "lucide-react";
import { ButtonLink } from "@/components/ui/Button";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { SmartImage } from "@/components/ui/SmartImage";
import { Avatar } from "@/components/ui/Avatar";
import { formatMoney, getCampaign, percentFunded } from "@/lib/data";

export function Hero() {
  const featured = getCampaign("ai-language-device")!;
  const a = getCampaign("wanderlight-game")!;
  const b = getCampaign("ocean-cleanup")!;
  const c = getCampaign("verdant-indoor-garden")!;

  return (
    <section className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-40 -right-40 h-[520px] w-[520px] rounded-full bg-brand-100/70 blur-3xl" />
        <div className="absolute top-40 -left-32 h-[380px] w-[380px] rounded-full bg-sky-100/60 blur-3xl" />
        <div className="absolute inset-0 [background-image:radial-gradient(rgb(15_23_42/0.05)_1px,transparent_1px)] [background-size:24px_24px] [mask-image:linear-gradient(to_bottom,black,transparent_80%)]" />
      </div>

      <div className="mx-auto grid max-w-7xl items-center gap-14 px-4 pt-12 pb-20 sm:px-6 lg:grid-cols-2 lg:px-8 lg:pt-20 lg:pb-28">
        <div className="animate-fade-up">
          <Link href="/explore" className="inline-flex items-center gap-2 rounded-full border border-brand-200 bg-white/80 py-1 pr-3 pl-1 text-sm font-medium text-slate-700 shadow-sm backdrop-blur transition hover:border-brand-300">
            <span className="rounded-full bg-brand-600 px-2 py-0.5 text-xs font-semibold text-white">New</span>
            €48.7M raised for 12,400+ projects this year
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
          <h1 className="mt-6 text-5xl leading-[1.05] font-extrabold tracking-tight text-slate-900 sm:text-6xl lg:text-7xl">
            Fund Ideas <br className="hidden sm:block" />
            That{" "}
            <span className="relative inline-block">
              <span className="relative z-10 bg-gradient-to-r from-brand-600 to-teal-500 bg-clip-text text-transparent">Matter</span>
              <svg className="absolute -bottom-2 left-0 z-0 w-full text-brand-200" viewBox="0 0 200 12" preserveAspectRatio="none" aria-hidden>
                <path d="M2 9c40-6 120-8 196-3" stroke="currentColor" strokeWidth="6" fill="none" strokeLinecap="round" />
              </svg>
            </span>
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-slate-600 sm:text-xl">
            Discover inspiring projects, support creative ideas, and help bring great ideas to life.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <ButtonLink href="/explore" size="lg">
              Explore Campaigns <ArrowRight className="h-5 w-5" />
            </ButtonLink>
            <ButtonLink href="/start" size="lg" variant="outline">
              <Plus className="h-5 w-5" /> Start a Campaign
            </ButtonLink>
          </div>
          <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-4">
            <div className="flex items-center gap-3">
              <div className="flex -space-x-2.5">
                {["1544005313-94ddf0286df2", "1506794778202-cad84cf45f1d", "1573496359142-b8d87734a5a2", "1500648767791-00dcc994a43e"].map((s, i) => (
                  <Avatar key={s} src={s} name={`Backer ${i}`} size={36} className="ring-2 ring-white" />
                ))}
              </div>
              <div className="text-sm">
                <p className="font-bold text-slate-900">2.1M+ backers</p>
                <p className="text-slate-500">in 140 countries</p>
              </div>
            </div>
            <div className="h-10 w-px bg-slate-200 max-sm:hidden" />
            <div className="flex items-center gap-2 text-sm">
              <ShieldCheck className="h-8 w-8 text-brand-600" />
              <div>
                <p className="font-bold text-slate-900">Fundora Guarantee</p>
                <p className="text-slate-500">Verified creators & secure pledges</p>
              </div>
            </div>
          </div>
        </div>

        {/* Collage */}
        <div className="relative mx-auto w-full max-w-xl lg:max-w-none">
          <div className="grid grid-cols-6 grid-rows-6 gap-3 sm:gap-4" style={{ aspectRatio: "1 / 1" }}>
            <Link href={`/campaign/${featured.id}`} className="group col-span-4 row-span-4 overflow-hidden rounded-3xl shadow-lift">
              <SmartImage src={featured.image} alt={featured.title} className="h-full w-full" imgClassName="transition duration-700 group-hover:scale-105" />
            </Link>
            <Link href={`/campaign/${a.id}`} className="group col-span-2 row-span-3 overflow-hidden rounded-3xl shadow-soft">
              <SmartImage src={a.image} alt={a.title} width={500} className="h-full w-full" imgClassName="transition duration-700 group-hover:scale-105" />
            </Link>
            <Link href={`/campaign/${b.id}`} className="group col-span-2 row-span-3 overflow-hidden rounded-3xl shadow-soft">
              <SmartImage src={b.image} alt={b.title} width={500} className="h-full w-full" imgClassName="transition duration-700 group-hover:scale-105" />
            </Link>
            <Link href={`/campaign/${c.id}`} className="group col-span-4 row-span-2 overflow-hidden rounded-3xl shadow-soft">
              <SmartImage src={c.image} alt={c.title} width={800} className="h-full w-full" imgClassName="transition duration-700 group-hover:scale-105" />
            </Link>
          </div>

          {/* Floating featured card */}
          <Link
            href={`/campaign/${featured.id}`}
            className="absolute -bottom-8 left-4 w-[78%] max-w-xs rounded-3xl border border-white/60 bg-white/95 p-4 shadow-lift backdrop-blur transition hover:-translate-y-1 sm:-left-6"
          >
            <div className="flex items-center gap-2 text-xs font-semibold text-brand-700">
              <Sparkles className="h-3.5 w-3.5" /> Featured campaign
            </div>
            <p className="mt-1 line-clamp-1 font-bold text-slate-900">{featured.title}</p>
            <ProgressBar value={percentFunded(featured)} className="mt-3" />
            <div className="mt-2 flex justify-between text-xs">
              <span className="font-bold text-slate-900">{formatMoney(featured.raised)} <span className="font-normal text-slate-500">raised</span></span>
              <span className="font-semibold text-brand-700">{percentFunded(featured)}%</span>
            </div>
          </Link>

          {/* Floating pledge chip */}
          <div className="absolute top-6 -right-2 hidden items-center gap-2.5 rounded-2xl bg-white p-2.5 pr-4 shadow-lift sm:flex animate-[fade-up_0.6s_0.4s_ease-out_both]">
            <Avatar src="1544005313-94ddf0286df2" name="Anna Lindqvist" size={36} />
            <div className="text-xs">
              <p className="flex items-center gap-1 font-semibold text-slate-900">
                Anna backed €99 <Heart className="h-3 w-3 fill-rose-500 text-rose-500" />
              </p>
              <p className="text-slate-500">just now · Stockholm</p>
            </div>
          </div>
          <div className="absolute top-1/2 -right-3 hidden items-center gap-2 rounded-2xl bg-slate-900 px-3.5 py-2.5 text-xs font-semibold text-white shadow-lift lg:flex animate-[fade-up_0.6s_0.7s_ease-out_both]">
            <BadgeCheck className="h-4 w-4 text-brand-400" /> 94% of projects deliver on time
          </div>
        </div>
      </div>
    </section>
  );
}
