"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { navSections, sections } from "@/data/sections";
import { GITHUB_URL } from "@/data/site";
import { ThemeToggle } from "@/components/theme-toggle";
import { cn } from "@/lib/utils";

/**
 * Sticky header: wordmark, section links, GitHub, theme switch. On the
 * home page the link for the section under the reader is marked. Below
 * 640px the links fold behind "Menu" as full-width rows and close again
 * when one is chosen or Escape is pressed.
 */
export function SiteHeader({ home = true }: { home?: boolean }) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState<string | null>(null);
  const prefix = home ? "" : "/";

  /* The hairline under the bar appears once the page has moved. */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* Scroll-spy: the last section whose top has passed a third of the
     viewport is the current one. Above the first section nothing is. */
  useEffect(() => {
    if (!home) return;
    const onScroll = () => {
      const probe = window.innerHeight / 3;
      let current: string | null = null;
      for (const s of sections) {
        const el = document.getElementById(s.id);
        if (el && el.getBoundingClientRect().top <= probe) current = s.id;
      }
      setActive(current);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [home]);

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
    <header
      className={cn(
        "sticky top-0 z-10 bg-bg transition-[border-color] duration-200",
        "border-b",
        scrolled || open ? "border-line" : "border-transparent"
      )}
    >
      <div className="col flex items-center justify-between gap-6 py-4">
        <Link href="/" className="font-medium">
          Yashvanth
        </Link>

        {/* Desktop: one row, the current section marked */}
        <nav aria-label="Primary" className="small nav-desktop items-center gap-6">
          {items.map((it) => (
            <a
              key={it.id}
              href={it.href}
              {...(it.external && { target: "_blank", rel: "noopener noreferrer" })}
              aria-current={active === it.id ? "true" : undefined}
              className="nav-link"
            >
              {it.label}
            </a>
          ))}
          <ThemeToggle />
        </nav>

        {/* Phone: theme switch stays visible; the links fold away */}
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
        <nav id="phone-menu" aria-label="Primary" className="nav-phone col flex-col pb-3">
          {items.map((it) => (
            <a
              key={it.id}
              href={it.href}
              {...(it.external && { target: "_blank", rel: "noopener noreferrer" })}
              onClick={() => setOpen(false)}
              aria-current={active === it.id ? "true" : undefined}
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
