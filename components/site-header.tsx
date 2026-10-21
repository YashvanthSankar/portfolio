"use client";

import { useState } from "react";
import Link from "next/link";
import { navSections } from "@/data/sections";
import { GITHUB_URL } from "@/data/site";
import { ThemeToggle } from "@/components/theme-toggle";

/**
 * Wordmark, three section links, GitHub, and the theme switch. On /work
 * the section links point back to the home page. Below 640px the links
 * fold behind a "Menu" button and close again when one is chosen.
 */
export function SiteHeader({ home = true }: { home?: boolean }) {
  const [open, setOpen] = useState(false);
  const prefix = home ? "" : "/";

  const links = (onPick?: () => void) => (
    <>
      {navSections.map((s) => (
        <a
          key={s.id}
          href={`${prefix}#${s.id}`}
          onClick={onPick}
          className="link text-muted hover:text-ink"
        >
          {s.label}
        </a>
      ))}
      <a
        href={GITHUB_URL}
        target="_blank"
        rel="noopener noreferrer"
        onClick={onPick}
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
        <nav aria-label="Primary" className="small nav-desktop items-baseline gap-5">
          {links()}
          <ThemeToggle />
        </nav>

        {/* Phone: theme switch stays visible; the links fold away */}
        <div className="small nav-phone items-baseline gap-5">
          <ThemeToggle />
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="phone-menu"
            className="link text-muted hover:text-ink"
          >
            {open ? "Close" : "Menu"}
          </button>
        </div>
      </div>

      {open && (
        <nav
          id="phone-menu"
          aria-label="Primary"
          className="nav-phone mt-4 flex-col border-t border-line pt-2 text-lg [&>a]:py-2.5"
        >
          {links(() => setOpen(false))}
        </nav>
      )}
    </header>
  );
}
