"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ExternalLink, Star, GitFork, Code2, ArrowLeft, Sun, Moon, Download, Menu, X } from "lucide-react";

const GithubIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className ?? "w-3.5 h-3.5"} fill="currentColor">
    <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
  </svg>
);
import { useEffect, useState, startTransition } from "react";
import { useTheme } from "next-themes";
import Link from "next/link";
import Image from "next/image";
import { Footer } from "@/components/sections/footer";
import { SectionHeader } from "@/components/ui/section-header";
import { SectionBorder } from "@/components/ui/section-border";
import { cn, throttle } from "@/lib/utils";

function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => { startTransition(() => setMounted(true)); }, []);
  if (!mounted) return <div className="w-9 h-9" />;
  return (
    <button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="w-9 h-9 flex items-center justify-center rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:border-zinc-300 dark:hover:border-zinc-700 transition-all"
      aria-label="Toggle theme"
    >
      <AnimatePresence mode="wait" initial={false}>
        {theme === "dark" ? (
          <motion.div key="sun" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.15 }}>
            <Sun className="w-4 h-4" />
          </motion.div>
        ) : (
          <motion.div key="moon" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.15 }}>
            <Moon className="w-4 h-4" />
          </motion.div>
        )}
      </AnimatePresence>
    </button>
  );
}

function WorkNavbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = throttle(() => setScrolled(window.scrollY > 20), 16);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="fixed inset-x-0 top-0 z-50"
      >
        <div className={cn("mx-auto max-w-4xl px-4 py-3 transition-all duration-300", scrolled ? "px-4 py-2" : "")}>
          <div className={cn(
            "flex items-center justify-between px-4 py-2.5 transition-all duration-300",
            scrolled
              ? "bg-white/90 dark:bg-zinc-950/90 backdrop-blur-md border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-sm"
              : "bg-transparent"
          )}>
            {/* Logo */}
            <Link href="/" className="relative h-8 w-8 rounded-lg overflow-hidden ring-1 ring-zinc-200 dark:ring-zinc-800 hover:ring-violet-400 transition-all">
              <Image src="/ys.png" alt="YS" fill className="object-cover" quality={85} />
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-1">
              <Link
                href="/"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800/50 transition-all"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                home
              </Link>
              <a
                href="https://github.com/YashvanthSankar"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800/50 transition-all"
              >
                <GithubIcon className="w-3.5 h-3.5" />
                github
              </a>
            </nav>

            {/* Right */}
            <div className="hidden md:flex items-center gap-2">
              <ThemeToggle />
              <a
                href="/YashvanthS_Resume.pdf"
                download
                className="flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-lg border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:border-zinc-300 dark:hover:border-zinc-700 transition-all"
              >
                <Download className="w-3.5 h-3.5" />
                resume
              </a>
            </div>

            {/* Mobile */}
            <div className="md:hidden flex items-center gap-2">
              <ThemeToggle />
              <button
                onClick={() => setMenuOpen((p) => !p)}
                className="w-9 h-9 flex items-center justify-center rounded-lg border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-all"
                aria-label="Toggle menu"
              >
                {menuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>
      </motion.header>

      <AnimatePresence>
        {menuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setMenuOpen(false)}
              className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
            />
            <motion.div
              initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed inset-x-0 bottom-0 z-50 rounded-t-2xl bg-white dark:bg-zinc-900 border-t border-zinc-200 dark:border-zinc-800 p-6 pb-10"
            >
              <div className="mx-auto mb-6 h-1 w-10 rounded-full bg-zinc-200 dark:bg-zinc-700" />
              <div className="space-y-1 mb-4">
                <Link href="/" onClick={() => setMenuOpen(false)}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all">
                  <ArrowLeft className="w-4 h-4 shrink-0" />
                  <span className="text-sm">back to home</span>
                </Link>
                <a href="https://github.com/YashvanthSankar" target="_blank" rel="noopener noreferrer"
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all">
                  <GithubIcon className="w-4 h-4 shrink-0" />
                  <span className="text-sm">github profile</span>
                </a>
              </div>
              <div className="border-t border-zinc-100 dark:border-zinc-800 pt-4">
                <a href="/YashvanthS_Resume.pdf" download
                  className="w-full py-3 rounded-xl border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 text-sm flex items-center justify-center gap-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all">
                  <Download className="w-4 h-4" />
                  download resume
                </a>
              </div>
            </motion.div>
          </>
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
  return (
    <motion.a
      href={repo.url}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className="group flex flex-col rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:border-violet-300 dark:hover:border-violet-700 transition-all duration-300 overflow-hidden"
    >
      {/* Top bar */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-100 dark:border-zinc-800">
        <div className="flex items-center gap-2 min-w-0">
          <span className="text-xs text-zinc-400 dark:text-zinc-500 select-none shrink-0">~/</span>
          <span className="text-sm font-semibold text-zinc-900 dark:text-white truncate">{repo.name}</span>
        </div>
        <ExternalLink className="w-3.5 h-3.5 text-zinc-400 dark:text-zinc-600 group-hover:text-violet-500 transition-colors shrink-0 ml-2" />
      </div>

      {/* Body */}
      <div className="flex flex-col flex-1 p-5 gap-4">
        <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed flex-1 line-clamp-3">
          {repo.description || "no description"}
        </p>

        {/* Topics */}
        {repo.topics.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {repo.topics.slice(0, 3).map((topic) => (
              <span key={topic} className="px-2 py-0.5 text-[11px] rounded-md bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-700">
                {topic}
              </span>
            ))}
          </div>
        )}

        {/* Stats */}
        <div className="flex items-center gap-3 text-xs text-zinc-400 dark:text-zinc-500">
          {repo.language && (
            <div className="flex items-center gap-1">
              <Code2 className="w-3 h-3" />
              <span>{repo.language}</span>
            </div>
          )}
          <div className="flex items-center gap-1">
            <Star className="w-3 h-3" />
            <span>{repo.stars}</span>
          </div>
          <div className="flex items-center gap-1">
            <GitFork className="w-3 h-3" />
            <span>{repo.forks}</span>
          </div>
        </div>
      </div>
    </motion.a>
  );
}

