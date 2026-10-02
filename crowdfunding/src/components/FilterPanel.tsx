"use client";

import { MapPin, RotateCcw, SlidersHorizontal, Tag, Target } from "lucide-react";
import { Dropdown } from "@/components/ui/Dropdown";
import { categories, countries } from "@/lib/data";

export interface Filters {
  category: string;
  location: string;
  status: string;
}

export const DEFAULT_FILTERS: Filters = { category: "all", location: "all", status: "all" };

export const STATUS_OPTIONS = [
  { value: "all", label: "Any status" },
  { value: "early", label: "Just launched (< 50%)" },
  { value: "progress", label: "In progress (50–99%)" },
  { value: "almost", label: "Almost funded (85%+)" },
  { value: "funded", label: "Fully funded (100%+)" },
  { value: "ending", label: "Ending within 10 days" },
];

export function FilterPanel({
  filters,
  onChange,
  layout = "row",
  hideCategory,
}: {
  filters: Filters;
  onChange: (f: Filters) => void;
  layout?: "row" | "stack";
  hideCategory?: boolean;
}) {
  const set = (k: keyof Filters) => (v: string) => onChange({ ...filters, [k]: v });
  const active = Object.entries(filters).filter(([k, v]) => v !== "all" && !(hideCategory && k === "category")).length;

  return (
    <div className={layout === "row" ? `grid gap-3 ${hideCategory ? "sm:grid-cols-2" : "sm:grid-cols-3"}` : "space-y-3"}>
      {!hideCategory && (
      <Dropdown
        value={filters.category}
        onChange={set("category")}
        icon={<Tag className="h-4 w-4" />}
        options={[{ value: "all", label: "All categories" }, ...categories.map((c) => ({ value: c.slug, label: c.name }))]}
      />
      )}
      <Dropdown
        value={filters.location}
        onChange={set("location")}
        icon={<MapPin className="h-4 w-4" />}
        options={[{ value: "all", label: "Anywhere" }, ...countries.map((c) => ({ value: c, label: c }))]}
      />
      <Dropdown value={filters.status} onChange={set("status")} icon={<Target className="h-4 w-4" />} options={STATUS_OPTIONS} />
      {layout === "stack" && active > 0 && (
        <button onClick={() => onChange({ ...DEFAULT_FILTERS, category: hideCategory ? filters.category : "all" })} className="flex items-center gap-1.5 text-sm font-semibold text-brand-700 hover:underline">
          <RotateCcw className="h-3.5 w-3.5" /> Reset {active} filter{active > 1 ? "s" : ""}
        </button>
      )}
    </div>
  );
}

export function FilterSummary({ count }: { count: number }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-sm text-slate-500">
      <SlidersHorizontal className="h-4 w-4" />
      <span className="font-semibold text-slate-900">{count}</span> campaigns found
    </span>
  );
}
