"use client";

import { useEffect, useMemo, useRef, useState, type KeyboardEvent } from "react";
import { ArrowUpRight, GitFork, Star } from "lucide-react";
import { gsap } from "@/lib/gsap";
import { shouldAnimate } from "@/lib/utils";
import { Footer, ScrollProgressBar } from "@/components/sections/footer";
import { Navbar } from "@/components/sections/navbar";
import { SectionHeader } from "@/components/ui/section-header";
import { fadeUp } from "@/lib/split-reveal";
import { useMediaQuery } from "@/lib/use-media-query";
import { GITHUB_URL } from "@/data/site";

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

const ALL = "All";

function since(date: string) {
  const days = Math.max(0, Math.round((Date.now() - new Date(date).getTime()) / 86400000));
  if (days < 1) return "today";
  if (days < 30) return `${days}d ago`;
  const months = Math.round(days / 30);
  if (months < 12) return `${months}mo ago`;
  const years = Math.round(months / 12);
  return `${years}y ago`;
}

function RepoRow({
  repo,
  index,
  onEnter,
  onLeave,
}: {
  repo: Repo;
  index: number;
  onEnter: (repo: Repo) => void;
  onLeave: () => void;
}) {
  return (
    <a
      data-repo-row
      href={repo.url}
      target="_blank"
      rel="noopener noreferrer"
      data-cursor="view"
      onPointerEnter={() => onEnter(repo)}
      onPointerLeave={onLeave}
      className="group grid gap-3 border-b border-[var(--line-1)] px-2 py-7 outline-none transition-colors duration-300 hover:bg-[var(--bg-1)] focus-visible:bg-[var(--bg-1)] md:grid-cols-12 md:items-baseline md:gap-8"
      style={{ opacity: 0 }}
    >
      <div className="flex items-baseline gap-4 md:col-span-5">
        <span className="meta tabular-nums text-[var(--text-3)]">
          {String(index + 1).padStart(2, "0")}
        </span>
        <span className="text-xl font-medium tracking-[-0.02em] text-[var(--text-1)] transition-colors duration-200 group-hover:text-[var(--accent)] group-focus-visible:text-[var(--accent)] md:text-2xl">
          {repo.name}
        </span>
      </div>

      <p className="text-sm leading-relaxed text-[var(--text-2)] md:col-span-5">
        {repo.description ?? <span className="text-[var(--text-3)]">No description</span>}
      </p>

      <div className="flex items-center gap-5 md:col-span-2 md:justify-end">
        {repo.language && <span className="meta">{repo.language}</span>}
        {repo.stars > 0 && (
          <span className="meta inline-flex items-center gap-1.5">
            <Star className="h-3 w-3" />
            {repo.stars}
          </span>
        )}
        <ArrowUpRight className="h-3.5 w-3.5 shrink-0 text-[var(--text-3)] transition-[transform,color] duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-[var(--accent)]" />
      </div>
    </a>
  );
}

function SkeletonRow() {
  return (
    <div className="grid gap-3 border-b border-[var(--line-1)] px-2 py-7 md:grid-cols-12 md:gap-8">
      <div className="h-5 w-40 animate-pulse bg-[var(--bg-2)] md:col-span-5" />
      <div className="h-4 w-full animate-pulse bg-[var(--bg-1)] md:col-span-5" />
      <div className="h-4 w-24 animate-pulse bg-[var(--bg-1)] md:col-span-2 md:justify-self-end" />
    </div>
  );
}

/**
 * The card that floats beside the pointer over a row: the facts that
 * don't fit on the line — forks, topics, when it was last touched. It
 * trails the pointer the way the cursor ring does, and only exists on
 * fine-pointer screens wide enough to have room for it.
 */
function PreviewCard({ repo, content }: { repo: Repo | null; content: Repo | null }) {
  const ref = useRef<HTMLDivElement>(null);
  const shown = useRef<Repo | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let tx = 0;
    let ty = 0;
    let x = 0;
    let y = 0;
    let raf = 0;

    const onMove = (e: PointerEvent) => {
      tx = e.clientX + 24;
      ty = e.clientY + 24;
      /* Keep it on screen near the right and bottom edges. */
      const r = el.getBoundingClientRect();
      if (tx + r.width > window.innerWidth - 16) tx = e.clientX - r.width - 24;
      if (ty + r.height > window.innerHeight - 16) ty = e.clientY - r.height - 24;
      if (!shown.current) {
        x = tx;
        y = ty;
      }
    };
    const loop = () => {
      x += (tx - x) * 0.18;
      y += (ty - y) * 0.18;
      el.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
    };
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const visible = Boolean(repo);
    shown.current = repo;
    if (!shouldAnimate()) {
      gsap.set(el, { autoAlpha: visible ? 1 : 0 });
      return;
    }
    gsap.to(el, {
      autoAlpha: visible ? 1 : 0,
      scale: visible ? 1 : 0.96,
      duration: visible ? 0.35 : 0.2,
      ease: "expo.out",
      overwrite: true,
    });
  }, [repo]);

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="panel pointer-events-none fixed left-0 top-0 z-[45] w-[17rem] p-5"
      style={{ opacity: 0 }}
    >
      {content && (
        <>
          <div className="mb-4 flex items-center justify-between">
            <span className="meta text-[var(--accent)]">{content.language ?? "—"}</span>
            <span className="meta">{since(content.updated_at)}</span>
          </div>
          <div className="mb-4 flex items-center gap-5">
            <span className="meta inline-flex items-center gap-1.5 text-[var(--text-1)]">
              <Star className="h-3 w-3" />
              {content.stars}
            </span>
            <span className="meta inline-flex items-center gap-1.5 text-[var(--text-1)]">
              <GitFork className="h-3 w-3" />
              {content.forks}
            </span>
          </div>
          {content.topics.length > 0 ? (
            <div className="flex flex-wrap gap-x-3 gap-y-1.5">
              {content.topics.slice(0, 6).map((t) => (
                <span key={t} className="meta text-[var(--text-2)]">
                  {t}
                </span>
              ))}
            </div>
          ) : (
            <p className="meta">no topics</p>
          )}
        </>
      )}
    </div>
  );
}

