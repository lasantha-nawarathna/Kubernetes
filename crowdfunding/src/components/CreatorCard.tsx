"use client";

import { BadgeCheck, Globe, Heart, MapPin, MessageCircle, Rocket } from "lucide-react";
import { useApp } from "@/context/AppContext";
import { Avatar } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import { InstagramIcon, LinkedInIcon, XIcon, YouTubeIcon } from "@/components/ui/SocialIcons";
import type { Creator } from "@/lib/types";

export function CreatorCard({ creator }: { creator: Creator }) {
  const { toast } = useApp();
  const socials = [
    creator.socials.website && { href: "#", label: creator.socials.website, Icon: Globe },
    creator.socials.twitter && { href: "#", label: "X / Twitter", Icon: XIcon },
    creator.socials.instagram && { href: "#", label: "Instagram", Icon: InstagramIcon },
    creator.socials.linkedin && { href: "#", label: "LinkedIn", Icon: LinkedInIcon },
    creator.socials.youtube && { href: "#", label: "YouTube", Icon: YouTubeIcon },
  ].filter(Boolean) as { href: string; label: string; Icon: React.ComponentType<{ className?: string }> }[];

  return (
    <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-soft">
      <div className="flex items-center gap-4">
        <Avatar src={creator.avatar} name={creator.name} size={64} className="ring-4 ring-brand-50" />
        <div className="min-w-0">
          <p className="text-xs font-semibold tracking-wider text-slate-400 uppercase">Creator</p>
          <h3 className="flex items-center gap-1.5 text-lg font-bold text-slate-900">
            <span className="truncate">{creator.name}</span>
            {creator.verified && <BadgeCheck className="h-5 w-5 shrink-0 text-brand-600" aria-label="Verified creator" />}
          </h3>
          <p className="flex items-center gap-1 text-sm text-slate-500">
            <MapPin className="h-3.5 w-3.5" /> {creator.location}
          </p>
        </div>
      </div>
      {creator.verified && (
        <p className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-700">
          <BadgeCheck className="h-3.5 w-3.5" /> Identity verified by Fundora
        </p>
      )}
      <p className="mt-4 text-sm leading-relaxed text-slate-600">{creator.bio}</p>
      <div className="mt-5 grid grid-cols-2 gap-3">
        <div className="rounded-2xl bg-slate-50 p-3">
          <p className="flex items-center gap-1 text-xs text-slate-500"><Rocket className="h-3.5 w-3.5" /> Created</p>
          <p className="mt-0.5 text-lg font-bold text-slate-900">{creator.campaignsCreated} <span className="text-sm font-medium text-slate-500">campaigns</span></p>
        </div>
        <div className="rounded-2xl bg-slate-50 p-3">
          <p className="flex items-center gap-1 text-xs text-slate-500"><Heart className="h-3.5 w-3.5" /> Backed</p>
          <p className="mt-0.5 text-lg font-bold text-slate-900">{creator.campaignsBacked} <span className="text-sm font-medium text-slate-500">campaigns</span></p>
        </div>
      </div>
      {socials.length > 0 && (
        <div className="mt-5 flex flex-wrap gap-2">
          {socials.map(({ href, label, Icon }) => (
            <a key={label} href={href} title={label} className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 text-slate-500 transition hover:border-brand-300 hover:text-brand-600">
              <Icon className="h-4 w-4" />
            </a>
          ))}
        </div>
      )}
      <Button
        variant="outline"
        className="mt-5 w-full"
        onClick={() => toast({ title: "Message started", description: `Your conversation with ${creator.name} is in Messages.`, variant: "info" })}
      >
        <MessageCircle className="h-4 w-4" /> Contact Creator
      </Button>
      <p className="mt-3 text-center text-xs text-slate-400">Member since {creator.joined}</p>
    </div>
  );
}
