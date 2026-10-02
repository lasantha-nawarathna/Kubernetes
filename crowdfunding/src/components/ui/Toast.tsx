"use client";

import { CheckCircle2, Info, X, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/cn";

export interface ToastMessage {
  id: string;
  title: string;
  description?: string;
  variant?: "success" | "info" | "warning";
}

const icons = {
  success: <CheckCircle2 className="h-5 w-5 text-brand-500" />,
  info: <Info className="h-5 w-5 text-sky-500" />,
  warning: <AlertTriangle className="h-5 w-5 text-amber-500" />,
};

export function ToastViewport({ toasts, onDismiss }: { toasts: ToastMessage[]; onDismiss: (id: string) => void }) {
  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-4 z-[70] flex flex-col items-center gap-2 px-4 sm:inset-x-auto sm:right-6 sm:bottom-6 sm:items-end">
      {toasts.map((t) => (
        <div
          key={t.id}
          role="status"
          className={cn("pointer-events-auto flex w-full max-w-sm items-start gap-3 rounded-2xl border border-slate-100 bg-white p-4 shadow-lift animate-slide-in")}
        >
          {icons[t.variant ?? "success"]}
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-slate-900">{t.title}</p>
            {t.description && <p className="mt-0.5 truncate text-sm text-slate-500">{t.description}</p>}
          </div>
          <button onClick={() => onDismiss(t.id)} className="text-slate-400 hover:text-slate-600" aria-label="Dismiss">
            <X className="h-4 w-4" />
          </button>
        </div>
      ))}
    </div>
  );
}
