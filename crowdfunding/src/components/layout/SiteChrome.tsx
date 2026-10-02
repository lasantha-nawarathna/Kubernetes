"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";

/** App-style areas (dashboard, admin) hide the marketing footer. */
export function SiteChrome({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const appArea = pathname.startsWith("/dashboard") || pathname.startsWith("/admin");
  return (
    <>
      <Navbar />
      <main className="min-h-[60vh]">{children}</main>
      {!appArea && <Footer />}
    </>
  );
}
