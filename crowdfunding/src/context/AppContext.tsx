"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { ContributionModal } from "@/components/ContributionModal";
import { ToastViewport, type ToastMessage } from "@/components/ui/Toast";

interface ContributionTarget {
  campaignId: string;
  rewardId?: string;
}

interface AppState {
  saved: string[];
  isSaved: (id: string) => boolean;
  toggleSave: (id: string, title?: string) => void;
  toast: (t: Omit<ToastMessage, "id">) => void;
  openContribution: (campaignId: string, rewardId?: string) => void;
}

const AppContext = createContext<AppState | null>(null);
const STORAGE_KEY = "fundora:saved";
const DEFAULT_SAVED = ["wanderlight-game", "golden-hour-album", "ocean-cleanup", "kiln-and-clay"];

export function AppProvider({ children }: { children: ReactNode }) {
  const [saved, setSaved] = useState<string[]>(DEFAULT_SAVED);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [contribution, setContribution] = useState<ContributionTarget | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setSaved(JSON.parse(raw));
    } catch {
      /* storage unavailable — keep defaults */
    }
  }, []);

  const persist = (next: string[]) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      /* ignore */
    }
  };

  const toast = useCallback((t: Omit<ToastMessage, "id">) => {
    const id = Math.random().toString(36).slice(2);
    setToasts((prev) => [...prev, { ...t, id }]);
    setTimeout(() => setToasts((prev) => prev.filter((x) => x.id !== id)), 3800);
  }, []);

  const toggleSave = useCallback(
    (id: string, title?: string) => {
      const has = saved.includes(id);
      const next = has ? saved.filter((x) => x !== id) : [...saved, id];
      setSaved(next);
      persist(next);
      toast(
        has
          ? { title: "Removed from saved", description: title, variant: "info" }
          : { title: "Saved to your wishlist", description: title, variant: "success" },
      );
    },
    [saved, toast],
  );

  const value = useMemo<AppState>(
    () => ({
      saved,
      isSaved: (id) => saved.includes(id),
      toggleSave,
      toast,
      openContribution: (campaignId, rewardId) => setContribution({ campaignId, rewardId }),
    }),
    [saved, toggleSave, toast],
  );

  return (
    <AppContext.Provider value={value}>
      {children}
      <ContributionModal target={contribution} onClose={() => setContribution(null)} />
      <ToastViewport toasts={toasts} onDismiss={(id) => setToasts((p) => p.filter((t) => t.id !== id))} />
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used inside AppProvider");
  return ctx;
}
