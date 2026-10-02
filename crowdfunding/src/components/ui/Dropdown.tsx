"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { Check, ChevronDown } from "lucide-react";
import { cn } from "@/lib/cn";

export interface DropdownOption {
  value: string;
  label: string;
  icon?: ReactNode;
}

export function Dropdown({
  value,
  options,
  onChange,
  label,
  icon,
  className,
  align = "left",
}: {
  value: string;
  options: DropdownOption[];
  onChange: (v: string) => void;
  label?: string;
  icon?: ReactNode;
  className?: string;
  align?: "left" | "right";
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const current = options.find((o) => o.value === value);

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  return (
    <div ref={ref} className={cn("relative", className)}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={cn(
          "flex h-11 w-full items-center gap-2 rounded-xl border bg-white px-3.5 text-left text-sm transition",
          open ? "border-brand-500 ring-4 ring-brand-500/10" : "border-slate-200 hover:border-slate-300",
        )}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        {icon && <span className="text-slate-400">{icon}</span>}
        <span className="flex-1 truncate">
          {label && <span className="text-slate-400">{label}: </span>}
          <span className="font-medium text-slate-800">{current?.label}</span>
        </span>
        <ChevronDown className={cn("h-4 w-4 text-slate-400 transition", open && "rotate-180")} />
      </button>
      {open && (
        <ul
          role="listbox"
          className={cn(
            "absolute z-40 mt-2 max-h-72 min-w-full overflow-auto rounded-2xl border border-slate-100 bg-white p-1.5 shadow-lift animate-scale-in",
            align === "right" ? "right-0" : "left-0",
          )}
        >
          {options.map((o) => (
            <li key={o.value}>
              <button
                type="button"
                role="option"
                aria-selected={o.value === value}
                onClick={() => {
                  onChange(o.value);
                  setOpen(false);
                }}
                className={cn(
                  "flex w-full items-center gap-2 whitespace-nowrap rounded-xl px-3 py-2 text-left text-sm transition",
                  o.value === value ? "bg-brand-50 font-semibold text-brand-700" : "text-slate-700 hover:bg-slate-50",
                )}
              >
                {o.icon}
                <span className="flex-1">{o.label}</span>
                {o.value === value && <Check className="h-4 w-4" />}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
