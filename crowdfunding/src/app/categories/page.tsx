import type { Metadata } from "next";
import { CategoryCard } from "@/components/CategoryCard";
import { campaigns, categories } from "@/lib/data";

export const metadata: Metadata = { title: "Categories" };

export default function CategoriesPage() {
  const count = (slug: string) => campaigns.filter((c) => c.category === slug).length;
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
      <div className="max-w-2xl">
        <p className="text-sm font-semibold tracking-wider text-brand-600 uppercase">Categories</p>
        <h1 className="mt-2 text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">What do you want to support?</h1>
        <p className="mt-3 text-lg text-slate-500">Thirteen categories, thousands of ideas. Pick one to see live campaigns.</p>
      </div>
      <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {categories.map((c) => (
          <CategoryCard key={c.slug} category={c} count={count(c.slug)} variant="image" />
        ))}
      </div>
    </div>
  );
}
