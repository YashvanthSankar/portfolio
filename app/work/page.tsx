"use client";

import { motion } from "framer-motion";
import { Star, GitFork, ArrowUpRight, ArrowLeft, Download } from "lucide-react";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Footer, ScrollProgressBar } from "@/components/sections/footer";
import { SectionHeader } from "@/components/ui/section-header";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button, Tag } from "@/components/ui/primitives";
import { cn, throttle } from "@/lib/utils";

const GithubIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" aria-hidden="true" className={className ?? "h-4 w-4"} fill="currentColor">
    <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
  </svg>
);

function WorkNavbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = throttle(() => setScrolled(window.scrollY > 24), 16);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky inset-x-0 top-0 z-50 transition-[background-color,border-color,backdrop-filter] duration-300",
        scrolled
          ? "border-b border-line bg-paper/80 backdrop-blur-md"
          : "border-b border-transparent bg-transparent"
      )}
    >
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-6">
        <Link
          href="/"
          className="group inline-flex items-center gap-2 rounded-full py-1.5 pr-3 text-sm text-muted transition-colors duration-200 hover:text-ink"
        >
          <ArrowLeft className="h-4 w-4 transition-transform duration-200 group-hover:-translate-x-0.5" />
          Home
        </Link>

        <div className="flex items-center gap-1.5">
          <a
            href="https://github.com/YashvanthSankar"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub profile"
            className="inline-flex h-9 w-9 items-center justify-center rounded-full text-muted transition-colors duration-200 hover:bg-surface-hover hover:text-ink"
          >
            <GithubIcon className="h-4 w-4" />
          </a>
          <ThemeToggle />
          <div className="hidden sm:block">
            <Button as="a" href="/YashvanthS_Resume.pdf" download variant="secondary" size="sm">
              <Download className="h-3.5 w-3.5" />
              Resume
            </Button>
          </div>
        </div>
      </div>
    </header>
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
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: Math.min(index * 0.03, 0.3), ease: [0.25, 1, 0.5, 1] }}
      className="card card-hover group flex h-full flex-col p-5"
    >
      <div className="flex items-center justify-between gap-3">
        <span className="truncate text-[15px] font-medium text-ink">{repo.name}</span>
        <ArrowUpRight className="h-4 w-4 shrink-0 text-faint transition-[color,transform] duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-ink" />
      </div>

      <p className="mt-2 flex-1 text-sm leading-relaxed text-muted line-clamp-2">
        {repo.description ?? <span className="italic text-faint">No description</span>}
      </p>

      <div className="mt-4 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 font-mono text-[11px] text-faint">
          {repo.language && <span>{repo.language}</span>}
          <span className="inline-flex items-center gap-1">
            <Star className="h-3 w-3" />
            {repo.stars}
          </span>
          <span className="inline-flex items-center gap-1">
            <GitFork className="h-3 w-3" />
            {repo.forks}
          </span>
        </div>
        {repo.topics.length > 0 && (
          <div className="hidden gap-1.5 sm:flex">
            {repo.topics.slice(0, 2).map((t) => (
              <Tag key={t}>{t}</Tag>
            ))}
          </div>
        )}
      </div>
    </motion.a>
  );
}

function SkeletonCard() {
  return (
    <div className="card p-5">
      <div className="h-4 w-36 animate-pulse rounded bg-surface-hover" />
      <div className="mt-3 space-y-2">
        <div className="h-3 w-full animate-pulse rounded bg-surface-hover" />
        <div className="h-3 w-3/4 animate-pulse rounded bg-surface-hover" />
      </div>
      <div className="mt-4 flex gap-2">
        <div className="h-3 w-12 animate-pulse rounded bg-surface-hover" />
        <div className="h-3 w-8 animate-pulse rounded bg-surface-hover" />
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
    <div className="relative isolate min-h-screen">
      <ScrollProgressBar />
      <WorkNavbar />

      <div className="mx-auto max-w-5xl px-6 pb-24 pt-16">
        <SectionHeader
          label="All projects"
          title="My work."
          description="Every public GitHub repository, sorted by stars."
        />
        {!loading && !error && (
          <p className="-mt-6 mb-10 font-mono text-[11px] tabular-nums tracking-wide text-faint">
            {repos.length} repositories
          </p>
        )}

        {error ? (
          <div className="flex flex-col items-center justify-center gap-5 py-24">
            <p className="text-sm text-muted">Failed to load repositories.</p>
            <Button onClick={() => window.location.reload()} variant="secondary">
              Try again
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {loading
              ? Array.from({ length: 9 }).map((_, i) => <SkeletonCard key={i} />)
              : repos.map((repo, i) => <RepoCard key={repo.name} repo={repo} index={i} />)}
          </div>
        )}

        {!loading && !error && (
          <div className="mt-14 flex justify-center">
            <Button
              as="a"
              href="https://github.com/YashvanthSankar"
              target="_blank"
              rel="noopener noreferrer"
              variant="secondary"
              size="lg"
            >
              <GithubIcon className="h-4 w-4" />
              View all on GitHub
            </Button>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
