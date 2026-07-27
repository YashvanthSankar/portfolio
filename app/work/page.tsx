"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, GitFork, Star } from "lucide-react";
import { Footer, ScrollProgressBar } from "@/components/sections/footer";
import { Navbar } from "@/components/sections/navbar";
import { SectionHeader } from "@/components/ui/section-header";
import { fadeUp } from "@/lib/split-reveal";

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

function RepoRow({ repo, index }: { repo: Repo; index: number }) {
  return (
    <a
      data-repo-row
      href={repo.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group grid gap-3 border-b border-[var(--line-1)] px-2 py-6 transition-colors duration-300 hover:bg-[var(--bg-1)] md:grid-cols-12 md:items-baseline md:gap-8"
      style={{ opacity: 0 }}
    >
      <div className="flex items-baseline gap-4 md:col-span-4">
        <span className="meta tabular-nums text-[var(--text-3)]">
          {String(index + 1).padStart(2, "0")}
        </span>
        <span className="text-base font-medium tracking-[-0.01em] text-[var(--text-1)] transition-colors duration-200 group-hover:text-[var(--accent)]">
          {repo.name}
        </span>
      </div>

      <p className="text-sm leading-relaxed text-[var(--text-2)] md:col-span-5">
        {repo.description ?? (
          <span className="text-[var(--text-3)]">No description</span>
        )}
      </p>

      <div className="flex items-center gap-5 md:col-span-3 md:justify-end">
        {repo.language && <span className="meta">{repo.language}</span>}
        {repo.stars > 0 && (
          <span className="meta inline-flex items-center gap-1.5">
            <Star className="h-3 w-3" />
            {repo.stars}
          </span>
        )}
        {repo.forks > 0 && (
          <span className="meta inline-flex items-center gap-1.5">
            <GitFork className="h-3 w-3" />
            {repo.forks}
          </span>
        )}
        <ArrowUpRight className="h-3.5 w-3.5 shrink-0 text-[var(--text-3)] transition-[transform,color] duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-[var(--accent)]" />
      </div>
    </a>
  );
}

function SkeletonRow() {
  return (
    <div className="grid gap-3 border-b border-[var(--line-1)] px-2 py-6 md:grid-cols-12 md:gap-8">
      <div className="h-4 w-40 animate-pulse bg-[var(--bg-2)] md:col-span-4" />
      <div className="h-4 w-full animate-pulse bg-[var(--bg-1)] md:col-span-5" />
      <div className="h-4 w-24 animate-pulse bg-[var(--bg-1)] md:col-span-3 md:justify-self-end" />
    </div>
  );
}

export default function WorkPage() {
  const [repos, setRepos] = useState<Repo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch("/repos.json")
      .then((r) => {
        if (!r.ok) throw new Error("Failed to load");
        return r.json();
      })
      .then((data: Repo[]) => {
        setRepos(
          data.sort(
            (a, b) =>
              b.stars - a.stars ||
              new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
          )
        );
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (loading || error) return;
    const cleanup = fadeUp("[data-repo-row]", {
      trigger: listRef.current,
      start: "top 92%",
      stagger: 0.03,
      duration: 0.6,
      y: 16,
    });
    return cleanup;
  }, [loading, error]);

  return (
    <div className="relative min-h-screen bg-[var(--bg-0)]">
      <ScrollProgressBar />
      <Navbar variant="page" />

      <main id="main-content">
        <div className="mx-auto max-w-[var(--container)] px-[var(--gutter)] pb-8 pt-36">
          <SectionHeader
            index="—"
            label="all projects"
            title={
              <>
                Everything on <span className="serif-accent">GitHub</span>.
              </>
            }
            description="Every public repository, sorted by stars. Tools, experiments, and things built to scratch an itch."
          />
          {!loading && !error && (
            <p className="meta -mt-8 mb-4 flex items-center gap-2">
              <span className="pulse-dot h-1.5 w-1.5 rounded-full bg-[var(--accent)]" />
              {repos.length} repositories
            </p>
          )}
        </div>

        <div className="mx-auto max-w-[var(--container)] px-[var(--gutter)] pb-24">
          {error ? (
            <div className="flex flex-col items-center gap-5 py-24">
              <p className="lead">Couldn&apos;t load repositories.</p>
              <button onClick={() => window.location.reload()} className="btn btn-outline">
                Try again
              </button>
            </div>
          ) : (
            <div ref={listRef} className="border-t border-[var(--line-1)]">
              {loading
                ? Array.from({ length: 8 }).map((_, i) => <SkeletonRow key={i} />)
                : repos.map((repo, i) => (
                    <RepoRow key={repo.name} repo={repo} index={i} />
                  ))}
            </div>
          )}

          {!loading && !error && (
            <div className="mt-12 flex justify-center">
              <a
                href="https://github.com/YashvanthSankar"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-outline"
              >
                View profile on GitHub
                <ArrowUpRight className="h-4 w-4" />
              </a>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
