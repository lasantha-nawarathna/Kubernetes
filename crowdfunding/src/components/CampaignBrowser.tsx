"use client";

import { useEffect, useMemo, useState } from "react";
import { ArrowUpDown, LayoutGrid, List, SearchX, SlidersHorizontal, X } from "lucide-react";
import { CampaignCard } from "@/components/CampaignCard";
import { DEFAULT_FILTERS, FilterPanel, FilterSummary, STATUS_OPTIONS, type Filters } from "@/components/FilterPanel";
import { SearchBar } from "@/components/SearchBar";
import { Dropdown } from "@/components/ui/Dropdown";
import { Pagination } from "@/components/ui/Pagination";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { SmartImage } from "@/components/ui/SmartImage";
import { Button } from "@/components/ui/Button";
import { campaigns, categoryName, formatMoney, getCreator, percentFunded } from "@/lib/data";
import type { Campaign } from "@/lib/types";
import { cn } from "@/lib/cn";
import Link from "next/link";

export const SORT_OPTIONS = [
  { value: "trending", label: "Trending" },
  { value: "newest", label: "Newest" },
  { value: "funded", label: "Most Funded" },
  { value: "ending", label: "Ending Soon" },
  { value: "backed", label: "Most Backed" },
];

const PAGE_SIZE = 9;

function matchesStatus(c: Campaign, status: string) {
  const p = percentFunded(c);
  switch (status) {
    case "early":
      return p < 50;
    case "progress":
      return p >= 50 && p < 100;
    case "almost":
      return p >= 85 && p < 100;
    case "funded":
      return p >= 100;
    case "ending":
      return c.daysLeft <= 10;
    default:
      return true;
  }
}

function sortCampaigns(list: Campaign[], sort: string) {
  const arr = [...list];
  switch (sort) {
    case "newest":
      return arr.sort((a, b) => b.launched.localeCompare(a.launched));
    case "funded":
      return arr.sort((a, b) => percentFunded(b) - percentFunded(a));
    case "ending":
      return arr.sort((a, b) => a.daysLeft - b.daysLeft);
    case "backed":
      return arr.sort((a, b) => b.backers - a.backers);
    default: {
      const score = (c: Campaign) => (c.trending ? 1 : 0) * 1000 + c.views / 1000 + c.backers / 100;
      return arr.sort((a, b) => score(b) - score(a));
    }
  }
}

