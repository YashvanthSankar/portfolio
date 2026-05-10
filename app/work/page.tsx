"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ExternalLink, Star, GitFork, Code2, ArrowLeft, Download, Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Footer, ScrollProgressBar } from "@/components/sections/footer";
import { SectionHeader } from "@/components/ui/section-header";
import { SectionBorder } from "@/components/ui/section-border";
import { cn, throttle } from "@/lib/utils";
import { ThemeToggle } from "@/components/theme-toggle";
import { BrutalButton, BrutalTag } from "@/components/ui/brutal";

const GithubIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" aria-hidden="true" className={className ?? "w-4 h-4"} fill="currentColor">
    <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
  </svg>
);

function WorkNavbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = throttle(() => setScrolled(window.scrollY > 48), 16);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 768) setMenuOpen(false);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    const scrollY = window.scrollY;
    const prevHtml = document.documentElement.style.overflow;
    const prevBody = document.body.style.overflow;
    const prevPos = document.body.style.position;
    const prevTop = document.body.style.top;
    const prevWidth = document.body.style.width;
    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";
    document.body.style.position = "fixed";
    document.body.style.top = `-${scrollY}px`;
    document.body.style.width = "100%";
    return () => {
      document.documentElement.style.overflow = prevHtml;
      document.body.style.overflow = prevBody;
      document.body.style.position = prevPos;
      document.body.style.top = prevTop;
      document.body.style.width = prevWidth;
      window.scrollTo(0, scrollY);
    };
  }, [menuOpen]);

  return (
    <>
      <header className={cn("sticky inset-x-0 top-0 transition-all duration-200", menuOpen ? "z-[130]" : "z-50", scrolled ? "py-3" : "py-4")}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between gap-2 px-3 py-2 border-[2.5px] border-[var(--ink)] bg-[var(--surface)] shadow-brutal">
            <Link
              href="/"
              aria-label="Back to home"
              className="logo-frame relative h-10 w-10 shrink-0 border-2 border-[var(--ink)] overflow-hidden shadow-[3px_3px_0_0_var(--ink)] transition-transform duration-200 ease-[cubic-bezier(0.32,0.72,0,1)] hover:-translate-x-[2px] hover:-translate-y-[2px]"
            >
              <span className="logo-mark" aria-hidden="true" />
            </Link>

            <nav className="hidden md:flex items-center gap-2 absolute left-1/2 -translate-x-1/2">
              <Link
                href="/"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 border-2 border-transparent font-display font-semibold text-sm text-[var(--ink)] transition-[transform,background-color,border-color,box-shadow] duration-200 ease-[cubic-bezier(0.32,0.72,0,1)] hover:-translate-y-[2px] hover:border-[var(--ink)] hover:bg-[var(--surface-alt)] hover:shadow-[3px_3px_0_0_var(--ink)]"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                Home
              </Link>
              <a
                href="https://github.com/YashvanthSankar"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 border-2 border-transparent font-display font-semibold text-sm text-[var(--ink)] transition-[transform,background-color,border-color,box-shadow] duration-200 ease-[cubic-bezier(0.32,0.72,0,1)] hover:-translate-y-[2px] hover:border-[var(--ink)] hover:bg-[var(--surface-alt)] hover:shadow-[3px_3px_0_0_var(--ink)]"
              >
                <GithubIcon className="w-3.5 h-3.5" />
                GitHub
              </a>
            </nav>

            <div className="flex items-center gap-2">
              <ThemeToggle />
              <div className="hidden md:block">
                <BrutalButton as="a" href="/YashvanthS_Resume.pdf" download variant="ghost" size="sm">
                  <Download className="w-3.5 h-3.5" />
                  Resume
                </BrutalButton>
              </div>

              <button
                onClick={() => setMenuOpen((p) => !p)}
                aria-label={menuOpen ? "Close menu" : "Open menu"}
                aria-expanded={menuOpen}
                className="md:hidden inline-flex items-center justify-center w-10 h-10 border-2 border-[var(--ink)] bg-[var(--ink)] text-[var(--paper)] shadow-[3px_3px_0_0_var(--ink)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[1px_1px_0_0_var(--ink)] transition-transform duration-150"
              >
                <AnimatePresence mode="wait" initial={false}>
                  {menuOpen ? (
                    <motion.span key="x" initial={{ opacity: 0, rotate: -90 }} animate={{ opacity: 1, rotate: 0 }} exit={{ opacity: 0, rotate: 90 }} transition={{ duration: 0.15 }} className="flex">
                      <X className="w-4 h-4" />
                    </motion.span>
                  ) : (
                    <motion.span key="menu" initial={{ opacity: 0, rotate: 90 }} animate={{ opacity: 1, rotate: 0 }} exit={{ opacity: 0, rotate: -90 }} transition={{ duration: 0.15 }} className="flex">
                      <Menu className="w-4 h-4" />
                    </motion.span>
                  )}
                </AnimatePresence>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Full-screen typographic mobile menu — matches the home page treatment */}
      <AnimatePresence>
        {menuOpen && (
          <motion.nav
            key="panel"
            initial={{ clipPath: "inset(0% 0% 100% 0%)" }}
            animate={{ clipPath: "inset(0% 0% 0% 0%)" }}
            exit={{ clipPath: "inset(0% 0% 100% 0%)" }}
            transition={{ duration: 0.55, ease: [0.32, 0.72, 0, 1] }}
            className="fixed inset-0 z-[120] md:hidden flex h-dvh w-screen flex-col overflow-hidden bg-[var(--paper)]"
            aria-label="Work page navigation"
          >
            {/* Background watermark */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 flex items-end justify-end overflow-hidden select-none"
            >
              <span
                className="font-display font-bold leading-[0.85] tracking-[-0.06em] text-[var(--ink)] opacity-[0.04] whitespace-nowrap -mr-12 -mb-8"
                style={{ fontSize: "clamp(14rem, 50vw, 28rem)" }}
              >
                WORK.
              </span>
            </div>
            {/* Background grid texture */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 opacity-[0.4]"
              style={{
                backgroundImage:
                  "linear-gradient(rgba(11,11,12,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(11,11,12,0.04) 1px, transparent 1px)",
                backgroundSize: "40px 40px",
              }}
            />

            {/* Top strip */}
            <div className="relative flex items-center justify-between px-6 pt-[max(env(safe-area-inset-top),1.25rem)] pb-4 border-b-[2.5px] border-[var(--ink)]">
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.18, duration: 0.4 }}
              >
                <span className="inline-flex items-center gap-1.5 px-2 py-1 border-2 border-[var(--ink)] bg-[var(--ink)] text-[var(--paper)] font-mono text-[9px] font-bold tracking-[0.22em] uppercase">
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--paper)] opacity-70" />
                    <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[var(--paper)]" />
                  </span>
                  menu · open
                </span>
              </motion.div>
              <motion.button
                initial={{ opacity: 0, rotate: -90, scale: 0.7 }}
                animate={{ opacity: 1, rotate: 0, scale: 1 }}
                exit={{ opacity: 0, rotate: 90, scale: 0.7 }}
                transition={{ delay: 0.18, duration: 0.4, ease: [0.32, 0.72, 0, 1] }}
                onClick={() => setMenuOpen(false)}
                aria-label="Close menu"
                className="inline-flex items-center justify-center w-11 h-11 border-[2.5px] border-[var(--ink)] bg-[var(--ink)] text-[var(--paper)] shadow-[4px_4px_0_0_var(--ink)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[1px_1px_0_0_var(--ink)] transition-transform duration-150"
              >
                <X className="w-5 h-5" />
              </motion.button>
            </div>

            {/* Big editorial nav list */}
            <ul className="relative flex-1 flex flex-col justify-center px-6 gap-1 overflow-y-auto py-6">
              {[
                { label: "Home", href: "/", icon: ArrowLeft, num: "01" },
                { label: "GitHub", href: "https://github.com/YashvanthSankar", icon: () => <GithubIcon className="w-5 h-5" />, num: "02", external: true },
                { label: "Resume", href: "/YashvanthS_Resume.pdf", icon: Download, num: "03", download: true },
              ].map((item, i) => {
                const Tag: "a" | "span" = "a";
                const props = item.external
                  ? { href: item.href, target: "_blank" as const, rel: "noopener noreferrer" }
                  : item.download
                  ? { href: item.href, download: true }
                  : { href: item.href };
                const Icon = item.icon as React.ComponentType<{ className?: string }>;
                return (
                  <motion.li
                    key={item.label}
                    initial={{ opacity: 0, x: -40, skewX: 4 }}
                    animate={{ opacity: 1, x: 0, skewX: 0 }}
                    exit={{ opacity: 0, x: -40 }}
                    transition={{
                      delay: 0.22 + i * 0.06,
                      duration: 0.45,
                      ease: [0.32, 0.72, 0, 1],
                    }}
                  >
                    <Tag
                      {...props}
                      onClick={() => setMenuOpen(false)}
                      className="group relative w-full flex items-baseline gap-4 py-3 text-left border-b-2 border-dashed border-[var(--ink)]/20 transition-colors duration-200"
                    >
                      <span className="font-mono text-[11px] font-bold tabular-nums tracking-[0.18em] text-[var(--muted)] group-hover:text-[var(--ink)] transition-colors duration-200">
                        / {item.num}
                      </span>
                      <span
                        className="font-display font-bold leading-[0.95] tracking-[-0.04em] text-[var(--ink)]/85 group-hover:translate-x-2 group-active:translate-x-1 transition-[color,transform] duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] inline-flex items-center gap-3"
                        style={{ fontSize: "clamp(2.4rem, 11vw, 4rem)" }}
                      >
                        <Icon className="w-7 h-7 shrink-0 opacity-70" />
                        {item.label}
                      </span>
                      <span
                        aria-hidden="true"
                        className="absolute left-0 right-0 bottom-0 h-[3px] bg-[var(--ink)] origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]"
                      />
                    </Tag>
                  </motion.li>
                );
              })}
            </ul>

            {/* Bottom strip */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 24 }}
              transition={{ delay: 0.5, duration: 0.4, ease: [0.32, 0.72, 0, 1] }}
              className="relative px-6 pb-[max(env(safe-area-inset-bottom),1.5rem)] pt-5 border-t-[2.5px] border-[var(--ink)] bg-[var(--paper)]"
            >
              <div className="flex items-center justify-between font-mono text-[9px] tracking-[0.22em] uppercase text-[var(--muted)]">
                <span>portfolio · 2026</span>
                <span>github / repos</span>
              </div>
            </motion.div>
          </motion.nav>
        )}
      </AnimatePresence>
    </>
  );
}

