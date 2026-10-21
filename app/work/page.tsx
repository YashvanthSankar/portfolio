"use client";

import { useMemo, useState } from "react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { GITHUB_URL } from "@/data/site";
import { cn } from "@/lib/utils";
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

/* repos.json is written by `npm run repos` and shipped with the deploy. */
const REPOS: Repo[] = (repoData as Repo[])
  .slice()
  .sort(
    (a, b) =>
      b.stars - a.stars || new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
  );

const ALL = "All";

export default function WorkPage() {
  const [lang, setLang] = useState(ALL);

  const languages = useMemo(() => {
    const counts = new Map<string, number>();
    for (const r of REPOS) {
      if (r.language) counts.set(r.language, (counts.get(r.language) ?? 0) + 1);
    }
    return [...counts.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));
  }, []);

  const filtered = lang === ALL ? REPOS : REPOS.filter((r) => r.language === lang);

  return (
    <>
      <SiteHeader home={false} />
      <main id="main-content" className="col pt-14 sm:pt-20">
        <h1 className="h-page">All public repositories</h1>
        <p className="mt-4 text-muted">
          Everything on GitHub, sorted by stars. {REPOS.length} repositories.
        </p>

        {REPOS.length > 0 && (
          <div role="group" aria-label="Filter by language" className="mt-8 flex flex-wrap gap-x-4 gap-y-1">
            {[[ALL, REPOS.length] as const, ...languages].map(([name, count]) => (
              <button
                key={name}
                type="button"
                onClick={() => setLang(name)}
                aria-pressed={lang === name}
                className={cn("small", lang === name ? "font-medium" : "text-muted hover:text-ink")}
              >
                {name} <span className="tabular-nums">{count}</span>
              </button>
            ))}
          </div>
        )}

        <ul className="mt-10 space-y-6">
          {filtered.map((repo) => (
            <li key={repo.name} className="grid gap-x-6 gap-y-0.5 sm:grid-cols-[1fr_auto]">
              <a href={repo.url} target="_blank" rel="noopener noreferrer" className="link h-item">
                {repo.name}
              </a>
              <p className="small text-muted tabular-nums sm:text-right">
                {repo.language}
                {repo.stars > 0 && ` · ${repo.stars} ★`}
              </p>
              <p className="text-muted sm:col-span-2">
                {repo.description ?? "No description"}
              </p>
            </li>
          ))}
        </ul>

        <p className="mt-12">
          <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer" className="link">
            Profile on GitHub
          </a>
        </p>
      </main>
      <SiteFooter />
    </>
  );
}
