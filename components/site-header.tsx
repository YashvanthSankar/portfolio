"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { navSections } from "@/data/sections";
import { GITHUB_URL } from "@/data/site";
import { ThemeToggle } from "@/components/theme-toggle";

/**
 * A plain header that scrolls away with the page: wordmark, section
 * links, GitHub, theme switch. Below 640px the links fold behind "Menu"
 * as full-width rows and close again when one is chosen or Escape is
 * pressed. On /work the section links point back to the home page.
 */
export function SiteHeader({ home = true }: { home?: boolean }) {
  const [open, setOpen] = useState(false);
  const prefix = home ? "" : "/";

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const items = [
    ...navSections.map((s) => ({ id: s.id, label: s.label, href: `${prefix}#${s.id}`, external: false })),
    { id: "github", label: "GitHub", href: GITHUB_URL, external: true },
  ];

  return (
    <header className="col pt-7 pb-2">
      <div className="flex items-center justify-between gap-6">
        <Link href="/" className="font-medium">
          Yashvanth
        </Link>

        <nav aria-label="Primary" className="small nav-desktop items-center gap-6">
          {items.map((it) => (
            <a
              key={it.id}
              href={it.href}
              {...(it.external && { target: "_blank", rel: "noopener noreferrer" })}
              className="nav-link"
            >
              {it.label}
            </a>
          ))}
          <ThemeToggle />
        </nav>

        <div className="small nav-phone items-center gap-5">
          <ThemeToggle />
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="phone-menu"
            className="nav-link"
          >
            {open ? "Close" : "Menu"}
          </button>
        </div>
      </div>

      {open && (
        <nav id="phone-menu" aria-label="Primary" className="nav-phone mt-4 flex-col">
          {items.map((it) => (
            <a
              key={it.id}
              href={it.href}
              {...(it.external && { target: "_blank", rel: "noopener noreferrer" })}
              onClick={() => setOpen(false)}
              className="nav-link border-t border-line py-3.5 text-lg"
            >
              {it.label}
            </a>
          ))}
        </nav>
      )}
    </header>
  );
}