interface Repo {
  name: string;
  description: string | null;
  url: string;
  language: string | null;
  stars: number;
  forks: number;
  topics: string[];
  updated_at: string;
}

function RepoCard({ repo, index }: { repo: Repo; index: number }) {
  const num = String(index + 1).padStart(2, "0");

  return (
    <motion.a
      href={repo.url}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: Math.min(index * 0.03, 0.3) }}
      className="group relative flex flex-col bg-[var(--surface)] border-[2.5px] border-[var(--ink)] shadow-brutal brutal-card-hover overflow-hidden"
    >
      {/* Browser-chrome header */}
      <div className="flex items-center gap-2 px-3 py-2 border-b-2 border-[var(--ink)] bg-[var(--paper)]">
        <span className="flex gap-1.5">
          <span className="w-2 h-2 border-2 border-[var(--ink)] bg-[var(--paper)]" />
          <span className="w-2 h-2 border-2 border-[var(--ink)] bg-[var(--paper)]" />
          <span className="w-2 h-2 border-2 border-[var(--ink)] bg-[var(--paper)]" />
        </span>
        <span className="ml-1 flex-1 truncate font-mono text-[10px] font-bold tracking-wide text-[var(--muted)]">
          github.com/YashvanthSankar/{repo.name}
        </span>
        <span className="font-mono text-[9px] font-bold tracking-[0.18em] uppercase text-[var(--muted)] tabular-nums">
          {num}
        </span>
      </div>

      {/* Title row */}
      <div className="flex items-center justify-between gap-3 px-5 py-4 border-b-2 border-dashed border-[var(--ink)]/30">
        <div className="flex items-center gap-2 min-w-0">
          <span className="font-mono text-xs font-bold shrink-0 text-[var(--muted)]">~/</span>
          <span className="font-display font-bold text-base text-[var(--ink)] truncate tracking-[-0.02em]">
            {repo.name}
          </span>
        </div>
        <ExternalLink className="w-4 h-4 shrink-0 text-[var(--muted)] transition-[transform,color] duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:text-[var(--ink)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden="true" />
      </div>

      {/* Body */}
      <div className="flex flex-col flex-1 p-5 gap-4">
        <p className="text-sm text-[var(--ink)] leading-[1.6] flex-1 line-clamp-3">
          {repo.description ?? <span className="italic text-[var(--muted)]">No description</span>}
        </p>

        {repo.topics.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {repo.topics.slice(0, 3).map((t) => (
              <BrutalTag key={t}>{t}</BrutalTag>
            ))}
          </div>
        )}

        <div className="flex items-center gap-4 text-xs font-mono font-bold text-[var(--ink)] pt-1">
          {repo.language && (
            <span className="inline-flex items-center gap-1">
              <Code2 className="w-3 h-3" />
              {repo.language}
            </span>
          )}
          <span className="inline-flex items-center gap-1">
            <Star className="w-3 h-3" />
            {repo.stars}
          </span>
          <span className="inline-flex items-center gap-1">
            <GitFork className="w-3 h-3" />
            {repo.forks}
          </span>
        </div>
      </div>
    </motion.a>
  );
}

