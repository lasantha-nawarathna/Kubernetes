import { cn } from "@/lib/cn";

export function ProgressBar({ value, size = "md", className }: { value: number; size?: "sm" | "md" | "lg"; className?: string }) {
  const pct = Math.min(100, Math.max(0, value));
  const over = value >= 100;
  return (
    <div
      role="progressbar"
      aria-valuenow={Math.round(value)}
      aria-valuemin={0}
      aria-valuemax={100}
      className={cn("w-full overflow-hidden rounded-full bg-slate-100", size === "sm" ? "h-1.5" : size === "md" ? "h-2" : "h-3.5", className)}
    >
      <div
        className={cn(
          "h-full rounded-full transition-[width] duration-1000 ease-out",
          over ? "bg-gradient-to-r from-brand-500 to-teal-400" : "bg-gradient-to-r from-brand-600 to-brand-400",
        )}
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}
