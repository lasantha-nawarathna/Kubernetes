"use client";

import { Heart } from "lucide-react";
import { useApp } from "@/context/AppContext";
import { PageHeader } from "@/components/dashboard/AppShell";
import { CampaignCard } from "@/components/CampaignCard";
import { ButtonLink } from "@/components/ui/Button";
import { campaigns } from "@/lib/data";

export default function SavedPage() {
  const { saved } = useApp();
  const list = campaigns.filter((c) => saved.includes(c.id));
  return (
    <div>
      <PageHeader title="Saved Campaigns" description="Your wishlist — we'll remind you before these campaigns end." actions={<ButtonLink href="/explore" variant="outline">Discover more</ButtonLink>} />
      {list.length === 0 ? (
        <div className="flex flex-col items-center rounded-3xl border border-dashed border-slate-200 bg-white py-20 text-center">
          <span className="flex h-16 w-16 items-center justify-center rounded-full bg-rose-50 text-rose-500"><Heart className="h-8 w-8" /></span>
          <h3 className="mt-4 text-lg font-bold text-slate-900">No saved campaigns yet</h3>
          <p className="mt-1 max-w-sm text-slate-500">Tap the heart on any campaign to save it here for later.</p>
          <ButtonLink href="/explore" className="mt-6">Explore campaigns</ButtonLink>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 2xl:grid-cols-3">
          {list.map((c) => (
            <CampaignCard key={c.id} campaign={c} />
          ))}
        </div>
      )}
    </div>
  );
}
