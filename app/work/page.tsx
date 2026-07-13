import { ArrowLeft, ArrowUpRight, Code2, GitFork, Star } from "lucide-react";
import Link from "next/link";
import { Navbar } from "@/components/sections/navbar";
import { Footer } from "@/components/sections/footer";
import { Reveal } from "@/components/ui/reveal";
import repoData from "@/public/repos.json";

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

const repos = ([...repoData] as Repo[]).sort(
  (a, b) => b.stars - a.stars || new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
);

function RepoCard({ repo, index }: { repo: Repo; index: number }) {
  return (
    <Reveal delay={Math.min(index * 25, 180)}>
      <a
        href={repo.url}
        target="_blank"
        rel="noopener noreferrer"
        className="quiet-card group flex min-h-64 flex-col p-5 md:p-6"
      >
        <div className="flex items-center justify-between">
          <span className="font-mono text-[10px] tabular-nums text-[var(--muted)]">{String(index + 1).padStart(2, "0")}</span>
          <ArrowUpRight className="arrow-nudge h-4 w-4 text-[var(--muted)]" />
        </div>

        <div className="mt-8 flex-1">
          <h2 className="text-lg font-semibold tracking-[-0.03em]">{repo.name}</h2>
          <p className="mt-3 line-clamp-3 text-sm leading-6 text-[var(--muted)]">
            {repo.description ?? "An open-source project from my GitHub archive."}
          </p>
        </div>

        {repo.topics.length > 0 && (
          <div className="mt-6 flex flex-wrap gap-1.5">
            {repo.topics.slice(0, 3).map((topic) => <span key={topic} className="tag">{topic}</span>)}
          </div>
        )}

        <div className="mt-6 flex items-center gap-4 border-t border-[var(--border-ink)] pt-4 font-mono text-[10px] text-[var(--muted)]">
          {repo.language && <span className="inline-flex items-center gap-1.5"><Code2 className="h-3 w-3" />{repo.language}</span>}
          <span className="inline-flex items-center gap-1.5"><Star className="h-3 w-3" />{repo.stars}</span>
          <span className="inline-flex items-center gap-1.5"><GitFork className="h-3 w-3" />{repo.forks}</span>
        </div>
      </a>
    </Reveal>
  );
}

export default function WorkPage() {
  return (
    <>
      <Navbar />
      <main id="main-content">
        <section className="site-container py-16 md:py-24">
          <Reveal>
            <Link href="/" className="mb-10 inline-flex items-center gap-2 text-xs text-[var(--muted)] transition-colors hover:text-[var(--ink)]">
              <ArrowLeft className="h-3.5 w-3.5" /> Back home
            </Link>
            <span className="eyebrow">Open source</span>
            <div className="mt-5 flex flex-col justify-between gap-6 md:flex-row md:items-end">
              <div>
                <h1 className="text-[clamp(3.5rem,8vw,7rem)] font-medium leading-[0.94] tracking-[-0.07em]">Selected archive.</h1>
                <p className="mt-5 max-w-xl text-base leading-7 text-[var(--muted)]">
                  Public experiments, coursework, tools, and products — sorted by community interest and recency.
                </p>
              </div>
              <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-[var(--muted)]">{repos.length} repositories</p>
            </div>
          </Reveal>
        </section>

        <section className="section-shell">
          <div className="site-container grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {repos.map((repo, index) => <RepoCard key={repo.name} repo={repo} index={index} />)}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
