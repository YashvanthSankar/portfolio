import Link from "next/link";
import { navSections } from "@/data/sections";
import { GITHUB_URL } from "@/data/site";
import { ThemeToggle } from "@/components/theme-toggle";

/**
 * Wordmark, three section links, GitHub, and the theme switch. On /work
 * the section links point back to the home page.
 */
export function SiteHeader({ home = true }: { home?: boolean }) {
  const prefix = home ? "" : "/";
  return (
    <header className="col flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2 py-6">
      <Link href="/" className="font-medium">
        Yashvanth
      </Link>
      <nav aria-label="Primary" className="flex flex-wrap items-baseline gap-x-5 gap-y-1">
        {navSections.map((s) => (
          <a key={s.id} href={`${prefix}#${s.id}`} className="link small text-muted hover:text-ink">
            {s.label}
          </a>
        ))}
        <a
          href={GITHUB_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="link small text-muted hover:text-ink"
        >
          GitHub
        </a>
        <ThemeToggle />
      </nav>
    </header>
  );
}
