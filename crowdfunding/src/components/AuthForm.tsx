"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Eye, EyeOff, LayoutDashboard, Loader2, ShieldCheck } from "lucide-react";
import { Logo } from "@/components/layout/Logo";
import { Button } from "@/components/ui/Button";
import { SmartImage } from "@/components/ui/SmartImage";

export function AuthForm({ mode }: { mode: "signin" | "signup" }) {
  const router = useRouter();
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const isUp = mode === "signup";
  const field =
    "h-12 w-full rounded-2xl border border-slate-200 px-4 outline-none transition focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10";

  const submit = (to: string) => {
    setLoading(true);
    setTimeout(() => router.push(to), 700);
  };

  return (
    <div className="grid min-h-[calc(100vh-72px)] lg:grid-cols-2">
      <div className="flex items-center justify-center px-4 py-12 sm:px-6">
        <div className="w-full max-w-md">
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">{isUp ? "Create your account" : "Welcome back"}</h1>
          <p className="mt-2 text-slate-500">{isUp ? "Join 2.1 million people funding ideas that matter." : "Sign in to manage your campaigns and pledges."}</p>
          <div className="mt-8 grid grid-cols-2 gap-3">
            {["Google", "Apple"].map((p) => (
              <button key={p} onClick={() => submit("/dashboard")} className="flex h-12 items-center justify-center gap-2 rounded-2xl border border-slate-200 font-semibold text-slate-700 transition hover:bg-slate-50">
                {p === "Google" ? <span className="text-lg font-black text-[#4285F4]">G</span> : <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden><path d="M16.37 12.6c-.02-2.2 1.8-3.26 1.88-3.31-1.03-1.5-2.62-1.7-3.18-1.73-1.35-.14-2.64.8-3.33.8-.69 0-1.74-.78-2.87-.76-1.47.02-2.83.86-3.59 2.18-1.53 2.66-.39 6.59 1.1 8.75.73 1.05 1.6 2.24 2.73 2.2 1.1-.05 1.51-.71 2.84-.71 1.32 0 1.7.71 2.86.69 1.18-.02 1.93-1.07 2.65-2.13.84-1.22 1.18-2.4 1.2-2.46-.03-.01-2.3-.88-2.32-3.5zM14.2 6.13c.6-.73 1.01-1.75.9-2.76-.87.04-1.92.58-2.54 1.31-.56.65-1.05 1.68-.92 2.67.97.08 1.96-.49 2.56-1.22z"/></svg>} {p}
              </button>
            ))}
          </div>
          <div className="my-6 flex items-center gap-3 text-xs text-slate-400"><span className="h-px flex-1 bg-slate-200" />or with email<span className="h-px flex-1 bg-slate-200" /></div>
          <form
            className="space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              submit("/dashboard");
            }}
          >
            {isUp && <input className={field} placeholder="Full name" defaultValue="" />}
            <input className={field} type="email" placeholder="Email address" defaultValue="sofia@verdant.garden" />
            <div className="relative">
              <input className={field} type={show ? "text" : "password"} placeholder="Password" defaultValue="demo-password" />
              <button type="button" onClick={() => setShow(!show)} className="absolute top-1/2 right-4 -translate-y-1/2 text-slate-400" aria-label="Toggle password visibility">
                {show ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
            {!isUp && (
              <div className="flex justify-between text-sm">
                <label className="flex items-center gap-2 text-slate-600"><input type="checkbox" defaultChecked className="accent-brand-600" /> Remember me</label>
                <a href="#" className="font-semibold text-brand-700">Forgot password?</a>
              </div>
            )}
            <Button size="lg" className="w-full" disabled={loading}>
              {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : isUp ? "Create account" : "Sign In"}
            </Button>
          </form>
          <div className="mt-6 rounded-2xl bg-slate-50 p-4 text-sm">
            <p className="font-semibold text-slate-700">Prototype shortcuts</p>
            <div className="mt-2 flex flex-wrap gap-2">
              <button onClick={() => submit("/dashboard")} className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 font-medium text-slate-700 shadow-sm hover:text-brand-700"><LayoutDashboard className="h-4 w-4" /> Creator dashboard</button>
              <button onClick={() => submit("/admin")} className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 font-medium text-slate-700 shadow-sm hover:text-brand-700"><ShieldCheck className="h-4 w-4" /> Admin console</button>
            </div>
          </div>
          <p className="mt-6 text-center text-sm text-slate-500">
            {isUp ? "Already have an account? " : "New to Fundora? "}
            <Link href={isUp ? "/signin" : "/signup"} className="font-semibold text-brand-700 hover:underline">{isUp ? "Sign in" : "Create an account"}</Link>
          </p>
        </div>
      </div>
      <div className="relative hidden overflow-hidden lg:block">
        <SmartImage src="1522202176988-66273c2fd55f" alt="Community" width={1400} className="absolute inset-0 h-full w-full" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-900/40 to-brand-900/30" />
        <div className="absolute inset-x-0 bottom-0 p-12 text-white">
          <Logo light />
          <p className="mt-6 text-3xl leading-snug font-bold">&ldquo;We raised €54,000 in 18 days — and found 931 people who believe in what we&apos;re building.&rdquo;</p>
          <p className="mt-4 text-white/70">Sofia Martins, creator of Verdant</p>
        </div>
      </div>
    </div>
  );
}
