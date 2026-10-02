"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/cn";

export function Pagination({ page, totalPages, onChange }: { page: number; totalPages: number; onChange: (p: number) => void }) {
  if (totalPages <= 1) return null;
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
  const btn = "flex h-10 min-w-10 items-center justify-center rounded-full px-3 text-sm font-semibold transition";
  return (
    <nav className="flex items-center justify-center gap-1.5" aria-label="Pagination">
      <button className={cn(btn, "text-slate-600 hover:bg-slate-100 disabled:opacity-40")} disabled={page === 1} onClick={() => onChange(page - 1)} aria-label="Previous page">
        <ChevronLeft className="h-4 w-4" />
      </button>
      {pages.map((p) => (
        <button
          key={p}
          onClick={() => onChange(p)}
          aria-current={p === page ? "page" : undefined}
          className={cn(btn, p === page ? "bg-slate-900 text-white" : "text-slate-600 hover:bg-slate-100")}
        >
          {p}
        </button>
      ))}
      <button className={cn(btn, "text-slate-600 hover:bg-slate-100 disabled:opacity-40")} disabled={page === totalPages} onClick={() => onChange(page + 1)} aria-label="Next page">
        <ChevronRight className="h-4 w-4" />
      </button>
    </nav>
  );
}
