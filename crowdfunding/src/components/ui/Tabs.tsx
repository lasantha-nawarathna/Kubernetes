"use client";

import { cn } from "@/lib/cn";

export interface TabItem {
  id: string;
  label: string;
  count?: number;
}

export function Tabs({
  tabs,
  active,
  onChange,
  variant = "underline",
  className,
}: {
  tabs: TabItem[];
  active: string;
  onChange: (id: string) => void;
  variant?: "underline" | "pill";
  className?: string;
}) {
  if (variant === "pill") {
    return (
      <div className={cn("no-scrollbar inline-flex max-w-full gap-1 overflow-x-auto rounded-full bg-slate-100 p-1", className)} role="tablist">
        {tabs.map((t) => (
          <button
            key={t.id}
            role="tab"
            aria-selected={active === t.id}
            onClick={() => onChange(t.id)}
            className={cn(
              "whitespace-nowrap rounded-full px-4 py-1.5 text-sm font-semibold transition",
              active === t.id ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-800",
            )}
          >
            {t.label}
            {t.count !== undefined && <span className="ml-1.5 text-xs text-slate-400">{t.count}</span>}
          </button>
        ))}
      </div>
    );
  }
  return (
    <div className={cn("no-scrollbar flex gap-6 overflow-x-auto border-b border-slate-200", className)} role="tablist">
      {tabs.map((t) => (
        <button
          key={t.id}
          role="tab"
          aria-selected={active === t.id}
          onClick={() => onChange(t.id)}
          className={cn(
            "relative flex items-center gap-1.5 whitespace-nowrap py-4 text-sm font-semibold transition",
            active === t.id ? "text-slate-900" : "text-slate-500 hover:text-slate-800",
          )}
        >
          {t.label}
          {t.count !== undefined && (
            <span className={cn("rounded-full px-2 py-0.5 text-xs", active === t.id ? "bg-brand-100 text-brand-700" : "bg-slate-100 text-slate-500")}>
              {t.count.toLocaleString()}
            </span>
          )}
          {active === t.id && <span className="absolute inset-x-0 -bottom-px h-0.5 rounded-full bg-brand-600" />}
        </button>
      ))}
    </div>
  );
}
