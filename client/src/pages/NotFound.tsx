/* ============================================================
   DESIGN: Blueprint Engineering
   Page: 404 Not Found
   ============================================================ */

import { Link } from "wouter";
import Layout from "@/components/Layout";
import { Home, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <Layout>
      <div
        className="flex items-center justify-center min-h-screen"
        style={{ background: "oklch(0.985 0.002 85)" }}
      >
        <div className="text-center px-6 max-w-md">
          <div
            className="text-8xl font-bold mb-4"
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              color: "oklch(0.88 0.008 250)",
              letterSpacing: "-0.05em",
            }}
          >
            404
          </div>
          <div className="text-4xl mb-4">🔍</div>
          <h2
            className="text-xl font-bold mb-3"
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              color: "oklch(0.18 0.02 250)",
            }}
          >
            Page Not Found
          </h2>
          <p
            className="text-sm mb-8 leading-relaxed"
            style={{
              color: "oklch(0.52 0.02 250)",
              fontFamily: "'Source Serif 4', serif",
            }}
          >
            The chapter or page you're looking for doesn't exist. It may have
            been moved or the URL might be incorrect.
          </p>
          <div className="flex items-center justify-center gap-3">
            <Link href="/">
              <button
                className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-all"
                style={{
                  background: "oklch(0.52 0.22 259)",
                  color: "white",
                  fontFamily: "'Space Grotesk', sans-serif",
                }}
              >
                <Home size={14} />
                Go Home
              </button>
            </Link>
            <button
              onClick={() => window.history.back()}
              className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-all border"
              style={{
                background: "white",
                color: "oklch(0.35 0.02 250)",
                borderColor: "oklch(0.88 0.008 250)",
                fontFamily: "'Space Grotesk', sans-serif",
              }}
            >
              <ArrowLeft size={14} />
              Go Back
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
}
