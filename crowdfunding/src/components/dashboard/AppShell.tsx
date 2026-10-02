"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { Avatar } from "@/components/ui/Avatar";
import { cn } from "@/lib/cn";

export interface ShellNavItem {
  href: string;
  label: string;
  Icon: LucideIcon;
  badge?: number;
  exact?: boolean;
}

export function AppShell({
  nav,
  footerNav,
  user,
  title,
  children,
}: {
  nav: ShellNavItem[];
  footerNav: ShellNavItem[];
  user: { name: string; subtitle: string; avatar?: string };
  title: string;
  children: ReactNode;
}) {
  const pathname = usePathname();
  const isActive = (i: ShellNavItem) => (i.exact ? pathname === i.href : pathname === i.href || pathname.startsWith(i.href + "/"));

  const renderItem = (i: ShellNavItem) => (
    <Link
      key={i.href + i.label}
      href={i.href}
      className={cn(
        "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition",
        isActive(i) ? "bg-brand-50 text-brand-700" : "text-slate-600 hover:bg-slate-50 hover:text-slate-900",
      )}
    >
      <i.Icon className={cn("h-5 w-5", isActive(i) ? "text-brand-600" : "text-slate-400")} />
      <span className="flex-1">{i.label}</span>
      {!!i.badge && <span className="rounded-full bg-brand-600 px-2 py-0.5 text-xs text-white">{i.badge}</span>}
    </Link>
  );

  return (
    <div className="bg-slate-50/70">
      <div className="mx-auto flex max-w-[1440px] gap-6 px-4 py-6 sm:px-6 lg:px-8">
        <aside className="hidden w-64 shrink-0 lg:block">
          <div className="sticky top-24 flex max-h-[calc(100vh-7rem)] flex-col rounded-3xl border border-slate-100 bg-white p-4 shadow-soft">
            <div className="flex items-center gap-3 rounded-2xl bg-slate-50 p-3">
              <Avatar src={user.avatar} name={user.name} size={40} />
              <div className="min-w-0">
                <p className="truncate text-sm font-bold text-slate-900">{user.name}</p>
                <p className="truncate text-xs text-slate-500">{user.subtitle}</p>
              </div>
            </div>
            <p className="mt-5 mb-2 px-3 text-[11px] font-bold tracking-wider text-slate-400 uppercase">{title}</p>
            <nav className="flex-1 space-y-0.5 overflow-y-auto">{nav.map(renderItem)}</nav>
            <div className="mt-4 space-y-0.5 border-t border-slate-100 pt-4">{footerNav.map(renderItem)}</div>
          </div>
        </aside>

        <div className="min-w-0 flex-1">
          {/* Mobile nav */}
          <nav className="no-scrollbar -mx-4 mb-6 flex gap-2 overflow-x-auto px-4 pb-1 sm:-mx-6 sm:px-6 lg:hidden">
            {[...nav, ...footerNav].map((i) => (
              <Link
                key={i.href + i.label}
                href={i.href}
                className={cn(
                  "flex shrink-0 items-center gap-1.5 rounded-full border px-3.5 py-2 text-sm font-semibold transition",
                  isActive(i) ? "border-slate-900 bg-slate-900 text-white" : "border-slate-200 bg-white text-slate-600",
                )}
              >
                <i.Icon className="h-4 w-4" /> {i.label}
                {!!i.badge && <span className="rounded-full bg-brand-500 px-1.5 text-[10px] text-white">{i.badge}</span>}
              </Link>
            ))}
          </nav>
          {children}
        </div>
      </div>
    </div>
  );
}

export function PageHeader({ title, description, actions }: { title: string; description?: string; actions?: ReactNode }) {
  return (
    <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">{title}</h1>
        {description && <p className="mt-1 text-slate-500">{description}</p>}
      </div>
      {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
    </div>
  );
}

export function Panel({ title, action, children, className }: { title?: string; action?: ReactNode; children: ReactNode; className?: string }) {
  return (
    <section className={cn("min-w-0 rounded-3xl border border-slate-100 bg-white p-5 shadow-soft sm:p-6", className)}>
      {(title || action) && (
        <div className="mb-4 flex items-center justify-between gap-3">
          {title && <h2 className="font-bold text-slate-900">{title}</h2>}
          {action}
        </div>
      )}
      {children}
    </section>
  );
}
