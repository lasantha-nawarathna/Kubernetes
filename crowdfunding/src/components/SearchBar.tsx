"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Search, X } from "lucide-react";
import { cn } from "@/lib/cn";

/**
 * Controlled when `value`/`onChange` are passed (live filtering), otherwise
 * submits to /explore?q=… (global navbar search).
 */
export function SearchBar({
  value,
  onChange,
  placeholder = "Search campaigns, creators, places…",
  size = "md",
  className,
}: {
  value?: string;
  onChange?: (v: string) => void;
  placeholder?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  const router = useRouter();
  const [local, setLocal] = useState("");
  const controlled = onChange !== undefined;
  const v = controlled ? value ?? "" : local;
  const set = controlled ? onChange : setLocal;

  return (
    <form
      role="search"
      onSubmit={(e) => {
        e.preventDefault();
        if (!controlled) router.push(`/explore${v ? `?q=${encodeURIComponent(v)}` : ""}`);
      }}
      className={cn("relative", className)}
    >
      <Search className={cn("pointer-events-none absolute top-1/2 -translate-y-1/2 text-slate-400", size === "lg" ? "left-5 h-5 w-5" : "left-3.5 h-4 w-4")} />
      <input
        type="search"
        value={v}
        onChange={(e) => set(e.target.value)}
        placeholder={placeholder}
        aria-label="Search campaigns"
        className={cn(
          "w-full rounded-full border border-slate-200 bg-slate-50/80 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-brand-500 focus:bg-white focus:ring-4 focus:ring-brand-500/10 [&::-webkit-search-cancel-button]:hidden",
          size === "sm" && "h-10 pr-8 pl-10 text-sm",
          size === "md" && "h-11 pr-9 pl-10 text-sm",
          size === "lg" && "h-14 pr-12 pl-13 text-base shadow-soft",
        )}
      />
      {v && (
        <button type="button" onClick={() => set("")} className="absolute top-1/2 right-3 -translate-y-1/2 rounded-full p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600" aria-label="Clear search">
          <X className="h-4 w-4" />
        </button>
      )}
    </form>
  );
}