export function CampaignBrowser({
  initialQuery = "",
  initialCategory = "all",
  lockCategory = false,
}: {
  initialQuery?: string;
  initialCategory?: string;
  lockCategory?: boolean;
}) {
  const [query, setQuery] = useState(initialQuery);
  const [filters, setFilters] = useState<Filters>({ ...DEFAULT_FILTERS, category: initialCategory });
  const [sort, setSort] = useState("trending");
  const [page, setPage] = useState(1);
  const [view, setView] = useState<"grid" | "list">("grid");
  const [mobileFilters, setMobileFilters] = useState(false);

  useEffect(() => setQuery(initialQuery), [initialQuery]);
  useEffect(() => setFilters((f) => ({ ...f, category: initialCategory })), [initialCategory]);
  useEffect(() => setPage(1), [query, filters, sort]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    const filtered = campaigns.filter((c) => {
      if (filters.category !== "all" && c.category !== filters.category) return false;
      if (filters.location !== "all" && c.country !== filters.location) return false;
      if (!matchesStatus(c, filters.status)) return false;
      if (!q) return true;
      const creator = getCreator(c.creatorId);
      return [c.title, c.description, c.tagline, c.location, categoryName(c.category), creator?.name].join(" ").toLowerCase().includes(q);
    });
    return sortCampaigns(filtered, sort);
  }, [query, filters, sort]);

  const totalPages = Math.ceil(results.length / PAGE_SIZE);
  const pageItems = results.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const chips = [
    query && { key: "q", label: `“${query}”`, clear: () => setQuery("") },
    !lockCategory && filters.category !== "all" && { key: "cat", label: categoryName(filters.category), clear: () => setFilters({ ...filters, category: "all" }) },
    filters.location !== "all" && { key: "loc", label: filters.location, clear: () => setFilters({ ...filters, location: "all" }) },
    filters.status !== "all" && { key: "st", label: STATUS_OPTIONS.find((s) => s.value === filters.status)?.label, clear: () => setFilters({ ...filters, status: "all" }) },
  ].filter(Boolean) as { key: string; label: string; clear: () => void }[];

  return (
    <div>
      {/* Toolbar */}
      <div className="rounded-3xl border border-slate-100 bg-white p-4 shadow-soft sm:p-5">
        <div className="flex flex-col gap-3 lg:flex-row">
          <SearchBar value={query} onChange={setQuery} className="flex-1" placeholder="Search by title, creator, city…" />
          <div className="flex gap-3">
            <Button variant="outline" className="lg:hidden" onClick={() => setMobileFilters(true)}>
              <SlidersHorizontal className="h-4 w-4" /> Filters
            </Button>
            <Dropdown className="flex-1 lg:w-56 lg:flex-none" value={sort} onChange={setSort} label="Sort" icon={<ArrowUpDown className="h-4 w-4" />} options={SORT_OPTIONS} align="right" />
          </div>
        </div>
        <div className="mt-3 hidden lg:block">
          <FilterPanel
            filters={filters}
            onChange={setFilters}
            hideCategory={lockCategory}
          />
        </div>
      </div>

      {/* Summary */}
      <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <FilterSummary count={results.length} />
          {chips.map((c) => (
            <button key={c.key} onClick={c.clear} className="inline-flex items-center gap-1 rounded-full bg-brand-50 px-3 py-1 text-sm font-medium text-brand-700 transition hover:bg-brand-100">
              {c.label} <X className="h-3.5 w-3.5" />
            </button>
          ))}
        </div>
        <div className="flex rounded-full bg-slate-100 p-1">
          {(["grid", "list"] as const).map((v) => (
            <button
              key={v}
              onClick={() => setView(v)}
              className={cn("flex h-8 w-8 items-center justify-center rounded-full transition", view === v ? "bg-white text-slate-900 shadow-sm" : "text-slate-500")}
              aria-label={`${v} view`}
            >
              {v === "grid" ? <LayoutGrid className="h-4 w-4" /> : <List className="h-4 w-4" />}
            </button>
          ))}
        </div>
      </div>

      {/* Results */}
      {pageItems.length === 0 ? (
        <div className="mt-10 flex flex-col items-center rounded-3xl border border-dashed border-slate-200 py-20 text-center">
          <SearchX className="h-12 w-12 text-slate-300" />
          <h3 className="mt-4 text-lg font-bold text-slate-900">No campaigns found</h3>
          <p className="mt-1 max-w-sm text-slate-500">Try a different search term or remove some filters to see more projects.</p>
          <Button
            className="mt-6"
            variant="outline"
            onClick={() => {
              setQuery("");
              setFilters({ ...DEFAULT_FILTERS, category: lockCategory ? initialCategory : "all" });
            }}
          >
            Clear all filters
          </Button>
        </div>
      ) : view === "grid" ? (
        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {pageItems.map((c) => (
            <CampaignCard key={c.id} campaign={c} className="animate-fade-up" />
          ))}
        </div>
      ) : (
        <div className="mt-6 space-y-4">
          {pageItems.map((c) => (
            <ListRow key={c.id} c={c} />
          ))}
        </div>
      )}

      <div className="mt-12">
        <Pagination page={page} totalPages={totalPages} onChange={(p) => { setPage(p); window.scrollTo({ top: 0, behavior: "smooth" }); }} />
      </div>

      {/* Mobile filter sheet */}
      {mobileFilters && (
        <div className="fixed inset-0 z-[60] lg:hidden">
          <div className="absolute inset-0 bg-slate-900/40" onClick={() => setMobileFilters(false)} />
          <div className="absolute inset-x-0 bottom-0 rounded-t-3xl bg-white p-6 shadow-2xl animate-fade-up">
            <div className="mx-auto mb-4 h-1.5 w-10 rounded-full bg-slate-200" />
            <h3 className="mb-4 text-lg font-bold">Filters</h3>
            <FilterPanel
              layout="stack"
              filters={filters}
              onChange={setFilters}
              hideCategory={lockCategory}
            />
            <Button className="mt-6 w-full" size="lg" onClick={() => setMobileFilters(false)}>
              Show {results.length} campaigns
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

function ListRow({ c }: { c: Campaign }) {
  const pct = percentFunded(c);
  return (
    <Link href={`/campaign/${c.id}`} className="group flex flex-col gap-5 rounded-3xl border border-slate-100 bg-white p-4 shadow-soft transition hover:shadow-lift sm:flex-row">
      <SmartImage src={c.image} alt={c.title} width={500} className="aspect-[4/3] w-full shrink-0 rounded-2xl sm:w-56" />
      <div className="flex min-w-0 flex-1 flex-col">
        <p className="text-xs font-semibold text-brand-700">{categoryName(c.category)} · {c.location}</p>
        <h3 className="mt-1 text-lg font-bold text-slate-900 group-hover:text-brand-700">{c.title}</h3>
        <p className="mt-1 line-clamp-2 text-sm text-slate-500">{c.description}</p>
        <div className="mt-auto pt-4">
          <ProgressBar value={pct} size="sm" />
          <div className="mt-2 flex flex-wrap gap-x-5 gap-y-1 text-sm text-slate-500">
            <span><b className="text-slate-900">{formatMoney(c.raised)}</b> of {formatMoney(c.goal)}</span>
            <span><b className="text-slate-900">{pct}%</b> funded</span>
            <span><b className="text-slate-900">{c.backers.toLocaleString()}</b> backers</span>
            <span><b className="text-slate-900">{c.daysLeft}</b> days left</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
