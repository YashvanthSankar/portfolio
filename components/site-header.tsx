import Link from "next/link";
import { navSections } from "@/data/sections";
import { GITHUB_URL } from "@/data/site";
import { ThemeToggle } from "@/components/theme-toggle";

/**
 * Wordmark, three section links, GitHub, and the theme switch. On /work
 * the section links point back to the home page.
 *
 * On phones the links live behind a "Menu" disclosure built on
 * <details>, so it opens and closes with no JavaScript. Choosing a link
 * leaves the menu open, but the page jumps to the section so it is out
 * of the way.
 */
export function SiteHeader({ home = true }: { home?: boolean }) {
  const prefix = home ? "" : "/";
  const links = (
    <>
      {navSections.map((s) => (
        <a key={s.id} href={`${prefix}#${s.id}`} className="link text-muted hover:text-ink">
          {s.label}
        </a>
      ))}
      <a
        href={GITHUB_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="link text-muted hover:text-ink"
      >
        GitHub
      </a>
    </>
  );

  return (
    <header className="col py-6">
      <div className="flex items-baseline justify-between gap-6">
        <Link href="/" className="font-medium">
          Yashvanth
        </Link>

        {/* Desktop: one row */}
        <nav aria-label="Primary" className="small hidden items-baseline gap-5 sm:flex">
          {links}
          <ThemeToggle />
        </nav>

        {/* Phone: theme switch stays visible; the links fold away */}
        <div className="small flex items-baseline gap-5 sm:hidden">
          <ThemeToggle />
          <details className="group">
            <summary className="link cursor-pointer list-none text-muted hover:text-ink [&::-webkit-details-marker]:hidden">
              <span className="group-open:hidden">Menu</span>
              <span className="hidden group-open:inline">Close</span>
            </summary>
          </details>
        </div>
      </div>

      {/* The phone menu's panel: a <details> cannot contain a block that
          spans the whole header row, so the panel is a sibling shown via
          :has(). Every row is a 44px tap target. */}
      <nav
        aria-label="Primary"
        className="mt-4 hidden flex-col border-t border-line pt-2 text-lg [header:has(details[open])_&]:flex sm:!hidden [&>a]:py-2.5"
      >
        {links}
      </nav>
    </header>
  );
}