function SkeletonCard() {
  return (
    <div className="bg-[var(--surface)] border-[2.5px] border-[var(--ink)] shadow-brutal overflow-hidden">
      <div className="flex items-center gap-2 px-3 py-2 border-b-2 border-[var(--ink)] bg-[var(--paper)]">
        <span className="flex gap-1.5">
          <span className="w-2 h-2 border-2 border-[var(--ink)]" />
          <span className="w-2 h-2 border-2 border-[var(--ink)]" />
          <span className="w-2 h-2 border-2 border-[var(--ink)]" />
        </span>
        <div className="ml-1 h-2 flex-1 bg-[var(--ink)]/10 animate-pulse" />
      </div>
      <div className="px-5 py-4 border-b-2 border-dashed border-[var(--ink)]/30">
        <div className="h-4 w-36 bg-[var(--ink)]/15 animate-pulse" />
      </div>
      <div className="p-5 space-y-3">
        <div className="h-3 w-full bg-[var(--ink)]/10 animate-pulse" />
        <div className="h-3 w-3/4 bg-[var(--ink)]/10 animate-pulse" />
        <div className="flex gap-1.5 pt-1">
          <div className="h-5 w-14 bg-[var(--ink)]/10 animate-pulse" />
          <div className="h-5 w-10 bg-[var(--ink)]/10 animate-pulse" />
        </div>
      </div>
    </div>
  );
}

