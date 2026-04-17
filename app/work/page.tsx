"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ExternalLink, Star, GitFork, Code2, ArrowLeft, Download, Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Footer } from "@/components/sections/footer";
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
          <div className="flex items-center justify-between gap-2 px-3 py-2 border-[2.5px] border-[var(--border-ink)] bg-[var(--surface)] shadow-brutal">
            <Link
              href="/"
              aria-label="Back to home"
              className="relative h-10 w-10 shrink-0 border-2 border-[var(--border-ink)] overflow-hidden bg-[var(--accent)]"
            >
              <Image src="/ys_red.webp" alt="" fill className="object-cover" quality={85} />
            </Link>

            <nav className="hidden md:flex items-center gap-2 absolute left-1/2 -translate-x-1/2">
              <Link
                href="/"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 border-2 border-transparent font-display font-semibold text-sm text-[var(--ink)] hover:border-[var(--border-ink)] hover:bg-[var(--surface)] hover:shadow-[3px_3px_0_0_var(--border-ink)] hover:-translate-y-[1px] transition-transform duration-100"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                Home
              </Link>
              <a
                href="https://github.com/YashvanthSankar"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 border-2 border-transparent font-display font-semibold text-sm text-[var(--ink)] hover:border-[var(--border-ink)] hover:bg-[var(--surface)] hover:shadow-[3px_3px_0_0_var(--border-ink)] hover:-translate-y-[1px] transition-transform duration-100"
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
                className="md:hidden inline-flex items-center justify-center w-10 h-10 border-2 border-[var(--border-ink)] bg-[var(--accent)] text-[var(--accent-ink)] shadow-[3px_3px_0_0_var(--border-ink)]"
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

      <AnimatePresence>
        {menuOpen && (
          <motion.nav
            key="panel"
            initial={{ x: "-100%" }}
            animate={{ x: "0%" }}
            exit={{ x: "-100%" }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 z-[120] md:hidden flex h-dvh w-screen flex-col bg-[var(--paper)]"
          >
            <div className="flex items-center justify-between px-6 pt-[max(env(safe-area-inset-top),1rem)] pb-4 border-b-[2.5px] border-[var(--border-ink)]">
              <span className="font-display font-bold text-lg">Menu</span>
              <button
                onClick={() => setMenuOpen(false)}
                aria-label="Close menu"
                className="inline-flex items-center justify-center w-10 h-10 border-2 border-[var(--border-ink)] bg-[var(--accent)] text-[var(--accent-ink)] shadow-[3px_3px_0_0_var(--border-ink)]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <ul className="flex-1 flex flex-col justify-center px-6 gap-3">
              <li>
                <Link
                  href="/"
                  onClick={() => setMenuOpen(false)}
                  className="w-full flex items-center gap-4 px-5 py-4 text-left border-[2.5px] border-[var(--border-ink)] bg-[var(--surface)] text-[var(--ink)] font-display font-bold text-2xl shadow-brutal hover:-translate-x-[2px] hover:-translate-y-[2px] hover:shadow-[8px_8px_0_0_var(--border-ink)] transition-transform duration-150"
                >
                  <ArrowLeft className="w-5 h-5 shrink-0" aria-hidden="true" />
                  Back to home
                </Link>
              </li>
              <li>
                <a
                  href="https://github.com/YashvanthSankar"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setMenuOpen(false)}
                  className="w-full flex items-center gap-4 px-5 py-4 text-left border-[2.5px] border-[var(--border-ink)] bg-[var(--ink)] text-[var(--paper)] font-display font-bold text-2xl shadow-brutal hover:-translate-x-[2px] hover:-translate-y-[2px] hover:shadow-[8px_8px_0_0_var(--border-ink)] transition-transform duration-150"
                >
                  <GithubIcon className="w-5 h-5 shrink-0" />
                  GitHub profile
                </a>
              </li>
            </ul>

            <div className="px-6 pb-8 border-t-[2.5px] border-[var(--border-ink)] pt-5">
              <BrutalButton as="a" href="/YashvanthS_Resume.pdf" download variant="ghost" className="w-full">
                <Download className="w-4 h-4" />
                Resume
              </BrutalButton>
            </div>
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

const repoHeaderVariants = [
  "bg-[var(--accent)] text-[var(--accent-ink)]",
  "bg-[var(--ink)] text-[var(--paper)]",
  "bg-[var(--surface-alt)] text-[var(--ink)]",
];

function RepoCard({ repo, index }: { repo: Repo; index: number }) {
  const headerClass = repoHeaderVariants[index % repoHeaderVariants.length];

  return (
    <motion.a
      href={repo.url}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: Math.min(index * 0.03, 0.3) }}
      className="group flex flex-col bg-[var(--surface)] border-[2.5px] border-[var(--border-ink)] shadow-brutal brutal-card-hover"
    >
      <div className={`flex items-center justify-between px-5 py-3 border-b-[2.5px] border-[var(--border-ink)] ${headerClass}`}>
        <div className="flex items-center gap-2 min-w-0">
          <span className="font-mono text-xs font-bold shrink-0 opacity-70">~/</span>
          <span className="font-display font-bold text-base truncate">{repo.name}</span>
        </div>
        <ExternalLink className="w-4 h-4 shrink-0 ml-2" aria-hidden="true" />
      </div>

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
    <div className="bg-[var(--surface)] border-[2.5px] border-[var(--border-ink)] shadow-brutal">
      <div className="px-5 py-3 border-b-[2.5px] border-[var(--border-ink)] bg-[var(--surface-alt)]">
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
      <div className="fixed inset-0 -z-10 bg-brutal-grid" aria-hidden="true" />
      <WorkNavbar />

      <SectionBorder label="// work" innerClassName="px-6 sm:px-10 pt-16 pb-10">
        <SectionHeader
          label="all projects"
          title={
            <>
              My{" "}
              <span className="inline-block bg-[var(--accent)] text-[var(--accent-ink)] border-[3px] border-[var(--border-ink)] px-3 shadow-[6px_6px_0_0_var(--border-ink)] -rotate-1">
                work.
              </span>
            </>
          }
          description="Every public GitHub repository, sorted by stars."
        />
        {!loading && !error && (
          <p className="inline-flex items-center gap-2 mt-6 px-3 py-1 border-2 border-[var(--border-ink)] bg-[var(--surface)] shadow-[3px_3px_0_0_var(--border-ink)] font-mono text-xs font-bold uppercase tracking-widest tabular-nums">
            <span className="w-2 h-2 bg-[var(--accent)]" aria-hidden="true" />
            {repos.length} repositories
          </p>
        )}
      </SectionBorder>

      <SectionBorder innerClassName="px-6 sm:px-10 py-10 md:py-14">
        {error ? (
          <div className="flex flex-col items-center justify-center py-24 gap-5">
            <div className="px-6 py-4 bg-[var(--accent)] text-[var(--accent-ink)] border-[2.5px] border-[var(--border-ink)] shadow-brutal font-display font-bold">
              Failed to load repositories
            </div>
            <BrutalButton onClick={() => window.location.reload()} variant="ghost">
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
