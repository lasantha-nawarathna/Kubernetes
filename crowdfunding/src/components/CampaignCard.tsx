"use client";

import Link from "next/link";
import { BadgeCheck, Clock, Heart, MapPin, Users } from "lucide-react";
import { useApp } from "@/context/AppContext";
import { CampaignBadge } from "@/components/ui/Badge";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { SmartImage } from "@/components/ui/SmartImage";
import { categoryName, formatMoney, getCreator, percentFunded } from "@/lib/data";
import type { Campaign } from "@/lib/types";
import { cn } from "@/lib/cn";

export function CampaignCard({ campaign, className, showBadges = true }: { campaign: Campaign; className?: string; showBadges?: boolean }) {
  const { isSaved, toggleSave } = useApp();
  const creator = getCreator(campaign.creatorId);
  const pct = percentFunded(campaign);
  const saved = isSaved(campaign.id);
  const href = `/campaign/${campaign.id}`;

  return (
    <article
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-soft transition duration-300 hover:-translate-y-1 hover:shadow-lift",
        className,
      )}
    >
      <Link href={href} className="relative block aspect-[4/3] overflow-hidden" aria-label={campaign.title}>
        <SmartImage
          src={campaign.image}
          alt={campaign.title}
          width={800}
          className="h-full w-full"
          imgClassName="transition duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/30 to-transparent" />
        {showBadges && campaign.badges.length > 0 && (
          <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
            {campaign.badges.slice(0, 2).map((b) => (
              <CampaignBadge key={b} type={b} />
            ))}
          </div>
        )}
        <span className="absolute bottom-3 left-3 rounded-full bg-white/90 px-2.5 py-1 text-[11px] font-semibold text-slate-700 backdrop-blur">
          {categoryName(campaign.category)}
        </span>
      </Link>

      <button
        onClick={() => toggleSave(campaign.id, campaign.title)}
        aria-pressed={saved}
        aria-label={saved ? "Remove from saved" : "Save campaign"}
        className={cn(
          "absolute top-3 right-3 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 shadow-sm backdrop-blur transition hover:scale-110 active:scale-95",
          saved ? "text-rose-500" : "text-slate-600 hover:text-rose-500",
        )}
      >
        <Heart className={cn("h-5 w-5 transition", saved && "fill-current")} />
      </button>

      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <span className="flex items-center gap-1 font-medium text-slate-700">
            {creator?.name}
            {creator?.verified && <BadgeCheck className="h-3.5 w-3.5 text-brand-600" />}
          </span>
          <span className="text-slate-300">•</span>
          <span className="flex min-w-0 items-center gap-1 truncate">
            <MapPin className="h-3 w-3 shrink-0" />
            {campaign.location}
          </span>
        </div>
        <Link href={href} className="mt-2">
          <h3 className="line-clamp-2 text-lg leading-snug font-bold text-slate-900 transition group-hover:text-brand-700">{campaign.title}</h3>
        </Link>
        <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-slate-500">{campaign.description}</p>

        <div className="mt-auto pt-5">
          <ProgressBar value={pct} />
          <div className="mt-3 flex items-end justify-between gap-2">
            <div>
              <p className="text-lg font-bold text-slate-900">{formatMoney(campaign.raised)}</p>
              <p className="text-xs text-slate-500">raised of {formatMoney(campaign.goal)} goal</p>
            </div>
            <p className={cn("text-sm font-bold", pct >= 100 ? "text-brand-600" : "text-slate-900")}>{pct}% funded</p>
          </div>
          <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-4 text-sm">
            <div className="flex items-center gap-4 text-slate-500">
              <span className="flex items-center gap-1.5">
                <Users className="h-4 w-4" />
                <span className="font-semibold text-slate-700">{campaign.backers.toLocaleString()}</span> backers
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="h-4 w-4" />
                <span className="font-semibold text-slate-700">{campaign.daysLeft}</span> days left
              </span>
            </div>
          </div>
          <Link
            href={href}
            className="mt-4 flex h-10 items-center justify-center rounded-full bg-slate-900 text-sm font-semibold text-white transition hover:bg-brand-600"
          >
            View Campaign
          </Link>
        </div>
      </div>
    </article>
  );
}
