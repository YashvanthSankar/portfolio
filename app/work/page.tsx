"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ExternalLink, Star, GitFork, Code2, ArrowLeft, Download, Menu, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Footer } from "@/components/sections/footer";
import { SectionHeader } from "@/components/ui/section-header";
import { SectionBorder } from "@/components/ui/section-border";
import { cn, throttle } from "@/lib/utils";
import { ThemeToggle } from "@/components/theme-toggle";

const GithubIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className ?? "w-3.5 h-3.5"} fill="currentColor">
    <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
  </svg>
);

/* ─── Work page navbar — mirrors main navbar pattern ─── */
function WorkNavbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [menuTop, setMenuTop]   = useState(64);
  const headerRef               = useRef<HTMLElement>(null);

  useEffect(() => {
    const onScroll = throttle(() => setScrolled(window.scrollY > 48), 16);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const onResize = () => { if (window.innerWidth >= 768) setMenuOpen(false); };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    if (headerRef.current) setMenuTop(headerRef.current.offsetHeight + 8);
  }, [scrolled]);

  return (
    <>
      <motion.header
        ref={headerRef}
        initial={{ y: -72, opacity: 0 }}
        animate={{ y: 0,   opacity: 1 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="sticky inset-x-0 top-0 z-50"
      >
        <div
          className={cn(
            "max-w-6xl mx-auto transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]",
            scrolled ? "px-4 sm:px-6 pt-3 pb-2" : "px-6 sm:px-10"
          )}
        >
          <div
            style={{ borderRadius: scrolled ? "1rem" : "0" }}
            className={cn(
              "relative flex items-center justify-between gap-2 py-2.5",
              "transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]",
              scrolled
                ? "px-3 border border-zinc-200 dark:border-zinc-800 bg-white/95 dark:bg-zinc-950/95 backdrop-blur-xl shadow-[0_4px_20px_rgba(0,0,0,0.07)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.55)]"
                : "bg-transparent"
            )}
          >
            {/* Logo — links back to home */}
            <Link
              href="/"
              aria-label="Back to home"
              className="relative h-8 w-8 shrink-0 rounded-lg overflow-hidden
                         ring-1 ring-zinc-200 dark:ring-zinc-800
                         hover:ring-red-400 dark:hover:ring-red-500
                         transition-all duration-200"
            >
              <Image src="/ys.png" alt="YS" fill className="object-cover" quality={85} />
            </Link>

            {/* Desktop nav */}
            <nav className="hidden md:flex items-center gap-0.5 absolute left-1/2 -translate-x-1/2">
              <Link
                href="/"
                className="flex items-center gap-1.5 px-3.5 py-1.5 text-sm rounded-xl
                           text-zinc-500 dark:text-zinc-400
                           hover:text-zinc-800 dark:hover:text-zinc-200
                           transition-colors duration-150"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                home
              </Link>
              <a
                href="https://github.com/YashvanthSankar"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-3.5 py-1.5 text-sm rounded-xl
                           text-zinc-500 dark:text-zinc-400
                           hover:text-zinc-800 dark:hover:text-zinc-200
                           transition-colors duration-150"
              >
                <GithubIcon />
                github
              </a>
            </nav>

            {/* Right actions */}
            <div className="flex items-center gap-1">
              <ThemeToggle
                className="w-8 h-8 flex items-center justify-center rounded-xl
                           text-zinc-500 dark:text-zinc-400
                           hover:text-zinc-900 dark:hover:text-white
                           hover:bg-zinc-100/80 dark:hover:bg-zinc-800/80
                           transition-all duration-150"
              />
              <a
                href="/YashvanthS_Resume.pdf"
                download
                className="hidden md:flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-xl
                           text-zinc-500 dark:text-zinc-400
                           hover:text-zinc-900 dark:hover:text-white
                           hover:bg-zinc-100/80 dark:hover:bg-zinc-800/80
                           transition-all duration-150"
              >
                <Download className="w-3.5 h-3.5" />
                resume
              </a>

              {/* Mobile hamburger */}
              <button
                onClick={() => setMenuOpen((p) => !p)}
                aria-label="Toggle menu"
                aria-expanded={menuOpen}
                className="md:hidden w-8 h-8 flex items-center justify-center rounded-xl
                           text-zinc-500 dark:text-zinc-400
                           hover:text-zinc-900 dark:hover:text-white
                           hover:bg-zinc-100/80 dark:hover:bg-zinc-800/80
                           transition-all duration-150"
              >
                <AnimatePresence mode="wait" initial={false}>
                  {menuOpen ? (
                    <motion.span key="x" className="flex"
                      initial={{ opacity: 0, rotate: -90 }} animate={{ opacity: 1, rotate: 0 }}
                      exit={{ opacity: 0, rotate: 90 }} transition={{ duration: 0.15 }}
                    ><X className="w-4 h-4" /></motion.span>
                  ) : (
                    <motion.span key="menu" className="flex"
                      initial={{ opacity: 0, rotate: 90 }} animate={{ opacity: 1, rotate: 0 }}
                      exit={{ opacity: 0, rotate: -90 }} transition={{ duration: 0.15 }}
                    ><Menu className="w-4 h-4" /></motion.span>
                  )}
                </AnimatePresence>
              </button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Mobile dropdown */}
      <AnimatePresence>
        {menuOpen && (
          <>
            <motion.div key="bd"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setMenuOpen(false)}
              className="fixed inset-0 z-40 md:hidden bg-black/10 backdrop-blur-[2px]"
            />
            <motion.nav key="panel"
              style={{ top: menuTop }}
              initial={{ opacity: 0, y: -8, scale: 0.97 }}
              animate={{ opacity: 1, y: 0,  scale: 1    }}
              exit={{    opacity: 0, y: -8, scale: 0.97 }}
              transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
              className="fixed inset-x-4 sm:inset-x-6 z-50 md:hidden max-w-6xl mx-auto"
            >
              <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800
                              bg-white dark:bg-zinc-950
                              shadow-[0_8px_32px_rgba(0,0,0,0.10)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.6)]
                              overflow-hidden">
                <ul className="p-2 space-y-0.5">
                  {[
                    { href: "/", label: "back to home", icon: <ArrowLeft className="w-4 h-4" />, internal: true },
                    { href: "https://github.com/YashvanthSankar", label: "github profile", icon: <GithubIcon className="w-4 h-4" />, internal: false },
                  ].map((item) => (
                    <li key={item.label}>
                      {item.internal ? (
                        <Link href={item.href} onClick={() => setMenuOpen(false)}
                          className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm
                                     text-zinc-500 dark:text-zinc-400
                                     hover:bg-zinc-50 dark:hover:bg-zinc-900/60
                                     hover:text-zinc-800 dark:hover:text-zinc-200
                                     transition-colors duration-150"
                        >
                          <span className="text-zinc-400 dark:text-zinc-500">{item.icon}</span>
                          {item.label}
                        </Link>
                      ) : (
                        <a href={item.href} target="_blank" rel="noopener noreferrer"
                          className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm
                                     text-zinc-500 dark:text-zinc-400
                                     hover:bg-zinc-50 dark:hover:bg-zinc-900/60
                                     hover:text-zinc-800 dark:hover:text-zinc-200
                                     transition-colors duration-150"
                        >
                          <span className="text-zinc-400 dark:text-zinc-500">{item.icon}</span>
                          {item.label}
                        </a>
                      )}
                    </li>
                  ))}
                </ul>
                <div className="px-2 pb-2">
                  <a
                    href="/YashvanthS_Resume.pdf"
                    download
                    className="w-full py-2.5 rounded-xl text-sm
                               border border-zinc-200 dark:border-zinc-800
                               text-zinc-600 dark:text-zinc-300
                               flex items-center justify-center gap-2
                               hover:bg-zinc-50 dark:hover:bg-zinc-900
                               transition-colors duration-150"
                  >
                    <Download className="w-3.5 h-3.5" />
                    resume
                  </a>
                </div>
              </div>
            </motion.nav>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

/* ─── Repo card ─── */
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
      transition={{ duration: 0.4, delay: index * 0.04 }}
      className="group flex flex-col rounded-xl border border-zinc-200 dark:border-zinc-800
                 bg-white dark:bg-zinc-900
                 hover:border-zinc-300 dark:hover:border-zinc-700
                 hover:shadow-[0_4px_20px_rgba(0,0,0,0.06)] dark:hover:shadow-[0_4px_20px_rgba(0,0,0,0.3)]
                 transition-all duration-300 overflow-hidden"
    >
      {/* Top bar */}
      <div className="flex items-center justify-between px-5 py-3.5 border-b border-zinc-100 dark:border-zinc-800/80">
        <div className="flex items-center gap-2 min-w-0">
          <span className="text-xs text-zinc-300 dark:text-zinc-600 select-none shrink-0 font-mono">~/</span>
          <span className="text-sm font-semibold text-zinc-900 dark:text-white truncate">{repo.name}</span>
        </div>
        <ExternalLink className="w-3.5 h-3.5 text-zinc-300 dark:text-zinc-700 group-hover:text-red-500 transition-colors shrink-0 ml-2" />
      </div>

      {/* Body */}
      <div className="flex flex-col flex-1 px-5 py-4 gap-4">
        <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed flex-1 line-clamp-3">
          {repo.description ?? <span className="italic text-zinc-300 dark:text-zinc-600">no description</span>}
        </p>

        {repo.topics.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {repo.topics.slice(0, 3).map((t) => (
              <span key={t}
                className="px-2 py-0.5 text-[11px] rounded-md
                           bg-zinc-100 dark:bg-zinc-800
                           text-zinc-500 dark:text-zinc-400
                           border border-zinc-200 dark:border-zinc-700"
              >{t}</span>
            ))}
          </div>
        )}

        <div className="flex items-center gap-3 text-xs text-zinc-400 dark:text-zinc-500">
          {repo.language && (
            <span className="flex items-center gap-1">
              <Code2 className="w-3 h-3" />
              {repo.language}
            </span>
          )}
          <span className="flex items-center gap-1">
            <Star className="w-3 h-3" />
            {repo.stars}
          </span>
          <span className="flex items-center gap-1">
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
    <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 overflow-hidden">
      <div className="px-5 py-3.5 border-b border-zinc-100 dark:border-zinc-800">
        <div className="h-4 w-36 bg-zinc-100 dark:bg-zinc-800 rounded animate-pulse" />
      </div>
      <div className="px-5 py-4 space-y-3">
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

/* ─── Page ─── */
export default function WorkPage() {
  const [repos, setRepos]   = useState<Repo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]   = useState<string | null>(null);

  useEffect(() => {
    fetch("/repos.json")
      .then((r) => { if (!r.ok) throw new Error("failed"); return r.json(); })
      .then((data: Repo[]) => {
        setRepos(data.sort((a, b) => b.stars - a.stars || new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()));
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="relative min-h-screen antialiased">
      {/* Grid background */}
      <div className="fixed inset-0 -z-10 bg-white dark:bg-zinc-950
        [background-image:linear-gradient(rgba(0,0,0,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.05)_1px,transparent_1px)]
        dark:[background-image:linear-gradient(rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.04)_1px,transparent_1px)]
        [background-size:48px_48px]" />

      <WorkNavbar />

      <div className="divide-y divide-zinc-200 dark:divide-zinc-800 border-b border-zinc-200 dark:border-zinc-800">
        {/* Page header */}
        <SectionBorder innerClassName="px-6 sm:px-10 pt-14 pb-10">
          <SectionHeader
            label="all projects"
            title={<>my <span className="text-red-600 dark:text-red-400">work</span></>}
            description="All my public GitHub repositories — sorted by stars."
          />
          {!loading && !error && (
            <p className="text-xs text-zinc-400 dark:text-zinc-500 -mt-8 tabular-nums">
              {repos.length} repositories
            </p>
          )}
        </SectionBorder>

        {/* Repo grid */}
        <SectionBorder innerClassName="px-6 sm:px-10 py-10 md:py-14">
          {error ? (
            <div className="flex flex-col items-center justify-center py-24 gap-4">
              <p className="text-sm text-zinc-400 dark:text-zinc-500">failed to load repositories</p>
              <button
                onClick={() => window.location.reload()}
                className="px-4 py-2 rounded-lg border border-zinc-200 dark:border-zinc-800 text-sm
                           text-zinc-600 dark:text-zinc-400
                           hover:text-zinc-900 dark:hover:text-white
                           hover:border-zinc-300 dark:hover:border-zinc-700
                           transition-all"
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
            <motion.div
              initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
              className="mt-10 flex justify-center"
            >
              <a
                href="https://github.com/YashvanthSankar"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl
                           border border-zinc-200 dark:border-zinc-800
                           text-sm text-zinc-500 dark:text-zinc-400
                           hover:text-zinc-900 dark:hover:text-white
                           hover:border-zinc-300 dark:hover:border-zinc-700
                           hover:bg-white dark:hover:bg-zinc-900
                           transition-all"
              >
                <GithubIcon />
                view all on github
              </a>
            </motion.div>
          )}
        </SectionBorder>

        <Footer />
      </div>
    </div>
  );
}
