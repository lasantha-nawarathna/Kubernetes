/* ============================================================
   DESIGN: Blueprint Engineering
   Page: Home — Chapter overview with interactive cards and stats
   ============================================================ */

import { useState } from "react";
import { Link } from "wouter";
import Layout from "@/components/Layout";
import { chapters, chapterGroups, DIFFICULTY_LABELS, type DifficultyLevel } from "@/data/chapters";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { BookOpen, Server, Shield, Zap, ChevronRight, Search } from "lucide-react";

const HERO_IMG = "https://d2xsxph8kpxj0f.cloudfront.net/310519663497990309/hGE5paskEp38fsYKPNESZa/k8s-hero-architecture-asuNrmHkCncM3rbdqL4ZVC.webp";

const difficultyChartData = [
  { name: "Beginner", count: chapters.filter(c => c.difficulty === "beginner").length, color: "#10b981" },
  { name: "Intermediate", count: chapters.filter(c => c.difficulty === "intermediate").length, color: "#f59e0b" },
  { name: "Advanced", count: chapters.filter(c => c.difficulty === "advanced").length, color: "#3b82f6" },
  { name: "Expert", count: chapters.filter(c => c.difficulty === "expert").length, color: "#ef4444" },
];

const stats = [
  { label: "Chapters", value: "27", icon: BookOpen, color: "#3b82f6" },
  { label: "Topics Covered", value: "150+", icon: Server, color: "#10b981" },
  { label: "Code Examples", value: "80+", icon: Zap, color: "#f59e0b" },
  { label: "Security Topics", value: "15+", icon: Shield, color: "#ef4444" },
];

const DIFF_COLORS: Record<DifficultyLevel, string> = {
  beginner: "#10b981",
  intermediate: "#f59e0b",
  advanced: "#3b82f6",
  expert: "#ef4444",
};

