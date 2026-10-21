import Link from "next/link";
import { navSections } from "@/data/sections";
import { GITHUB_URL } from "@/data/site";
import { ThemeToggle } from "@/components/theme-toggle";

/**
 * A plain header that scrolls away with the page: wordmark, section
 * links, GitHub, theme switch. On phones the links sit in one row under
 * the wordmark that scrolls sideways if it runs out of room — no menu,
 * no state. On /work the section links point back to the home page.
 */
export function SiteHeader({ home = true }: { home?: boolean }) {
  const prefix = home ? "" : "/";
  const items = [
    ...navSections.map((s) => ({ id: s.id, label: s.label, href: `${prefix}#${s.id}`, external: false })),
    { id: "github", label: "GitHub", href: GITHUB_URL, external: true },
  ];

  const links = items.map((it) => (
    <a
      key={it.id}
      href={it.href}
      {...(it.external && { target: "_blank", rel: "noopener noreferrer" })}
      className="nav-link"
    >
      {it.label}
    </a>
  ));

  return (
    <header className="col pt-7">
      <div className="flex items-center justify-between gap-6">
        <Link href="/" className="font-medium">
          Yashvanth
        </Link>
        <nav aria-label="Primary" className="small nav-desktop items-center gap-6">
          {links}
          <ThemeToggle />
        </nav>
        <div className="small nav-phone">
          <ThemeToggle />
        </div>
      </div>

      {/* Phone: the same links, one scrolling row. */}
      <nav aria-label="Primary" className="small nav-phone nav-scroll mt-3 gap-5">
        {links}
      </nav>
    </header>
  );
}
