import Link from "next/link";
import { ArrowRight, BadgeCheck, Compass, HandCoins, Megaphone, Rocket, ShieldCheck, Users } from "lucide-react";
import { Hero } from "@/components/home/Hero";
import { TrendingSection } from "@/components/home/TrendingSection";
import { CampaignCard } from "@/components/CampaignCard";
import { CategoryCard } from "@/components/CategoryCard";
import { ButtonLink } from "@/components/ui/Button";
import { campaigns, categories } from "@/lib/data";

export default function HomePage() {
  const featured = campaigns.filter((c) => c.featured).slice(0, 6);
  const count = (slug: string) => campaigns.filter((c) => c.category === slug).length;

  return (
    <>
      <Hero />

      {/* Press strip */}
      <section className="border-y border-slate-100 bg-white py-8">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-x-12 gap-y-4 px-4 text-xl font-bold tracking-tight text-slate-300 sm:px-6 lg:px-8">
          <span className="text-xs font-semibold tracking-widest text-slate-400 uppercase">As featured in</span>
          <span className="font-serif italic">The Guardian</span>
          <span>TechCrunch</span>
          <span className="tracking-[0.2em]">WIRED</span>
          <span className="font-serif">Forbes</span>
          <span>Le Monde</span>
          <span className="italic">Monocle</span>
        </div>
      </section>

      {/* Featured */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <SectionHeader eyebrow="Hand-picked" title="Featured Campaigns" description="Projects our team loves this week — vetted, verified and ready for your support." href="/explore" />
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((c, i) => (
            <div key={c.id} className="animate-fade-up" style={{ animationDelay: `${i * 60}ms` }}>
              <CampaignCard campaign={c} className="h-full" />
            </div>
          ))}
        </div>
      </section>

      <TrendingSection />

      {/* Categories */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <SectionHeader eyebrow="Explore by passion" title="Browse Categories" description="From life-saving clinics to indie games — find the ideas you care about." href="/categories" linkLabel="All categories" />
        <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {categories.slice(0, 10).map((c) => (
            <CategoryCard key={c.slug} category={c} count={count(c.slug)} variant="image" />
          ))}
        </div>
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          {categories.slice(10).map((c) => (
            <CategoryCard key={c.slug} category={c} count={count(c.slug)} />
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-[2.5rem] bg-slate-950 px-6 py-16 text-white sm:px-12 lg:px-16">
          <div className="pointer-events-none absolute -top-32 -right-32 h-96 w-96 rounded-full bg-brand-500/30 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-32 -left-20 h-80 w-80 rounded-full bg-sky-500/20 blur-3xl" />
          <div className="relative grid gap-12 lg:grid-cols-2 lg:items-center">
            <div>
              <p className="text-sm font-semibold tracking-wider text-brand-400 uppercase">For creators</p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-5xl">Your idea deserves a launch.</h2>
              <p className="mt-4 max-w-lg text-lg text-slate-300">
                Launch in minutes, reach millions of backers and keep 100% ownership. Fundora charges a simple 5% fee only when you&apos;re funded.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <ButtonLink href="/start" size="lg">
                  <Rocket className="h-5 w-5" /> Start a Campaign
                </ButtonLink>
                <ButtonLink href="/how-it-works" size="lg" variant="ghost" className="text-white hover:bg-white/10 hover:text-white">
                  How it works <ArrowRight className="h-5 w-5" />
                </ButtonLink>
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {[
                { Icon: Megaphone, title: "Tell your story", text: "Our guided builder helps you craft a page backers trust." },
                { Icon: HandCoins, title: "Offer rewards", text: "Create reward tiers, early-bird offers and stretch goals." },
                { Icon: Users, title: "Grow your crowd", text: "Built-in sharing, analytics and email updates." },
                { Icon: BadgeCheck, title: "Get funded", text: "Funds are released within 14 days of a successful campaign." },
              ].map(({ Icon, title, text }) => (
                <div key={title} className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur transition hover:bg-white/10">
                  <Icon className="h-7 w-7 text-brand-400" />
                  <h3 className="mt-4 font-semibold">{title}</h3>
                  <p className="mt-1 text-sm text-slate-400">{text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="mx-auto max-w-7xl px-4 pt-20 sm:px-6 lg:px-8">
        <div className="grid gap-6 rounded-[2rem] border border-slate-100 bg-gradient-to-br from-brand-50 to-white p-8 sm:grid-cols-2 lg:grid-cols-4 lg:p-12">
          {[
            { Icon: HandCoins, value: "€1.2B+", label: "raised by our community" },
            { Icon: Rocket, value: "86,000+", label: "projects brought to life" },
            { Icon: Users, value: "2.1M", label: "active backers" },
            { Icon: ShieldCheck, value: "94%", label: "on-time reward delivery" },
          ].map(({ Icon, value, label }) => (
            <div key={label} className="flex items-center gap-4">
              <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-brand-600 shadow-soft">
                <Icon className="h-7 w-7" />
              </span>
              <div>
                <p className="text-3xl font-extrabold tracking-tight text-slate-900">{value}</p>
                <p className="text-sm text-slate-500">{label}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}

function SectionHeader({ eyebrow, title, description, href, linkLabel = "View all" }: { eyebrow: string; title: string; description: string; href: string; linkLabel?: string }) {
  return (
    <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
      <div className="max-w-2xl">
        <p className="text-sm font-semibold tracking-wider text-brand-600 uppercase">{eyebrow}</p>
        <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">{title}</h2>
        <p className="mt-3 text-slate-500">{description}</p>
      </div>
      <Link href={href} className="inline-flex items-center gap-1.5 font-semibold text-brand-700 transition hover:gap-2.5">
        <Compass className="h-4 w-4" /> {linkLabel} <ArrowRight className="h-4 w-4" />
      </Link>
    </div>
  );
}