const DIFF_BG: Record<DifficultyLevel, string> = {
  beginner: "rgba(16,185,129,0.1)",
  intermediate: "rgba(245,158,11,0.1)",
  advanced: "rgba(59,130,246,0.1)",
  expert: "rgba(239,68,68,0.1)",
};

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<DifficultyLevel | "all">("all");

  const filteredChapters = chapters.filter((c) => {
    const matchesSearch =
      !searchQuery ||
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.topics.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesFilter = activeFilter === "all" || c.difficulty === activeFilter;
    return matchesSearch && matchesFilter;
  });

  return (
    <Layout>
      <div className="min-h-screen" style={{ background: "oklch(0.985 0.002 85)" }}>
        {/* Hero Section */}
        <div className="relative overflow-hidden" style={{ background: "oklch(0.16 0.025 250)" }}>
          <div
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage: `url(${HERO_IMG})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />
          <div className="absolute inset-0" style={{ background: "linear-gradient(to right, oklch(0.16 0.025 250) 40%, transparent)" }} />
          <div className="relative max-w-6xl mx-auto px-6 py-16 lg:py-24">
            <div className="max-w-2xl">
              <div
                className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest px-3 py-1.5 rounded-full mb-6"
                style={{
                  background: "oklch(0.52 0.22 259 / 0.2)",
                  color: "oklch(0.75 0.18 259)",
                  border: "1px solid oklch(0.52 0.22 259 / 0.3)",
                  fontFamily: "'Space Grotesk', sans-serif",
                }}
              >
                2025 Edition · Kubernetes 1.33
              </div>
              <h1
                className="text-4xl lg:text-5xl font-bold text-white mb-4 leading-tight"
                style={{ fontFamily: "'Space Grotesk', sans-serif", letterSpacing: "-0.03em" }}
              >
                Kubernetes
                <br />
                <span style={{ color: "oklch(0.75 0.18 259)" }}>Reference Book</span>
              </h1>
              <p
                className="text-lg mb-8 leading-relaxed"
                style={{ color: "oklch(0.7 0.01 250)", fontFamily: "'Source Serif 4', serif" }}
              >
                A complete, up-to-date guide covering everything from container fundamentals to
                advanced production practices, AI/ML workloads, and certification preparation.
              </p>

              {/* Quick search */}
              <div className="relative max-w-md">
                <Search
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2"
                  style={{ color: "oklch(0.5 0.01 250)" }}
                />
                <input
                  type="text"
                  placeholder="Search topics, commands, concepts..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-lg text-sm outline-none"
                  style={{
                    background: "oklch(0.22 0.025 250)",
                    color: "oklch(0.88 0.01 250)",
                    border: "1px solid oklch(0.35 0.02 250)",
                    fontFamily: "'Space Grotesk', sans-serif",
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-6 py-10">
          {/* Stats Row */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="rounded-xl p-5 border"
                style={{ background: "white", borderColor: "oklch(0.88 0.008 250)" }}
              >
                <div className="flex items-center gap-3 mb-2">
                  <div
                    className="w-9 h-9 rounded-lg flex items-center justify-center"
                    style={{ background: `${stat.color}18` }}
                  >
                    <stat.icon size={18} style={{ color: stat.color }} />
                  </div>
                </div>
                <div
                  className="text-2xl font-bold"
                  style={{ fontFamily: "'Space Grotesk', sans-serif", color: "oklch(0.18 0.02 250)" }}
                >
                  {stat.value}
                </div>
                <div className="text-sm" style={{ color: "oklch(0.52 0.02 250)", fontFamily: "'Space Grotesk', sans-serif" }}>
                  {stat.label}
                </div>
              </div>
            ))}
          </div>

          {/* Chart + Filter Row */}
          <div className="grid lg:grid-cols-3 gap-6 mb-10">
            {/* Distribution Chart */}
            <div
              className="rounded-xl p-5 border"
              style={{ background: "white", borderColor: "oklch(0.88 0.008 250)" }}
            >
              <h3
                className="text-sm font-semibold mb-4"
                style={{ fontFamily: "'Space Grotesk', sans-serif", color: "oklch(0.18 0.02 250)" }}
              >
                Chapters by Difficulty
              </h3>
              <ResponsiveContainer width="100%" height={140}>
                <BarChart data={difficultyChartData} barSize={28}>
                  <XAxis
                    dataKey="name"
                    tick={{ fontSize: 11, fontFamily: "'Space Grotesk', sans-serif", fill: "#64748b" }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis hide />
                  <Tooltip
                    contentStyle={{
                      fontFamily: "'Space Grotesk', sans-serif",
                      fontSize: 12,
                      border: "1px solid #e2e8f0",
                      borderRadius: 8,
                    }}
                  />
                  <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                    {difficultyChartData.map((entry, index) => (
                      <Cell key={index} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Filter Buttons */}
            <div
              className="lg:col-span-2 rounded-xl p-5 border"
              style={{ background: "white", borderColor: "oklch(0.88 0.008 250)" }}
            >
              <h3
                className="text-sm font-semibold mb-4"
                style={{ fontFamily: "'Space Grotesk', sans-serif", color: "oklch(0.18 0.02 250)" }}
              >
                Filter by Level
              </h3>
              <div className="flex flex-wrap gap-2 mb-4">
                {(["all", "beginner", "intermediate", "advanced", "expert"] as const).map((level) => (
                  <button
                    key={level}
                    onClick={() => setActiveFilter(level)}
                    className="px-4 py-2 rounded-lg text-sm font-medium transition-all"
                    style={{
                      fontFamily: "'Space Grotesk', sans-serif",
                      background:
                        activeFilter === level
                          ? level === "all"
                            ? "oklch(0.18 0.02 250)"
                            : DIFF_COLORS[level as DifficultyLevel]
                          : "oklch(0.96 0.003 250)",
                      color:
                        activeFilter === level
                          ? "white"
                          : "oklch(0.4 0.02 250)",
                      border: "1px solid",
                      borderColor:
                        activeFilter === level
                          ? "transparent"
                          : "oklch(0.88 0.008 250)",
                    }}
                  >
                    {level === "all" ? "All Chapters" : DIFFICULTY_LABELS[level as DifficultyLevel]}
                    {level !== "all" && (
                      <span className="ml-1.5 opacity-70">
                        ({chapters.filter((c) => c.difficulty === level).length})
                      </span>
                    )}
                  </button>
                ))}
              </div>
              <p className="text-sm" style={{ color: "oklch(0.52 0.02 250)", fontFamily: "'Source Serif 4', serif" }}>
                Showing <strong>{filteredChapters.length}</strong> of <strong>{chapters.length}</strong> chapters
                {searchQuery && ` matching "${searchQuery}"`}
              </p>
            </div>
          </div>

          {/* Chapter Grid */}
          {searchQuery || activeFilter !== "all" ? (
            <div>
              <h2
                className="text-xl font-bold mb-5"
                style={{ fontFamily: "'Space Grotesk', sans-serif", color: "oklch(0.18 0.02 250)" }}
              >
                {filteredChapters.length} Chapter{filteredChapters.length !== 1 ? "s" : ""} Found
              </h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredChapters.map((chapter) => (
                  <ChapterCard key={chapter.id} chapter={chapter} />
                ))}
              </div>
            </div>
          ) : (
            chapterGroups.map((group) => (
              <div key={group.label} className="mb-10">
                <div className="flex items-center gap-3 mb-5">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{
                      background:
                        group.label === "Beginner"
                          ? "#10b981"
                          : group.label === "Intermediate"
                          ? "#f59e0b"
                          : group.label === "Advanced"
                          ? "#3b82f6"
                          : "#ef4444",
                    }}
                  />
                  <h2
                    className="text-xl font-bold"
                    style={{ fontFamily: "'Space Grotesk', sans-serif", color: "oklch(0.18 0.02 250)" }}
                  >
                    {group.label}
                  </h2>
                  <span
                    className="text-sm px-2 py-0.5 rounded-full"
                    style={{
                      fontFamily: "'Space Grotesk', sans-serif",
                      background: "oklch(0.96 0.003 250)",
                      color: "oklch(0.52 0.02 250)",
                    }}
                  >
                    {group.chapters.length} chapters
                  </span>
                </div>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {group.chapters.map((chapter) => (
                    <ChapterCard key={chapter.id} chapter={chapter} />
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </Layout>
  );
}

function ChapterCard({ chapter }: { chapter: (typeof chapters)[0] }) {
  return (
    <Link href={`/chapter/${chapter.id}`}>
      <div
        className="chapter-card group h-full"
        style={{ background: "white" }}
      >
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="text-xl">{chapter.emoji}</span>
            <span
              className="text-xs font-medium px-2 py-0.5 rounded-full"
              style={{
                fontFamily: "'Space Grotesk', sans-serif",
                background: DIFF_BG[chapter.difficulty],
                color: DIFF_COLORS[chapter.difficulty],
                border: `1px solid ${DIFF_COLORS[chapter.difficulty]}30`,
              }}
            >
              {DIFFICULTY_LABELS[chapter.difficulty]}
            </span>
          </div>
          <span
            className="text-xs font-mono"
            style={{ color: "oklch(0.7 0.01 250)" }}
          >
            #{chapter.id.toString().padStart(2, "0")}
          </span>
        </div>

        <h3
          className="font-semibold text-sm mb-2 leading-snug"
          style={{
            fontFamily: "'Space Grotesk', sans-serif",
            color: "oklch(0.18 0.02 250)",
          }}
        >
          {chapter.title}
        </h3>

        <p
          className="text-xs mb-3 line-clamp-2 leading-relaxed"
          style={{ color: "oklch(0.52 0.02 250)", fontFamily: "'Source Serif 4', serif" }}
        >
          {chapter.description}
        </p>

        <div className="flex flex-wrap gap-1 mb-3">
          {chapter.topics.slice(0, 3).map((topic) => (
            <span
              key={topic}
              className="text-xs px-1.5 py-0.5 rounded"
              style={{
                background: "oklch(0.96 0.003 250)",
                color: "oklch(0.45 0.02 250)",
                fontFamily: "'Space Grotesk', sans-serif",
              }}
            >
              {topic}
            </span>
          ))}
          {chapter.topics.length > 3 && (
            <span
              className="text-xs px-1.5 py-0.5 rounded"
              style={{
                background: "oklch(0.96 0.003 250)",
                color: "oklch(0.55 0.02 250)",
                fontFamily: "'Space Grotesk', sans-serif",
              }}
            >
              +{chapter.topics.length - 3} more
            </span>
          )}
        </div>

        <div
          className="flex items-center gap-1 text-xs font-medium transition-colors group-hover:gap-2"
          style={{
            color: "oklch(0.52 0.22 259)",
            fontFamily: "'Space Grotesk', sans-serif",
          }}
        >
          Read chapter <ChevronRight size={12} />
        </div>
      </div>
    </Link>
  );
}
