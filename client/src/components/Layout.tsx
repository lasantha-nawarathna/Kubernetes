/* ============================================================
   DESIGN: Blueprint Engineering
   Layout: Three-column (fixed sidebar + content + floating TOC)
   ============================================================ */

import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { chapters, chapterGroups, DIFFICULTY_LABELS, type DifficultyLevel } from "@/data/chapters";
import { Search, Menu, X, BookOpen, ChevronDown, ChevronRight, Home, ExternalLink, Terminal } from "lucide-react";

const DIFFICULTY_DOT: Record<DifficultyLevel, string> = {
  beginner: "bg-emerald-500",
  intermediate: "bg-amber-500",
  advanced: "bg-blue-500",
  expert: "bg-red-500",
};

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const [location] = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({
    Beginner: true,
    Intermediate: true,
    Advanced: true,
    Expert: true,
  });

  const filteredChapters = searchQuery
    ? chapters.filter(
        (c) =>
          c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          c.topics.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    : null;

  const toggleGroup = (label: string) => {
    setExpandedGroups((prev) => ({ ...prev, [label]: !prev[label] }));
  };

  useEffect(() => {
    setSidebarOpen(false);
  }, [location]);

  return (
    <div className="min-h-screen flex flex-col" style={{ fontFamily: "'Source Serif 4', serif" }}>
      {/* Top Header */}
      <header
        className="sticky top-0 z-50 border-b"
        style={{
          background: "oklch(0.16 0.025 250)",
          borderColor: "oklch(0.25 0.02 250)",
        }}
      >
        <div className="flex items-center gap-3 px-4 h-14">
          {/* Mobile menu button */}
          <button
            className="lg:hidden p-1.5 rounded text-slate-400 hover:text-white"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 no-underline">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-sm"
              style={{ background: "oklch(0.52 0.22 259)", fontFamily: "'Space Grotesk', sans-serif" }}
            >
              K8s
            </div>
            <div>
              <div
                className="text-white font-semibold leading-tight text-sm"
                style={{ fontFamily: "'Space Grotesk', sans-serif" }}
              >
                Kubernetes
              </div>
              <div className="text-xs" style={{ color: "oklch(0.6 0.01 250)" }}>
                Reference Book
              </div>
            </div>
          </Link>

          <div className="flex-1" />

          {/* Version badge */}
          <span
            className="hidden sm:inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full"
            style={{
              background: "oklch(0.52 0.22 259 / 0.2)",
              color: "oklch(0.75 0.18 259)",
              fontFamily: "'Space Grotesk', sans-serif",
            }}
          >
            K8s v1.33
          </span>

          <a
            href="https://kubernetes.io/docs"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:flex items-center gap-1 text-xs px-3 py-1.5 rounded border transition-colors"
            style={{
              color: "oklch(0.7 0.01 250)",
              borderColor: "oklch(0.3 0.02 250)",
              fontFamily: "'Space Grotesk', sans-serif",
            }}
          >
            Official Docs <ExternalLink size={11} />
          </a>
        </div>
      </header>

      <div className="flex flex-1 relative">
        {/* Sidebar Overlay (mobile) */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 z-40 lg:hidden"
            style={{ background: "rgba(0,0,0,0.5)" }}
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        <aside
          className={`
            fixed lg:sticky top-14 z-40 lg:z-auto
            w-72 h-[calc(100vh-3.5rem)] overflow-y-auto
            flex-shrink-0 flex flex-col
            transition-transform duration-200 ease-in-out
            ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
          `}
          style={{
            background: "oklch(0.16 0.025 250)",
            borderRight: "1px solid oklch(0.25 0.02 250)",
          }}
        >
          {/* Search */}
          <div className="p-3 border-b" style={{ borderColor: "oklch(0.25 0.02 250)" }}>
            <div className="relative">
              <Search
                size={14}
                className="absolute left-2.5 top-1/2 -translate-y-1/2"
                style={{ color: "oklch(0.5 0.01 250)" }}
              />
              <input
                type="text"
                placeholder="Search chapters..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 rounded text-sm outline-none"
                style={{
                  background: "oklch(0.22 0.025 250)",
                  color: "oklch(0.88 0.01 250)",
                  border: "1px solid oklch(0.3 0.02 250)",
                  fontFamily: "'Space Grotesk', sans-serif",
                }}
              />
            </div>
          </div>

          {/* Home link */}
          <div className="px-3 pt-3 space-y-0.5">
            <Link href="/" className="nav-item flex">
              <Home size={14} />
              <span>Home</span>
            </Link>
            <Link href="/cheatsheet" className="nav-item flex">
              <Terminal size={14} />
              <span>kubectl Cheat Sheet</span>
            </Link>
          </div>

          {/* Nav */}
          <nav className="flex-1 px-3 pb-6 pt-2">
            {searchQuery && filteredChapters ? (
              <div>
                <div
                  className="text-xs font-semibold uppercase tracking-wider mb-2 px-2"
                  style={{ color: "oklch(0.5 0.01 250)", fontFamily: "'Space Grotesk', sans-serif" }}
                >
                  {filteredChapters.length} results
                </div>
                {filteredChapters.map((chapter) => (
                  <NavItem key={chapter.id} chapter={chapter} currentPath={location} />
                ))}
              </div>
            ) : (
              chapterGroups.map((group) => (
                <div key={group.label} className="mb-2">
                  <button
                    onClick={() => toggleGroup(group.label)}
                    className="w-full flex items-center gap-2 px-2 py-1.5 rounded text-xs font-semibold uppercase tracking-wider transition-colors"
                    style={{
                      color: "oklch(0.55 0.01 250)",
                      fontFamily: "'Space Grotesk', sans-serif",
                    }}
                  >
                    {expandedGroups[group.label] ? (
                      <ChevronDown size={12} />
                    ) : (
                      <ChevronRight size={12} />
                    )}
                    <span
                      className="w-2 h-2 rounded-full flex-shrink-0"
                      style={{
                        background:
                          group.label === "Beginner"
                            ? "oklch(0.65 0.18 145)"
                            : group.label === "Intermediate"
                            ? "oklch(0.72 0.18 85)"
                            : group.label === "Advanced"
                            ? "oklch(0.52 0.22 259)"
                            : "oklch(0.55 0.22 27)",
                      }}
                    />
                    {group.label}
                  </button>
                  {expandedGroups[group.label] && (
                    <div className="mt-0.5">
                      {group.chapters.map((chapter) => (
                        <NavItem key={chapter.id} chapter={chapter} currentPath={location} />
                      ))}
                    </div>
                  )}
                </div>
              ))
            )}
          </nav>

          {/* Footer */}
          <div
            className="px-4 py-3 border-t text-xs"
            style={{
              borderColor: "oklch(0.25 0.02 250)",
              color: "oklch(0.45 0.01 250)",
              fontFamily: "'Space Grotesk', sans-serif",
            }}
          >
            <div className="flex items-center gap-1.5 mb-1">
              <BookOpen size={11} />
              <span>27 Chapters · 2025 Edition</span>
            </div>
            <div>Updated for Kubernetes 1.33</div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 min-w-0">{children}</main>
      </div>
    </div>
  );
}

function NavItem({
  chapter,
  currentPath,
}: {
  chapter: (typeof chapters)[0];
  currentPath: string;
}) {
  const isActive = currentPath === `/chapter/${chapter.id}`;
  return (
    <Link href={`/chapter/${chapter.id}`}>
      <div
        className={`nav-item ${isActive ? "active" : ""}`}
        style={
          isActive
            ? {
                background: "oklch(0.52 0.22 259 / 0.15)",
                color: "oklch(0.75 0.18 259)",
                borderLeft: "2px solid oklch(0.52 0.22 259)",
                paddingLeft: "10px",
              }
            : {}
        }
      >
        <span className="flex-shrink-0 text-sm">{chapter.emoji}</span>
        <span className="truncate text-xs leading-tight">
          {chapter.id}. {chapter.title}
        </span>
      </div>
    </Link>
  );
}