export default function WorkPage() {
  const [repos, setRepos] = useState<Repo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lang, setLang] = useState(ALL);
  const [hovered, setHovered] = useState<Repo | null>(null);
  /* The last row hovered stays rendered in the card while it fades out,
     so the card never empties mid-fade. */
  const [lastHovered, setLastHovered] = useState<Repo | null>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const preview = useMediaQuery("(min-width: 1024px) and (pointer: fine)");

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

  /* Languages by how many repos use them; the filter row reads as a census. */
  const languages = useMemo(() => {
    const counts = new Map<string, number>();
    for (const r of repos) {
      if (r.language) counts.set(r.language, (counts.get(r.language) ?? 0) + 1);
    }
    return [...counts.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));
  }, [repos]);

  const filtered = useMemo(
    () => (lang === ALL ? repos : repos.filter((r) => r.language === lang)),
    [repos, lang]
  );

  /* Re-run on every filter: new rows mount hidden and need their reveal. */
  useEffect(() => {
    if (loading || error) return;
    return fadeUp("[data-repo-row]", {
      trigger: listRef.current,
      start: "top 92%",
      stagger: 0.03,
      duration: 0.6,
      y: 16,
    });
  }, [loading, error, lang]);

  /* ↑ / ↓ walk the rows; Enter is the link's own. */
  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (!["ArrowDown", "ArrowUp", "Home", "End"].includes(e.key)) return;
    const rows = Array.from(
      listRef.current?.querySelectorAll<HTMLAnchorElement>("[data-repo-row]") ?? []
    );
    if (rows.length === 0) return;
    const i = rows.indexOf(document.activeElement as HTMLAnchorElement);
    let next = i;
    if (e.key === "ArrowDown") next = Math.min(rows.length - 1, i + 1);
    if (e.key === "ArrowUp") next = Math.max(0, i - 1);
    if (e.key === "Home") next = 0;
    if (e.key === "End") next = rows.length - 1;
    e.preventDefault();
    rows[next].focus();
    rows[next].scrollIntoView({ block: "nearest" });
  };

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
            <div className="-mt-8 mb-2 flex flex-wrap items-center justify-between gap-x-8 gap-y-4 border-b border-[var(--line-1)] pb-5">
              <div
                role="group"
                aria-label="Filter by language"
                className="tap-row flex flex-wrap gap-x-5 gap-y-2"
              >
                {[[ALL, repos.length] as const, ...languages].map(([name, count]) => {
                  const active = lang === name;
                  return (
                    <button
                      key={name}
                      type="button"
                      onClick={() => setLang(name)}
                      aria-pressed={active}
                      className={`meta tap-safe inline-flex items-center gap-1.5 transition-colors duration-200 ${
                        active
                          ? "text-[var(--accent)]"
                          : "text-[var(--text-3)] hover:text-[var(--text-1)]"
                      }`}
                    >
                      {name}
                      <span className="tabular-nums opacity-60">{count}</span>
                    </button>
                  );
                })}
              </div>
              <p className="meta flex items-center gap-2" aria-live="polite">
                <span className="pulse-dot h-1.5 w-1.5 rounded-full bg-[var(--accent)]" />
                {filtered.length} {filtered.length === 1 ? "repository" : "repositories"}
              </p>
            </div>
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
            <div
              ref={listRef}
              onKeyDown={onKeyDown}
              className="border-t border-[var(--line-1)]"
            >
              {loading
                ? Array.from({ length: 8 }).map((_, i) => <SkeletonRow key={i} />)
                : filtered.map((repo, i) => (
                    <RepoRow
                      key={repo.name}
                      repo={repo}
                      index={i}
                      onEnter={(r) => {
                        setHovered(r);
                        setLastHovered(r);
                      }}
                      onLeave={() => setHovered(null)}
                    />
                  ))}
            </div>
          )}

          {!loading && !error && (
            <div className="mt-12 flex flex-wrap items-center justify-between gap-6">
              <p className="meta hidden md:block">↑ ↓ to move · Enter to open</p>
              <a
                href={GITHUB_URL}
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

      {preview && <PreviewCard repo={hovered} content={lastHovered} />}

      <Footer />
    </div>
  );
}
