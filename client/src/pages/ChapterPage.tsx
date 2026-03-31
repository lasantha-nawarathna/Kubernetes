/* ============================================================
   DESIGN: Blueprint Engineering
   Page: Chapter — Full chapter content with TOC, code blocks, navigation
   ============================================================ */

import { useState, useEffect, useRef } from "react";
import { Link, useParams } from "wouter";
import Layout from "@/components/Layout";
import { chapters, DIFFICULTY_LABELS, DIFFICULTY_COLORS, type DifficultyLevel } from "@/data/chapters";
import {
  ChevronLeft,
  ChevronRight,
  Copy,
  Check,
  BookOpen,
  List,
  ArrowUp,
} from "lucide-react";

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

// Syntax highlighting for code blocks
function highlightCode(code: string, lang: string): string {
  if (lang === "bash" || lang === "sh") {
    return code
      .replace(/(#[^\n]*)/g, '<span class="token-comment">$1</span>')
      .replace(/\b(kubectl|docker|helm|kind|minikube|eksctl|argocd|etcdctl)\b/g, '<span class="token-keyword">$1</span>')
      .replace(/(--[\w-]+=?)/g, '<span class="token-property">$1</span>')
      .replace(/("([^"]*)")/g, '<span class="token-string">$1</span>')
      .replace(/('([^']*)')/g, '<span class="token-string">$1</span>');
  }
  if (lang === "yaml") {
    return code
      .replace(/(#[^\n]*)/g, '<span class="token-comment">$1</span>')
      .replace(/^(\s*)([\w-]+):/gm, '$1<span class="token-property">$2</span>:')
      .replace(/:\s+("([^"]*)")/g, ': <span class="token-string">$1</span>')
      .replace(/:\s+('([^']*)')/g, ': <span class="token-string">$1</span>')
      .replace(/:\s+(\d+)/g, ': <span class="token-number">$1</span>')
      .replace(/:\s+(true|false|null)/g, ': <span class="token-keyword">$1</span>');
  }
  if (lang === "go") {
    return code
      .replace(/(\/\/[^\n]*)/g, '<span class="token-comment">$1</span>')
      .replace(/\b(func|return|if|else|for|range|var|const|type|struct|interface|package|import|nil|error)\b/g, '<span class="token-keyword">$1</span>')
      .replace(/("([^"]*)")/g, '<span class="token-string">$1</span>');
  }
  if (lang === "dockerfile") {
    return code
      .replace(/(#[^\n]*)/g, '<span class="token-comment">$1</span>')
      .replace(/^(FROM|RUN|CMD|EXPOSE|ENV|ADD|COPY|ENTRYPOINT|WORKDIR|USER|VOLUME|LABEL|ARG|HEALTHCHECK|ONBUILD|STOPSIGNAL)/gm, '<span class="token-keyword">$1</span>');
  }
  return code;
}

function CodeBlock({ code, lang, label }: { code: string; lang: string; label: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const highlighted = highlightCode(code, lang);

  return (
    <div className="my-5 rounded-xl overflow-hidden" style={{ border: "1px solid oklch(0.25 0.02 250)" }}>
      {/* Code block header */}
      <div
        className="flex items-center justify-between px-4 py-2.5"
        style={{ background: "oklch(0.14 0.025 250)" }}
      >
        <div className="flex items-center gap-2.5">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-500 opacity-70" />
            <div className="w-3 h-3 rounded-full bg-yellow-500 opacity-70" />
            <div className="w-3 h-3 rounded-full bg-green-500 opacity-70" />
          </div>
          <span
            className="text-xs"
            style={{ color: "oklch(0.55 0.01 250)", fontFamily: "'Space Grotesk', sans-serif" }}
          >
            {label}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span
            className="text-xs px-2 py-0.5 rounded"
            style={{
              background: "oklch(0.22 0.025 250)",
              color: "oklch(0.55 0.01 250)",
              fontFamily: "'JetBrains Mono', monospace",
            }}
          >
            {lang}
          </span>
          <button
            onClick={handleCopy}
            className="flex items-center gap-1 text-xs px-2 py-1 rounded transition-colors"
            style={{
              background: copied ? "oklch(0.52 0.22 259 / 0.2)" : "oklch(0.22 0.025 250)",
              color: copied ? "oklch(0.75 0.18 259)" : "oklch(0.55 0.01 250)",
              fontFamily: "'Space Grotesk', sans-serif",
            }}
          >
            {copied ? <Check size={11} /> : <Copy size={11} />}
            {copied ? "Copied!" : "Copy"}
          </button>
        </div>
      </div>
      {/* Code content */}
      <div
        className="overflow-x-auto"
        style={{ background: "oklch(0.12 0.02 250)" }}
      >
        <pre
          className="p-5 text-sm leading-relaxed"
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            color: "oklch(0.85 0.01 250)",
            margin: 0,
            tabSize: 2,
          }}
          dangerouslySetInnerHTML={{ __html: highlighted }}
        />
      </div>
    </div>
  );
}

function renderContent(content: string) {
  // Convert **bold** to <strong>
  const parts = content.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={i}>{part.slice(2, -2)}</strong>;
    }
    // Convert `code` to inline code
    const codeParts = part.split(/(`[^`]+`)/g);
    return codeParts.map((cp, j) => {
      if (cp.startsWith("`") && cp.endsWith("`")) {
        return (
          <code
            key={`${i}-${j}`}
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: "0.875em",
              background: "oklch(0.93 0.015 259)",
              color: "oklch(0.35 0.18 259)",
              padding: "0.1em 0.35em",
              borderRadius: "0.25rem",
            }}
          >
            {cp.slice(1, -1)}
          </code>
        );
      }
      return cp;
    });
  });
}

export default function ChapterPage() {
  const params = useParams<{ id: string }>();
  const chapterId = parseInt(params.id || "1");
  const chapter = chapters.find((c) => c.id === chapterId);
  const prevChapter = chapters.find((c) => c.id === chapterId - 1);
  const nextChapter = chapters.find((c) => c.id === chapterId + 1);
  const [activeSection, setActiveSection] = useState(0);
  const [showTOC, setShowTOC] = useState(true);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    window.scrollTo({ top: 0 });
    setActiveSection(0);
  }, [chapterId]);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (!chapter) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="text-4xl mb-4">🔍</div>
            <h2
              className="text-xl font-bold mb-2"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              Chapter not found
            </h2>
            <Link href="/" className="text-blue-600 hover:underline">
              Return to home
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="flex min-h-screen" style={{ background: "oklch(0.985 0.002 85)" }}>
        {/* Main Content Area */}
        <div className="flex-1 min-w-0">
          {/* Chapter Hero */}
          <div
            className="relative overflow-hidden"
            style={{
              background: chapter.image
                ? undefined
                : `linear-gradient(135deg, oklch(0.18 0.02 250), oklch(0.22 0.025 250))`,
            }}
          >
            {chapter.image && (
              <>
                <div
                  className="absolute inset-0"
                  style={{
                    backgroundImage: `url(${chapter.image})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    opacity: 0.15,
                  }}
                />
                <div
                  className="absolute inset-0"
                  style={{
                    background: "linear-gradient(135deg, oklch(0.16 0.025 250) 50%, oklch(0.22 0.025 250 / 0.8))",
                  }}
                />
              </>
            )}
            <div className="relative px-6 lg:px-10 py-10">
              {/* Breadcrumb */}
              <div
                className="flex items-center gap-2 text-xs mb-6"
                style={{ color: "oklch(0.55 0.01 250)", fontFamily: "'Space Grotesk', sans-serif" }}
              >
                <Link href="/" className="hover:text-white transition-colors">
                  Home
                </Link>
                <ChevronRight size={12} />
                <span
                  className="px-2 py-0.5 rounded-full text-xs"
                  style={{
                    background: DIFF_BG[chapter.difficulty],
                    color: DIFF_COLORS[chapter.difficulty],
                  }}
                >
                  {DIFFICULTY_LABELS[chapter.difficulty]}
                </span>
                <ChevronRight size={12} />
                <span className="text-white">Chapter {chapter.id}</span>
              </div>

              <div className="flex items-start gap-4">
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0"
                  style={{
                    background: `${DIFF_COLORS[chapter.difficulty]}20`,
                    border: `1px solid ${DIFF_COLORS[chapter.difficulty]}40`,
                  }}
                >
                  {chapter.emoji}
                </div>
                <div>
                  <div
                    className="text-xs font-semibold uppercase tracking-wider mb-1"
                    style={{ color: DIFF_COLORS[chapter.difficulty], fontFamily: "'Space Grotesk', sans-serif" }}
                  >
                    Chapter {chapter.id} · {DIFFICULTY_LABELS[chapter.difficulty]}
                  </div>
                  <h1
                    className="text-2xl lg:text-3xl font-bold text-white mb-3"
                    style={{ fontFamily: "'Space Grotesk', sans-serif", letterSpacing: "-0.02em" }}
                  >
                    {chapter.title}
                  </h1>
                  <p
                    className="text-sm max-w-2xl leading-relaxed"
                    style={{ color: "oklch(0.7 0.01 250)", fontFamily: "'Source Serif 4', serif" }}
                  >
                    {chapter.description}
                  </p>
                </div>
              </div>

              {/* Topics pills */}
              <div className="flex flex-wrap gap-2 mt-5">
                {chapter.topics.map((topic) => (
                  <span
                    key={topic}
                    className="text-xs px-2.5 py-1 rounded-full"
                    style={{
                      background: "oklch(0.22 0.025 250)",
                      color: "oklch(0.7 0.01 250)",
                      border: "1px solid oklch(0.3 0.02 250)",
                      fontFamily: "'Space Grotesk', sans-serif",
                    }}
                  >
                    {topic}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="px-6 lg:px-10 py-8 max-w-4xl" ref={contentRef}>
            {/* Section Tabs */}
            {chapter.sections.length > 1 && (
              <div
                className="flex gap-1 mb-8 p-1 rounded-xl overflow-x-auto"
                style={{ background: "white", border: "1px solid oklch(0.88 0.008 250)" }}
              >
                {chapter.sections.map((section, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveSection(idx)}
                    className="flex-shrink-0 px-3 py-2 rounded-lg text-xs font-medium transition-all"
                    style={{
                      fontFamily: "'Space Grotesk', sans-serif",
                      background: activeSection === idx ? "oklch(0.18 0.02 250)" : "transparent",
                      color: activeSection === idx ? "white" : "oklch(0.45 0.02 250)",
                    }}
                  >
                    {section.title}
                  </button>
                ))}
              </div>
            )}

            {/* Active Section Content */}
            {chapter.sections.map((section, idx) => (
              <div
                key={idx}
                style={{ display: activeSection === idx ? "block" : "none" }}
              >
                <h2
                  className="text-xl font-bold mb-5"
                  style={{
                    fontFamily: "'Space Grotesk', sans-serif",
                    color: "oklch(0.18 0.02 250)",
                    letterSpacing: "-0.02em",
                  }}
                >
                  {section.title}
                </h2>

                <div className="prose-k8s">
                  {section.content.split("\n\n").map((paragraph, pIdx) => {
                    if (paragraph.trim().startsWith("**") && paragraph.includes(":**")) {
                      // Treat as a definition/highlight block
                      return (
                        <div
                          key={pIdx}
                          className="my-4 p-4 rounded-lg"
                          style={{
                            background: "oklch(0.93 0.015 259 / 0.3)",
                            borderLeft: "3px solid oklch(0.52 0.22 259)",
                          }}
                        >
                          <p style={{ margin: 0, lineHeight: 1.7 }}>{renderContent(paragraph)}</p>
                        </div>
                      );
                    }
                    return (
                      <p key={pIdx} style={{ marginBottom: "1rem", lineHeight: 1.75 }}>
                        {renderContent(paragraph)}
                      </p>
                    );
                  })}
                </div>

                {/* Code blocks */}
                {section.code?.map((codeBlock, cIdx) => (
                  <CodeBlock
                    key={cIdx}
                    code={codeBlock.code}
                    lang={codeBlock.lang}
                    label={codeBlock.label}
                  />
                ))}
              </div>
            ))}

            {/* Chapter Navigation */}
            <div
              className="flex items-center justify-between mt-12 pt-8"
              style={{ borderTop: "1px solid oklch(0.88 0.008 250)" }}
            >
              {prevChapter ? (
                <Link href={`/chapter/${prevChapter.id}`}>
                  <div
                    className="flex items-center gap-3 p-4 rounded-xl border transition-all hover:border-blue-400 cursor-pointer"
                    style={{
                      background: "white",
                      borderColor: "oklch(0.88 0.008 250)",
                      maxWidth: "220px",
                    }}
                  >
                    <ChevronLeft size={16} style={{ color: "oklch(0.52 0.22 259)" }} />
                    <div>
                      <div
                        className="text-xs"
                        style={{ color: "oklch(0.55 0.02 250)", fontFamily: "'Space Grotesk', sans-serif" }}
                      >
                        Previous
                      </div>
                      <div
                        className="text-sm font-semibold truncate"
                        style={{ fontFamily: "'Space Grotesk', sans-serif", color: "oklch(0.18 0.02 250)" }}
                      >
                        {prevChapter.emoji} {prevChapter.title}
                      </div>
                    </div>
                  </div>
                </Link>
              ) : (
                <div />
              )}

              {nextChapter ? (
                <Link href={`/chapter/${nextChapter.id}`}>
                  <div
                    className="flex items-center gap-3 p-4 rounded-xl border transition-all hover:border-blue-400 cursor-pointer text-right"
                    style={{
                      background: "white",
                      borderColor: "oklch(0.88 0.008 250)",
                      maxWidth: "220px",
                    }}
                  >
                    <div>
                      <div
                        className="text-xs"
                        style={{ color: "oklch(0.55 0.02 250)", fontFamily: "'Space Grotesk', sans-serif" }}
                      >
                        Next
                      </div>
                      <div
                        className="text-sm font-semibold truncate"
                        style={{ fontFamily: "'Space Grotesk', sans-serif", color: "oklch(0.18 0.02 250)" }}
                      >
                        {nextChapter.emoji} {nextChapter.title}
                      </div>
                    </div>
                    <ChevronRight size={16} style={{ color: "oklch(0.52 0.22 259)" }} />
                  </div>
                </Link>
              ) : (
                <div />
              )}
            </div>
          </div>
        </div>

        {/* Right TOC Panel */}
        <aside
          className="hidden xl:block w-64 flex-shrink-0 sticky top-14 h-[calc(100vh-3.5rem)] overflow-y-auto"
          style={{
            borderLeft: "1px solid oklch(0.88 0.008 250)",
            background: "white",
          }}
        >
          <div className="p-5">
            <div
              className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider mb-4"
              style={{ color: "oklch(0.45 0.02 250)", fontFamily: "'Space Grotesk', sans-serif" }}
            >
              <List size={12} />
              On This Page
            </div>
            <nav className="space-y-1">
              {chapter.sections.map((section, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveSection(idx)}
                  className="w-full text-left px-3 py-2 rounded-lg text-xs transition-all"
                  style={{
                    fontFamily: "'Space Grotesk', sans-serif",
                    background: activeSection === idx ? "oklch(0.93 0.015 259 / 0.3)" : "transparent",
                    color: activeSection === idx ? "oklch(0.35 0.18 259)" : "oklch(0.45 0.02 250)",
                    fontWeight: activeSection === idx ? 600 : 400,
                    borderLeft: activeSection === idx ? "2px solid oklch(0.52 0.22 259)" : "2px solid transparent",
                  }}
                >
                  {section.title}
                </button>
              ))}
            </nav>

            {/* Chapter info */}
            <div
              className="mt-6 pt-5"
              style={{ borderTop: "1px solid oklch(0.88 0.008 250)" }}
            >
              <div
                className="text-xs font-semibold uppercase tracking-wider mb-3"
                style={{ color: "oklch(0.45 0.02 250)", fontFamily: "'Space Grotesk', sans-serif" }}
              >
                Chapter Info
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span
                    className="text-xs"
                    style={{ color: "oklch(0.55 0.02 250)", fontFamily: "'Space Grotesk', sans-serif" }}
                  >
                    Level
                  </span>
                  <span
                    className="text-xs px-2 py-0.5 rounded-full"
                    style={{
                      background: DIFF_BG[chapter.difficulty],
                      color: DIFF_COLORS[chapter.difficulty],
                      fontFamily: "'Space Grotesk', sans-serif",
                    }}
                  >
                    {DIFFICULTY_LABELS[chapter.difficulty]}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span
                    className="text-xs"
                    style={{ color: "oklch(0.55 0.02 250)", fontFamily: "'Space Grotesk', sans-serif" }}
                  >
                    Sections
                  </span>
                  <span
                    className="text-xs font-medium"
                    style={{ color: "oklch(0.35 0.02 250)", fontFamily: "'Space Grotesk', sans-serif" }}
                  >
                    {chapter.sections.length}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span
                    className="text-xs"
                    style={{ color: "oklch(0.55 0.02 250)", fontFamily: "'Space Grotesk', sans-serif" }}
                  >
                    Code Examples
                  </span>
                  <span
                    className="text-xs font-medium"
                    style={{ color: "oklch(0.35 0.02 250)", fontFamily: "'Space Grotesk', sans-serif" }}
                  >
                    {chapter.sections.reduce((sum, s) => sum + (s.code?.length || 0), 0)}
                  </span>
                </div>
              </div>
            </div>

            {/* Navigation */}
            <div
              className="mt-5 pt-5"
              style={{ borderTop: "1px solid oklch(0.88 0.008 250)" }}
            >
              <div className="space-y-1">
                {prevChapter && (
                  <Link href={`/chapter/${prevChapter.id}`}>
                    <div
                      className="flex items-center gap-2 text-xs px-2 py-1.5 rounded-lg transition-colors cursor-pointer"
                      style={{
                        color: "oklch(0.45 0.02 250)",
                        fontFamily: "'Space Grotesk', sans-serif",
                      }}
                    >
                      <ChevronLeft size={12} />
                      <span className="truncate">
                        {prevChapter.emoji} {prevChapter.title}
                      </span>
                    </div>
                  </Link>
                )}
                {nextChapter && (
                  <Link href={`/chapter/${nextChapter.id}`}>
                    <div
                      className="flex items-center gap-2 text-xs px-2 py-1.5 rounded-lg transition-colors cursor-pointer"
                      style={{
                        color: "oklch(0.45 0.02 250)",
                        fontFamily: "'Space Grotesk', sans-serif",
                      }}
                    >
                      <ChevronRight size={12} />
                      <span className="truncate">
                        {nextChapter.emoji} {nextChapter.title}
                      </span>
                    </div>
                  </Link>
                )}
              </div>
            </div>
          </div>
        </aside>
      </div>

      {/* Scroll to top */}
      {showScrollTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="fixed bottom-6 right-6 w-10 h-10 rounded-full flex items-center justify-center shadow-lg transition-all z-50"
          style={{
            background: "oklch(0.52 0.22 259)",
            color: "white",
          }}
        >
          <ArrowUp size={16} />
        </button>
      )}
    </Layout>
  );
}
