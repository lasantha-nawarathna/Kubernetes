import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import { AppProvider } from "@/context/AppContext";
import { SiteChrome } from "@/components/layout/SiteChrome";
import { FontLoader } from "@/components/layout/FontLoader";

export const metadata: Metadata = {
  title: { default: "Fundora — Fund Ideas That Matter", template: "%s · Fundora" },
  description: "Discover inspiring projects, support creative ideas, and help bring great ideas to life.",
};

export const viewport: Viewport = {
  themeColor: "#059669",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body>
        <FontLoader />
        <AppProvider>
          <SiteChrome>{children}</SiteChrome>
        </AppProvider>
      </body>
    </html>
  );
}
