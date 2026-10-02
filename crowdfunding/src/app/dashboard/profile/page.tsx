"use client";

import { BadgeCheck, Camera, Globe, MapPin } from "lucide-react";
import { useApp } from "@/context/AppContext";
import { PageHeader, Panel } from "@/components/dashboard/AppShell";
import { Avatar } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import { InstagramIcon, LinkedInIcon } from "@/components/ui/SocialIcons";
import dashboard from "@/data/dashboard.json";

const field = "h-11 w-full rounded-2xl border border-slate-200 px-4 text-sm outline-none transition focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10";

export default function ProfilePage() {
  const { toast } = useApp();
  const u = dashboard.currentUser;
  return (
    <div className="max-w-4xl">
      <PageHeader title="Profile" description="This is how backers see you across Fundora." />
      <div className="overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-soft">
        <div className="h-32 bg-gradient-to-r from-brand-500 via-teal-400 to-sky-400" />
        <div className="flex flex-col gap-4 px-6 pb-6 sm:flex-row sm:items-end">
          <div className="relative -mt-12 w-fit">
            <Avatar src={u.avatar} name={u.name} size={104} className="ring-4 ring-white" />
            <button className="absolute right-1 bottom-1 rounded-full bg-slate-900 p-2 text-white shadow" aria-label="Change photo"><Camera className="h-4 w-4" /></button>
          </div>
          <div className="flex-1">
            <h2 className="flex items-center gap-2 text-xl font-bold text-slate-900">{u.name} <BadgeCheck className="h-5 w-5 text-brand-600" /></h2>
            <p className="flex flex-wrap gap-x-4 text-sm text-slate-500">
              <span className="flex items-center gap-1"><MapPin className="h-4 w-4" /> {u.location}</span>
              <span className="flex items-center gap-1"><Globe className="h-4 w-4" /> {u.website}</span>
              <span>Member since {u.joined}</span>
            </p>
          </div>
          <div className="flex gap-6 text-center">
            <div><p className="text-xl font-bold">5</p><p className="text-xs text-slate-500">created</p></div>
            <div><p className="text-xl font-bold">38</p><p className="text-xs text-slate-500">backed</p></div>
            <div><p className="text-xl font-bold">1.8k</p><p className="text-xs text-slate-500">followers</p></div>
          </div>
        </div>
      </div>
      <Panel title="Edit profile" className="mt-6">
        <form
          className="grid gap-4 sm:grid-cols-2"
          onSubmit={(e) => {
            e.preventDefault();
            toast({ title: "Profile updated" });
          }}
        >
          <label className="text-sm font-semibold text-slate-700">Full name<input className={`${field} mt-1.5`} defaultValue={u.name} /></label>
          <label className="text-sm font-semibold text-slate-700">Location<input className={`${field} mt-1.5`} defaultValue={u.location} /></label>
          <label className="text-sm font-semibold text-slate-700 sm:col-span-2">Bio<textarea className={`${field} mt-1.5 h-24 resize-none py-3`} defaultValue={u.bio} /></label>
          <label className="text-sm font-semibold text-slate-700">Website<input className={`${field} mt-1.5`} defaultValue={u.website} /></label>
          <label className="text-sm font-semibold text-slate-700">Email<input className={`${field} mt-1.5`} defaultValue={u.email} /></label>
          <div className="flex gap-3 sm:col-span-2">
            <span className="flex items-center gap-2 rounded-2xl border border-slate-200 px-4 py-2.5 text-sm"><InstagramIcon className="h-4 w-4" /> @verdant.garden</span>
            <span className="flex items-center gap-2 rounded-2xl border border-slate-200 px-4 py-2.5 text-sm"><LinkedInIcon className="h-4 w-4" /> sofiamartins</span>
          </div>
          <div className="flex justify-end sm:col-span-2"><Button type="submit">Save changes</Button></div>
        </form>
      </Panel>
    </div>
  );
}