export default function WorkPage() {
  const [repos, setRepos] = useState<Repo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/repos.json")
      .then((r) => {
        if (!r.ok) throw new Error("Failed to load");
        return r.json();
      })
      .then((data: Repo[]) => {
        setRepos(
          data.sort(
            (a, b) => b.stars - a.stars || new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
          )
        );
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="relative min-h-screen isolate">
      <ScrollProgressBar />
      <div className="fixed inset-0 -z-10 bg-brutal-grid" aria-hidden="true" />
      <WorkNavbar />

      <SectionBorder label="// work" innerClassName="px-6 sm:px-10 pt-16 pb-10">
        <SectionHeader
          label="all projects"
          title={
            <>
              My{" "}
              <span className="inline-block bg-[var(--ink)] text-[var(--paper)] border-[3px] border-[var(--ink)] px-3 shadow-[6px_6px_0_0_var(--ink)] -rotate-1">
                work.
              </span>
            </>
          }
          description="Every public GitHub repository, sorted by stars."
        />
        {!loading && !error && (
          <p className="inline-flex items-center gap-2 mt-6 px-3 py-1 border-2 border-[var(--ink)] bg-[var(--surface)] shadow-[3px_3px_0_0_var(--ink)] font-mono text-xs font-bold uppercase tracking-widest tabular-nums">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--ink)] opacity-70" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[var(--ink)]" />
            </span>
            {repos.length} repositories
          </p>
        )}
      </SectionBorder>

      <SectionBorder innerClassName="px-6 sm:px-10 py-10 md:py-14">
        {error ? (
          <div className="flex flex-col items-center justify-center py-24 gap-5">
            <div className="px-6 py-4 bg-[var(--ink)] text-[var(--paper)] border-[2.5px] border-[var(--ink)] shadow-brutal font-display font-bold">
              Failed to load repositories
            </div>
            <BrutalButton onClick={() => window.location.reload()} variant="secondary">
              Try again
            </BrutalButton>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {loading
              ? Array.from({ length: 9 }).map((_, i) => <SkeletonCard key={i} />)
              : repos.map((repo, i) => <RepoCard key={repo.name} repo={repo} index={i} />)}
          </div>
        )}

        {!loading && !error && (
          <div className="mt-12 flex justify-center">
            <BrutalButton as="a" href="https://github.com/YashvanthSankar" target="_blank" rel="noopener noreferrer" variant="ink" size="lg">
              <GithubIcon className="w-4 h-4" />
              View all on GitHub
            </BrutalButton>
          </div>
        )}
      </SectionBorder>

      <Footer />
    </div>
  );
}
