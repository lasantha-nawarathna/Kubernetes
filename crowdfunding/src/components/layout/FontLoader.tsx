"use client";

import { useEffect } from "react";

const HREF = "https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap";

/** Loads the web font without blocking first paint; system fonts are the fallback. */
export function FontLoader() {
  useEffect(() => {
    if (document.querySelector(`link[href="${HREF}"]`)) return;
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = HREF;
    document.head.appendChild(link);
  }, []);
  return null;
}