function SkeletonCard() {
  return (
    <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 overflow-hidden">
      <div className="px-5 py-4 border-b border-zinc-100 dark:border-zinc-800">
        <div className="h-4 w-32 bg-zinc-100 dark:bg-zinc-800 rounded animate-pulse" />
      </div>
      <div className="p-5 space-y-3">
        <div className="h-3 w-full bg-zinc-100 dark:bg-zinc-800 rounded animate-pulse" />
        <div className="h-3 w-3/4 bg-zinc-100 dark:bg-zinc-800 rounded animate-pulse" />
        <div className="flex gap-1.5 pt-1">
          <div className="h-5 w-14 bg-zinc-100 dark:bg-zinc-800 rounded animate-pulse" />
          <div className="h-5 w-10 bg-zinc-100 dark:bg-zinc-800 rounded animate-pulse" />
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
      .then((r) => { if (!r.ok) throw new Error("failed to load"); return r.json(); })
      .then((data: Repo[]) => {
        setRepos(data.sort((a, b) => b.stars - a.stars || new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()));
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="relative min-h-screen antialiased">
      {/* Global grid background */}
      <div className="fixed inset-0 -z-10 bg-white dark:bg-zinc-950
        [background-image:linear-gradient(rgba(0,0,0,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.05)_1px,transparent_1px)]
        dark:[background-image:linear-gradient(rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.04)_1px,transparent_1px)]
        [background-size:48px_48px]" />

      <WorkNavbar />

      <div className="divide-y divide-zinc-200 dark:divide-zinc-800 border-y border-zinc-200 dark:border-zinc-800 mt-16 sm:mt-[72px]">
        {/* Header section */}
        <SectionBorder innerClassName="px-4 sm:px-6 py-10 md:py-16">
          <SectionHeader
            label="all projects"
            title={<>my <span className="text-violet-600 dark:text-violet-400">work</span></>}
            description="All my public GitHub repositories — sorted by stars."
          />
          {!loading && !error && (
            <p className="text-xs text-zinc-400 dark:text-zinc-500 -mt-8">{repos.length} repositories</p>
          )}
        </SectionBorder>

        {/* Grid section */}
        <SectionBorder innerClassName="px-4 sm:px-6 py-8 md:py-12">
            {error ? (
              <div className="flex flex-col items-center justify-center py-24 gap-4">
                <p className="text-sm text-zinc-500 dark:text-zinc-400">failed to load repositories</p>
                <button
                  onClick={() => window.location.reload()}
                  className="px-4 py-2 rounded-lg border border-zinc-200 dark:border-zinc-800 text-sm text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:border-zinc-300 dark:hover:border-zinc-700 transition-all"
                >
                  try again
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {loading
                  ? Array.from({ length: 9 }).map((_, i) => <SkeletonCard key={i} />)
                  : repos.map((repo, i) => <RepoCard key={repo.name} repo={repo} index={i} />)
                }
              </div>
            )}

            {!loading && !error && (
              <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="mt-10 flex justify-center">
                <a
                  href="https://github.com/YashvanthSankar"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 px-5 py-2.5 rounded-lg border border-zinc-200 dark:border-zinc-800 text-sm text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:border-zinc-300 dark:hover:border-zinc-700 hover:bg-white dark:hover:bg-zinc-900 transition-all"
                >
                  <GithubIcon className="w-3.5 h-3.5" />
                  view all on github →
                </a>
              </motion.div>
            )}
        </SectionBorder>

        <Footer />
      </div>
    </div>
  );
}
