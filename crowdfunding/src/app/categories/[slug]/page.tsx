import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight } from "lucide-react";
import { CampaignBrowser } from "@/components/CampaignBrowser";
import { CategoryIcon } from "@/components/ui/CategoryIcon";
import { SmartImage } from "@/components/ui/SmartImage";
import { campaigns, categories, compactNumber, formatMoney, getCategory } from "@/lib/data";
import { cn } from "@/lib/cn";

export function generateStaticParams() {
  return categories.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  return { title: getCategory(slug)?.name ?? "Category" };
}

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const category = getCategory(slug);
  if (!category) notFound();
  const list = campaigns.filter((c) => c.category === slug);
  const raised = list.reduce((s, c) => s + c.raised, 0);
  const backers = list.reduce((s, c) => s + c.backers, 0);

  return (
    <div>
      <section className="relative overflow-hidden">
        <SmartImage src={category.image} alt={category.name} width={1800} className="absolute inset-0 h-full w-full" />
        <div className={cn("absolute inset-0 bg-gradient-to-r opacity-90", category.color)} />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
        <div className="relative mx-auto max-w-7xl px-4 py-16 text-white sm:px-6 lg:px-8 lg:py-20">
          <nav className="flex items-center gap-1 text-sm text-white/80">
            <Link href="/" className="hover:text-white">Home</Link>
            <ChevronRight className="h-4 w-4" />
            <Link href="/categories" className="hover:text-white">Categories</Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-white">{category.name}</span>
          </nav>
          <div className="mt-6 flex items-center gap-4">
            <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/20 backdrop-blur">
              <CategoryIcon name={category.icon} className="h-8 w-8" />
            </span>
            <div>
              <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">{category.name}</h1>
              <p className="mt-1 text-lg text-white/85">{category.description}</p>
            </div>
          </div>
          <div className="mt-8 flex flex-wrap gap-3">
            {[
              { v: list.length.toString(), l: "live campaigns" },
              { v: formatMoney(raised), l: "raised" },
              { v: compactNumber(backers), l: "backers" },
            ].map((s) => (
              <span key={s.l} className="rounded-full bg-white/15 px-4 py-2 text-sm backdrop-blur">
                <b>{s.v}</b> {s.l}
              </span>
            ))}
          </div>
        </div>
      </section>
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="no-scrollbar mb-6 flex gap-2 overflow-x-auto pb-1">
          {categories.map((c) => (
            <Link
              key={c.slug}
              href={`/categories/${c.slug}`}
              className={cn(
                "flex shrink-0 items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition",
                c.slug === slug ? "border-slate-900 bg-slate-900 text-white" : "border-slate-200 bg-white text-slate-700 hover:border-brand-300",
              )}
            >
              <CategoryIcon name={c.icon} className="h-4 w-4" /> {c.name}
            </Link>
          ))}
        </div>
        <CampaignBrowser initialCategory={slug} lockCategory />
      </div>
    </div>
  );
}
