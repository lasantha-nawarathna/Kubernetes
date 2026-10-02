import type { Metadata } from "next";
import { CampaignBrowser } from "@/components/CampaignBrowser";
import { CategoryIcon } from "@/components/ui/CategoryIcon";
import { categories } from "@/lib/data";
import Link from "next/link";

export const metadata: Metadata = { title: "Explore Campaigns" };

export default async function ExplorePage({ searchParams }: { searchParams: Promise<{ q?: string; category?: string }> }) {
  const { q = "", category = "all" } = await searchParams;
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
      <div className="max-w-2xl">
        <p className="text-sm font-semibold tracking-wider text-brand-600 uppercase">Discover</p>
        <h1 className="mt-2 text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">Explore Campaigns</h1>
        <p className="mt-3 text-lg text-slate-500">Find and support the next great idea — from local heroes to world-changing products.</p>
      </div>
      <div className="no-scrollbar -mx-4 mt-8 flex gap-2 overflow-x-auto px-4 pb-2 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
        {categories.map((c) => (
          <Link
            key={c.slug}
            href={`/categories/${c.slug}`}
            className="flex shrink-0 items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-brand-300 hover:text-brand-700"
          >
            <CategoryIcon name={c.icon} className="h-4 w-4" /> {c.name}
          </Link>
        ))}
      </div>
      <div className="mt-6">
        <CampaignBrowser initialQuery={q} initialCategory={category} />
      </div>
    </div>
  );
}
