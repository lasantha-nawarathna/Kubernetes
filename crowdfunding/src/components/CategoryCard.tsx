import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { CategoryIcon } from "@/components/ui/CategoryIcon";
import { SmartImage } from "@/components/ui/SmartImage";
import type { Category } from "@/lib/types";
import { cn } from "@/lib/cn";

export function CategoryCard({ category, count, variant = "tile" }: { category: Category; count: number; variant?: "tile" | "image" }) {
  if (variant === "image") {
    return (
      <Link href={`/categories/${category.slug}`} className="group relative block aspect-[4/5] overflow-hidden rounded-3xl shadow-soft transition hover:-translate-y-1 hover:shadow-lift">
        <SmartImage src={category.image} alt={category.name} width={600} className="absolute inset-0 h-full w-full" imgClassName="transition duration-700 group-hover:scale-110" />
        <div className={cn("absolute inset-0 bg-gradient-to-t opacity-80 mix-blend-multiply", category.color)} />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 p-5 text-white">
          <CategoryIcon name={category.icon} className="h-6 w-6" />
          <h3 className="mt-2 text-lg font-bold">{category.name}</h3>
          <p className="text-sm text-white/80">{count} live campaigns</p>
        </div>
      </Link>
    );
  }
  return (
    <Link
      href={`/categories/${category.slug}`}
      className="group flex items-center gap-4 rounded-2xl border border-slate-100 bg-white p-4 shadow-soft transition hover:-translate-y-0.5 hover:border-brand-200 hover:shadow-lift"
    >
      <span className={cn("flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br text-white shadow-sm", category.color)}>
        <CategoryIcon name={category.icon} className="h-6 w-6" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block font-semibold text-slate-900">{category.name}</span>
        <span className="block truncate text-sm text-slate-500">{count} campaigns</span>
      </span>
      <ArrowUpRight className="h-5 w-5 text-slate-300 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-brand-600" />
    </Link>
  );
}
