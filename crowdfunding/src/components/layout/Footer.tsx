"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowRight, CheckCircle2, ShieldCheck } from "lucide-react";
import { Logo } from "./Logo";
import { FacebookIcon, InstagramIcon, LinkedInIcon, TikTokIcon, XIcon, YouTubeIcon } from "@/components/ui/SocialIcons";
import { categories } from "@/lib/data";

const company = [
  { label: "About", href: "#" },
  { label: "How It Works", href: "/how-it-works" },
  { label: "Trust & Safety", href: "#" },
  { label: "Help Center", href: "#" },
  { label: "Contact", href: "#" },
];
const legal = [
  { label: "Terms", href: "#" },
  { label: "Privacy", href: "#" },
  { label: "Cookie Policy", href: "#" },
  { label: "Accessibility", href: "#" },
];
const creators = [
  { label: "Start a Campaign", href: "/start" },
  { label: "Creator Dashboard", href: "/dashboard" },
  { label: "Campaign Analytics", href: "/dashboard/analytics" },
  { label: "Admin Console (demo)", href: "/admin" },
];

export function Footer() {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);

  return (
    <footer className="mt-24 bg-slate-950 text-slate-400">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-10 border-b border-white/10 py-14 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <Logo light />
            <p className="mt-4 max-w-sm text-sm leading-relaxed">
              Fundora helps creators, founders, charities and communities bring great ideas to life — with the support of people who believe in them.
            </p>
            <p className="mt-5 inline-flex items-center gap-2 rounded-full bg-white/5 px-3 py-1.5 text-xs font-medium text-slate-300">
              <ShieldCheck className="h-4 w-4 text-brand-400" /> Fundora Guarantee: protected contributions
            </p>
            <div className="mt-6 flex gap-2">
              {[XIcon, InstagramIcon, FacebookIcon, LinkedInIcon, YouTubeIcon, TikTokIcon].map((Icon, i) => (
                <a key={i} href="#" aria-label="Social media" className="flex h-9 w-9 items-center justify-center rounded-full bg-white/5 text-slate-300 transition hover:bg-brand-600 hover:text-white">
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          <FooterCol title="Company" links={company} />
          <FooterCol title="Creators" links={creators} />
          <div className="lg:col-span-2">
            <h3 className="text-sm font-semibold text-white">Categories</h3>
            <ul className="mt-4 space-y-2.5 text-sm">
              {categories.slice(0, 6).map((c) => (
                <li key={c.slug}>
                  <Link href={`/categories/${c.slug}`} className="transition hover:text-white">{c.name}</Link>
                </li>
              ))}
              <li>
                <Link href="/categories" className="font-semibold text-brand-400 hover:text-brand-300">All categories →</Link>
              </li>
            </ul>
          </div>

          <div className="lg:col-span-2">
            <h3 className="text-sm font-semibold text-white">Newsletter</h3>
            <p className="mt-4 text-sm">The best new campaigns, every Friday. No spam.</p>
            {done ? (
              <p className="mt-4 flex items-center gap-2 text-sm font-semibold text-brand-400">
                <CheckCircle2 className="h-4 w-4" /> You&apos;re subscribed!
              </p>
            ) : (
              <form
                className="mt-4 flex flex-col gap-2"
                onSubmit={(e) => {
                  e.preventDefault();
                  if (email.includes("@")) setDone(true);
                }}
              >
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="h-11 rounded-full border border-white/10 bg-white/5 px-4 text-sm text-white outline-none placeholder:text-slate-500 focus:border-brand-500"
                />
                <button className="flex h-11 items-center justify-center gap-2 rounded-full bg-brand-600 text-sm font-semibold text-white transition hover:bg-brand-500">
                  Subscribe <ArrowRight className="h-4 w-4" />
                </button>
              </form>
            )}
          </div>
        </div>
        <div className="flex flex-col items-center justify-between gap-4 py-6 text-xs sm:flex-row">
          <p>© 2026 Fundora Ltd. UI prototype — all campaigns and data are fictional.</p>
          <div className="flex flex-wrap gap-5">
            {legal.map((l) => (
              <Link key={l.label} href={l.href} className="hover:text-white">{l.label}</Link>
            ))}
            <span>🌍 English (EU) · € EUR</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, links }: { title: string; links: { label: string; href: string }[] }) {
  return (
    <div className="lg:col-span-2">
      <h3 className="text-sm font-semibold text-white">{title}</h3>
      <ul className="mt-4 space-y-2.5 text-sm">
        {links.map((l) => (
          <li key={l.label}>
            <Link href={l.href} className="transition hover:text-white">{l.label}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
