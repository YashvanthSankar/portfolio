import Link from "next/link";
import { navSections } from "@/data/sections";
import { GITHUB_URL } from "@/data/site";
import { ThemeToggle } from "@/components/theme-toggle";
import { Menu } from "@/components/menu";

/**
 * A plain header that scrolls away with the page. Desktop: wordmark,
 * section links, GitHub, theme switch in one row. Phone: wordmark, theme
 * switch and a Menu button that opens the list.
 */
export function SiteHeader({ home = true }: { home?: boolean }) {
  const prefix = home ? "" : "/";
  return (
    <header className="col flex items-center justify-between gap-6 pt-7">
      <Link href="/" className="font-medium">
        Yashvanth
      </Link>

      <nav aria-label="Primary" className="small nav-desktop items-center gap-6">
        {navSections.map((s) => (
          <a key={s.id} href={`${prefix}#${s.id}`} className="nav-link">
            {s.label}
          </a>
        ))}
        <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer" className="nav-link">
          GitHub
        </a>
        <ThemeToggle />
      </nav>

      <div className="small nav-phone items-center gap-5">
        <ThemeToggle />
        <Menu home={home} />
      </div>
    </header>
  );
}
