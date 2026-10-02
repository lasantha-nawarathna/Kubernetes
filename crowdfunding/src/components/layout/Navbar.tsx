"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ChevronDown, Compass, HelpCircle, LayoutDashboard, Menu, Plus, Search, ShieldCheck, X } from "lucide-react";
import { Logo } from "./Logo";
import { SearchBar } from "@/components/SearchBar";
import { ButtonLink } from "@/components/ui/Button";
import { CategoryIcon } from "@/components/ui/CategoryIcon";
import { categories, campaigns } from "@/lib/data";
import { cn } from "@/lib/cn";

export function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [catOpen, setCatOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const catRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setCatOpen(false);
  }, [pathname]);

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (catRef.current && !catRef.current.contains(e.target as Node)) setCatOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
  }, [mobileOpen]);

  const count = (slug: string) => campaigns.filter((c) => c.category === slug).length;

  return (
    <header
      className={cn(
        "sticky top-0 z-50 border-b transition-all duration-300",
        scrolled ? "border-slate-200/80 bg-white/85 shadow-sm backdrop-blur-xl" : "border-transparent bg-white",
      )}
    >
      <div className="mx-auto flex h-18 max-w-7xl items-center gap-4 px-4 sm:px-6 lg:px-8">
        <Logo />

        <nav className="ml-2 hidden items-center gap-0.5 lg:flex xl:ml-4 xl:gap-1" aria-label="Main">
          <NavLink href="/explore" active={pathname.startsWith("/explore")}>Discover</NavLink>
          <NavLink href="/how-it-works" active={pathname === "/how-it-works"}>How It Works</NavLink>
          <div ref={catRef} className="relative">
            <button
              onClick={() => setCatOpen((o) => !o)}
              aria-expanded={catOpen}
              className={cn(
                "flex items-center gap-1 whitespace-nowrap rounded-full px-3.5 py-2 text-sm font-semibold transition",
                catOpen || pathname.startsWith("/categories") ? "bg-slate-100 text-slate-900" : "text-slate-600 hover:bg-slate-100 hover:text-slate-900",
              )}
            >
              Categories <ChevronDown className={cn("h-4 w-4 transition", catOpen && "rotate-180")} />
            </button>
            {catOpen && (
              <div className="absolute top-full left-1/2 mt-3 w-[640px] -translate-x-1/2 rounded-3xl border border-slate-100 bg-white p-4 shadow-lift animate-scale-in">
                <div className="grid grid-cols-3 gap-1">
                  {categories.map((c) => (
                    <Link key={c.slug} href={`/categories/${c.slug}`} className="group flex items-center gap-3 rounded-2xl p-2.5 transition hover:bg-slate-50">
                      <span className={cn("flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br text-white", c.color)}>
                        <CategoryIcon name={c.icon} className="h-4.5 w-4.5" />
                      </span>
                      <span>
                        <span className="block text-sm font-semibold text-slate-800 group-hover:text-brand-700">{c.name}</span>
                        <span className="block text-xs text-slate-400">{count(c.slug)} live</span>
                      </span>
                    </Link>
                  ))}
                </div>
                <Link href="/categories" className="mt-3 flex items-center justify-center rounded-2xl bg-slate-50 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-100">
                  Browse all categories
                </Link>
              </div>
            )}
          </div>
        </nav>

        <SearchBar size="sm" className="ml-auto hidden min-w-0 max-w-xs flex-1 xl:block" />
        <Link href="/explore" aria-label="Search" className="ml-auto hidden h-10 w-10 items-center justify-center rounded-full text-slate-600 hover:bg-slate-100 md:flex xl:hidden">
          <Search className="h-5 w-5" />
        </Link>

        <div className="hidden items-center gap-2 md:flex">
          <Link href="/signin" className="whitespace-nowrap rounded-full px-3.5 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-100 hover:text-slate-900">
            Sign In
          </Link>
          <ButtonLink href="/signup" variant="outline" size="sm" className="hidden xl:inline-flex">
            Sign Up
          </ButtonLink>
          <ButtonLink href="/start" size="sm" className="hidden sm:inline-flex">
            <Plus className="h-4 w-4" /> Start a Campaign
          </ButtonLink>
        </div>

        <button
          onClick={() => setMobileOpen(true)}
          className="ml-auto flex h-10 w-10 items-center justify-center rounded-full text-slate-700 hover:bg-slate-100 md:ml-0 lg:hidden"
          aria-label="Open menu"
        >
          <Menu className="h-6 w-6" />
        </button>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-[60] lg:hidden">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
          <div className="absolute inset-y-0 right-0 flex w-full max-w-sm flex-col overflow-y-auto bg-white shadow-2xl animate-slide-in">
            <div className="flex h-18 items-center justify-between border-b border-slate-100 px-5">
              <Logo />
              <button onClick={() => setMobileOpen(false)} className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-slate-100" aria-label="Close menu">
                <X className="h-6 w-6" />
              </button>
            </div>
            <div className="space-y-6 p-5">
              <SearchBar />
              <ButtonLink href="/start" className="w-full" size="lg">
                <Plus className="h-5 w-5" /> Start a Campaign
              </ButtonLink>
              <nav className="space-y-1">
                {[
                  { href: "/explore", label: "Discover", Icon: Compass },
                  { href: "/how-it-works", label: "How It Works", Icon: HelpCircle },
                  { href: "/dashboard", label: "My Dashboard", Icon: LayoutDashboard },
                  { href: "/admin", label: "Admin (demo)", Icon: ShieldCheck },
                ].map(({ href, label, Icon }) => (
                  <Link key={href} href={href} className="flex items-center gap-3 rounded-2xl px-3 py-3 font-semibold text-slate-800 hover:bg-slate-50">
                    <Icon className="h-5 w-5 text-slate-400" /> {label}
                  </Link>
                ))}
              </nav>
              <div>
                <p className="mb-2 px-3 text-xs font-semibold tracking-wider text-slate-400 uppercase">Categories</p>
                <div className="grid grid-cols-2 gap-1">
                  {categories.map((c) => (
                    <Link key={c.slug} href={`/categories/${c.slug}`} className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50">
                      <CategoryIcon name={c.icon} className="h-4 w-4 text-slate-400" /> {c.name}
                    </Link>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 border-t border-slate-100 pt-5">
                <ButtonLink href="/signin" variant="outline">Sign In</ButtonLink>
                <ButtonLink href="/signup" variant="dark">Sign Up</ButtonLink>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

function NavLink({ href, active, children }: { href: string; active: boolean; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className={cn("whitespace-nowrap rounded-full px-3.5 py-2 text-sm font-semibold transition", active ? "bg-slate-100 text-slate-900" : "text-slate-600 hover:bg-slate-100 hover:text-slate-900")}
    >
      {children}
    </Link>
  );
}
