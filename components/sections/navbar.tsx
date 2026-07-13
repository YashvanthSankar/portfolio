"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";

const links = [
  { label: "About", href: "/#about" },
  { label: "Work", href: "/#projects" },
  { label: "Experience", href: "/#experience" },
  { label: "Contact", href: "/#contact" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const close = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", close);
    return () => window.removeEventListener("keydown", close);
  }, []);

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--border-ink)] bg-[color-mix(in_srgb,var(--paper)_88%,transparent)] backdrop-blur-xl">
      <div className="site-container flex h-[4.5rem] items-center justify-between">
        <Link href="/" className="group flex items-center gap-2.5" aria-label="Yashvanth Sankar, home">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--ink)] text-[11px] font-semibold tracking-[-0.02em] text-[var(--paper)] transition-transform duration-300 group-hover:rotate-[-5deg]">
            YS
          </span>
          <span className="hidden text-sm font-semibold tracking-[-0.02em] sm:block">Yashvanth Sankar</span>
        </Link>

        <nav className="hidden items-center gap-7 md:flex" aria-label="Primary navigation">
          {links.map((link) => (
            <Link key={link.label} href={link.href} className="text-sm text-[var(--muted)] transition-colors duration-200 hover:text-[var(--ink)]">
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Link href="/#contact" className="button-primary hidden min-h-9 px-3.5 py-1.5 text-xs sm:inline-flex">
            Let&apos;s talk <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[var(--border-ink)] md:hidden"
            aria-expanded={open}
            aria-controls="mobile-navigation"
            aria-label={open ? "Close navigation" : "Open navigation"}
          >
            {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      <div
        id="mobile-navigation"
        aria-hidden={!open}
        className={`overflow-hidden border-t border-[var(--border-ink)] transition-[max-height,opacity] duration-300 md:hidden ${
          open ? "max-h-80 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <nav className="site-container flex flex-col py-3" aria-label="Mobile navigation">
          {links.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              onClick={() => setOpen(false)}
              tabIndex={open ? 0 : -1}
              className="flex items-center justify-between border-b border-[var(--border-ink)] py-3.5 text-sm last:border-0"
            >
              {link.label}<ArrowUpRight className="h-3.5 w-3.5 text-[var(--muted)]" />
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
