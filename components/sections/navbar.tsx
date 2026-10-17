"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { cn, throttle } from "@/lib/utils";
import { useScrollTo } from "@/components/providers/smooth-scroll";
import { useActiveSection } from "@/lib/use-active-section";
import { navSections, sections, chapterNumber, HERO_ID } from "@/data/sections";
import { socials } from "@/data/socials";
import { GITHUB_URL } from "@/data/site";
import { SocialIcon, SocialSprite } from "@/components/ui/social-icon";

/** The mobile panel carries the whole page; the hero is the wordmark's job. */
const panelSections = sections.filter((s) => s.id !== HERO_ID);

interface NavbarProps {
  /** `page` links back to `/` instead of scroll-spying sections. */
  variant?: "home" | "page";
}

export function Navbar({ variant = "home" }: NavbarProps) {
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const lastY = useRef(0);
  const scrollTo = useScrollTo();

  /* Shared with SectionIndex and MobileProgress so the three indicators
     can never disagree about which chapter the reader is in. */
  const { active } = useActiveSection({ enabled: variant === "home" });

  /* Hide on scroll-down, reveal on scroll-up (with hysteresis). */
  useEffect(() => {
    const onScroll = throttle(() => {
      const y = window.scrollY;
      setScrolled(y > 24);

      if (Math.abs(y - lastY.current) > 8) {
        setHidden(y > 140 && y > lastY.current);
        lastY.current = y;
      }
    }, 100);

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      onScroll.cancel();
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  /* Lock body scroll while the panel is open. */
  useEffect(() => {
    if (!menuOpen) return;
    const scrollY = window.scrollY;
    const { style } = document.body;
    const prev = {
      overflow: style.overflow,
      position: style.position,
      top: style.top,
      width: style.width,
    };
    style.overflow = "hidden";
    style.position = "fixed";
    style.top = `-${scrollY}px`;
    style.width = "100%";
    return () => {
      style.overflow = prev.overflow;
      style.position = prev.position;
      style.top = prev.top;
      style.width = prev.width;
      window.scrollTo(0, scrollY);
    };
  }, [menuOpen]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    const onResize = () => {
      if (window.innerWidth >= 768) setMenuOpen(false);
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  const go = (id: string) => {
    setMenuOpen(false);
    // Wait a frame so the scroll lock is released before Lenis moves.
    requestAnimationFrame(() => scrollTo(`#${id}`));
  };

  return (
    <>
      {/* The icon symbols every `<SocialIcon>` on the page points at. */}
      <SocialSprite />
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-40 transition-[transform,background-color,border-color,backdrop-filter] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]",
          hidden && !menuOpen ? "-translate-y-full" : "translate-y-0",
          scrolled && !menuOpen
            ? "border-b border-[var(--line-1)] bg-[color-mix(in_srgb,var(--bg-0)_82%,transparent)] backdrop-blur-xl"
            : "border-b border-transparent"
        )}
      >
        <div className="mx-auto flex h-[72px] max-w-[var(--container)] items-center justify-between px-[var(--gutter)]">
          {/* Wordmark */}
          {variant === "home" ? (
            <button
              onClick={() => scrollTo(0, { updateHash: false })}
              aria-label="Back to top"
              className="group flex items-baseline gap-2"
            >
              <span className="font-display text-[15px] font-semibold tracking-[-0.02em] text-[var(--text-1)]">
                Yashvanth
              </span>
              <span className="h-[5px] w-[5px] translate-y-[-2px] rounded-full bg-[var(--accent)] transition-shadow duration-300 group-hover:shadow-[var(--glow-accent)]" />
            </button>
          ) : (
            <Link href="/" aria-label="Back to home" className="group flex items-baseline gap-2">
              <span className="font-display text-[15px] font-semibold tracking-[-0.02em] text-[var(--text-1)]">
                Yashvanth
              </span>
              <span className="h-[5px] w-[5px] translate-y-[-2px] rounded-full bg-[var(--accent)] transition-shadow duration-300 group-hover:shadow-[var(--glow-accent)]" />
            </Link>
          )}

          {/* Desktop nav */}
          <nav className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-1 md:flex">
            {variant === "home" ? (
              navSections.map((item) => (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  onClick={(e) => {
                    e.preventDefault();
                    go(item.id);
                  }}
                  aria-current={active === item.id ? "page" : undefined}
                  className={cn(
                    "tap-safe px-3 py-1.5 font-mono text-[12px] tracking-[0.02em] transition-colors duration-200",
                    active === item.id
                      ? "text-[var(--accent)]"
                      : "text-[var(--text-2)] hover:text-[var(--text-1)]"
                  )}
                >
                  {item.label}
                </a>
              ))
            ) : (
              <>
                <Link
                  href="/"
                  className="px-3 py-1.5 font-mono text-[12px] text-[var(--text-2)] transition-colors duration-200 hover:text-[var(--text-1)]"
                >
                  Home
                </Link>
                <a
                  href={GITHUB_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 font-mono text-[12px] text-[var(--text-2)] transition-colors duration-200 hover:text-[var(--text-1)]"
                >
                  GitHub
                </a>
              </>
            )}
          </nav>

          <div className="flex items-center gap-2">
            <a
              href="/YashvanthS_Resume.pdf"
              download
              className="btn btn-sm btn-ghost hidden md:inline-flex"
            >
              Résumé
            </a>
            {variant === "home" ? (
              <button
                onClick={() => go("contact")}
                className="btn btn-sm btn-primary hidden md:inline-flex"
              >
                Let&apos;s talk
                <ArrowUpRight className="h-3.5 w-3.5" />
              </button>
            ) : (
              <Link href="/#contact" className="btn btn-sm btn-primary hidden md:inline-flex">
                Let&apos;s talk
                <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>
            )}

            <button
              onClick={() => setMenuOpen((p) => !p)}
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-expanded={menuOpen}
              className="inline-flex h-11 w-11 items-center justify-center rounded-[2px] border border-[var(--line-2)] text-[var(--text-1)] transition-colors duration-200 hover:bg-[var(--bg-1)] md:hidden"
            >
              {menuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile panel — CSS clip-path wipe, no animation library */}
      <nav
        aria-label="Mobile navigation"
        aria-hidden={!menuOpen}
        className={cn(
          "fixed inset-0 z-[60] flex h-dvh w-screen flex-col bg-[var(--bg-0)] transition-[clip-path] duration-500 ease-[cubic-bezier(0.83,0,0.17,1)] md:hidden",
          menuOpen ? "pointer-events-auto" : "pointer-events-none"
        )}
        style={{
          clipPath: menuOpen ? "inset(0% 0% 0% 0%)" : "inset(0% 0% 100% 0%)",
        }}
      >
        <div className="flex items-center justify-between border-b border-[var(--line-1)] px-[var(--gutter)] pb-4 pt-[max(env(safe-area-inset-top),1.25rem)]">
          <span className="meta">menu</span>
          <button
            onClick={() => setMenuOpen(false)}
            aria-label="Close menu"
            className="inline-flex h-11 w-11 items-center justify-center rounded-[2px] border border-[var(--line-2)] text-[var(--text-1)]"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <ul className="flex flex-1 flex-col justify-center gap-1 overflow-y-auto px-[var(--gutter)] py-6">
          {/* Every chapter, not just the ones the top bar has room for —
              this panel is the only navigation a phone gets, and the bar's
              shortlist exists to keep the bar short. */}
          {(variant === "home"
            ? panelSections
            : [
                { id: "__home", label: "Home" },
                { id: "__github", label: "GitHub" },
              ]
          ).map((item, i) => {
            const num =
              variant === "home" ? chapterNumber(item.id) : String(i + 1).padStart(2, "0");
            const inner = (
              <>
                <span className="meta w-8 shrink-0 pt-3 text-[var(--text-3)]">{num}</span>
                <span className="display-md font-medium transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-1">
                  {item.label}
                </span>
              </>
            );
            const rowClass =
              "group flex w-full items-baseline gap-4 border-b border-[var(--line-1)] py-4 text-left";

            if (item.id === "__home") {
              return (
                <li key={item.id}>
                  <Link href="/" onClick={() => setMenuOpen(false)} className={rowClass}>
                    {inner}
                  </Link>
                </li>
              );
            }
            if (item.id === "__github") {
              return (
                <li key={item.id}>
                  <a
                    href={GITHUB_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setMenuOpen(false)}
                    className={rowClass}
                  >
                    {inner}
                  </a>
                </li>
              );
            }
            return (
              <li key={item.id}>
                <a
                  href={`#${item.id}`}
                  onClick={(e) => {
                    e.preventDefault();
                    go(item.id);
                  }}
                  className={rowClass}
                >
                  {inner}
                </a>
              </li>
            );
          })}
        </ul>

        <div className="border-t border-[var(--line-1)] px-[var(--gutter)] pb-[max(env(safe-area-inset-bottom),1.5rem)] pt-5">
          <div className="mb-4 flex items-center justify-between">
            <span className="meta">elsewhere</span>
            <div className="tap-row flex items-center gap-3">
              {socials.slice(0, 5).map((s) => (
                <a
                  key={s.name}
                  href={s.href}
                  {...(!s.noBlank && { target: "_blank", rel: "noopener noreferrer" })}
                  aria-label={s.name}
                  className="tap-safe h-4 w-4 text-[var(--text-2)] transition-colors duration-200 hover:text-[var(--accent)]"
                >
                  <SocialIcon icon={s.icon} />
                </a>
              ))}
            </div>
          </div>
          <a href="/YashvanthS_Resume.pdf" download className="btn btn-outline w-full">
            Download résumé
          </a>
        </div>
      </nav>
    </>
  );
}
