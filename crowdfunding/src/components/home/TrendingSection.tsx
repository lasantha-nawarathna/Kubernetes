"use client";

import { useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { CampaignCard } from "@/components/CampaignCard";
import { Tabs } from "@/components/ui/Tabs";
import { campaigns } from "@/lib/data";
import type { BadgeType } from "@/lib/types";

const FILTERS: (BadgeType | "All")[] = ["All", "Trending", "Popular", "Almost Funded", "New", "Ending Soon"];

export function TrendingSection() {
  const [filter, setFilter] = useState<string>("All");
  const scroller = useRef<HTMLDivElement>(null);

  const list = campaigns.filter((c) => (filter === "All" ? c.trending : c.badges.includes(filter as BadgeType)));

  const scroll = (dir: number) => scroller.current?.scrollBy({ left: dir * 360, behavior: "smooth" });

  return (
    <section className="bg-slate-50/70 py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <p className="text-sm font-semibold tracking-wider text-brand-600 uppercase">🔥 Trending now</p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">Campaigns people are backing today</h2>
          </div>
          <div className="hidden gap-2 md:flex">
            <button onClick={() => scroll(-1)} className="flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 transition hover:border-slate-300 hover:shadow-soft" aria-label="Scroll left">
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button onClick={() => scroll(1)} className="flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 transition hover:border-slate-300 hover:shadow-soft" aria-label="Scroll right">
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>
        <Tabs
          variant="pill"
          className="mt-8"
          tabs={FILTERS.map((f) => ({ id: f, label: f }))}
          active={filter}
          onChange={setFilter}
        />
        <div ref={scroller} className="no-scrollbar -mx-4 mt-8 flex snap-x snap-mandatory gap-5 overflow-x-auto px-4 pt-2 pb-6 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
          {list.map((c) => (
            <CampaignCard key={c.id} campaign={c} className="w-[300px] shrink-0 snap-start sm:w-[340px]" />
          ))}
          {list.length === 0 && <p className="py-12 text-slate-500">No campaigns match this filter right now.</p>}
        </div>
      </div>
    </section>
  );
}
