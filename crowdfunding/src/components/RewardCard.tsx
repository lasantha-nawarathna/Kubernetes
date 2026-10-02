"use client";

import { Check, Package, Truck, Users } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { formatMoney } from "@/lib/data";
import type { Reward } from "@/lib/types";
import { cn } from "@/lib/cn";

export function RewardCard({ reward, onSelect, featured, compact }: { reward: Reward; onSelect?: () => void; featured?: boolean; compact?: boolean }) {
  const left = reward.limit !== null ? reward.limit - reward.backers : null;
  const soldOut = left !== null && left <= 0;
  return (
    <div
      className={cn(
        "group relative flex flex-col rounded-3xl border bg-white p-6 transition duration-300",
        featured ? "border-brand-500 shadow-lift ring-4 ring-brand-500/10" : "border-slate-200 hover:border-brand-300 hover:shadow-soft",
      )}
    >
      {featured && (
        <span className="absolute -top-3 left-6 rounded-full bg-brand-600 px-3 py-1 text-xs font-semibold text-white shadow">Most popular</span>
      )}
      <div className="flex items-baseline justify-between gap-2">
        <p className="text-3xl font-extrabold tracking-tight text-slate-900">{formatMoney(reward.amount)}</p>
        {left !== null && (
          <span className={cn("rounded-full px-2.5 py-1 text-xs font-semibold", left < 100 ? "bg-rose-50 text-rose-600" : "bg-slate-100 text-slate-600")}>
            {soldOut ? "Sold out" : `${left.toLocaleString()} of ${reward.limit!.toLocaleString()} left`}
          </span>
        )}
      </div>
      <h3 className="mt-2 text-lg font-bold text-slate-900">{reward.title}</h3>
      <p className="mt-1 text-sm leading-relaxed text-slate-500">{reward.description}</p>

      {!compact && (
        <>
          <p className="mt-5 text-xs font-semibold tracking-wider text-slate-400 uppercase">Includes</p>
          <ul className="mt-2 space-y-2">
            {reward.items.map((i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-slate-700">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-brand-600" />
                {i}
              </li>
            ))}
          </ul>
        </>
      )}

      <div className="mt-5 grid grid-cols-2 gap-3 rounded-2xl bg-slate-50 p-3 text-xs">
        <div>
          <p className="flex items-center gap-1 text-slate-400"><Package className="h-3.5 w-3.5" /> Estimated delivery</p>
          <p className="mt-0.5 font-semibold text-slate-800">{reward.delivery}</p>
        </div>
        <div>
          <p className="flex items-center gap-1 text-slate-400"><Users className="h-3.5 w-3.5" /> Supporters</p>
          <p className="mt-0.5 font-semibold text-slate-800">{reward.backers.toLocaleString()}</p>
        </div>
        {reward.shipsTo && (
          <div className="col-span-2">
            <p className="flex items-center gap-1 text-slate-400"><Truck className="h-3.5 w-3.5" /> Shipping</p>
            <p className="mt-0.5 font-semibold text-slate-800">{reward.shipsTo}</p>
          </div>
        )}
      </div>

      {onSelect && (
        <Button className="mt-5 w-full" variant={featured ? "primary" : "dark"} disabled={soldOut} onClick={onSelect}>
          {soldOut ? "Sold out" : "Select Reward"}
        </Button>
      )}
    </div>
  );
}
