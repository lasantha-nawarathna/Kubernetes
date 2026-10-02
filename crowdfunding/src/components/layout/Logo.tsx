import Link from "next/link";
import { cn } from "@/lib/cn";

export function Logo({ className, light }: { className?: string; light?: boolean }) {
  return (
    <Link href="/" className={cn("flex items-center gap-2", className)} aria-label="Fundora home">
      <span className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-teal-500 shadow-md shadow-brand-500/30">
        <svg viewBox="0 0 24 24" className="h-5 w-5 text-white" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 21s-7-4.35-7-10a4 4 0 0 1 7-2.65A4 4 0 0 1 19 11c0 5.65-7 10-7 10z" />
          <path d="M12 8v7M9 12l3-3 3 3" />
        </svg>
      </span>
      <span className={cn("text-xl font-extrabold tracking-tight", light ? "text-white" : "text-slate-900")}>
        fund<span className="text-brand-600">ora</span>
      </span>
    </Link>
  );
}
