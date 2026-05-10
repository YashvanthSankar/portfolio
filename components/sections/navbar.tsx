"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { throttle, cn } from "@/lib/utils";
import { Home, Folder, User, Briefcase, Mail, Download, Menu, X } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { BrutalButton } from "@/components/ui/brutal";
import { socials } from "@/data/socials";

const navItems = [
  { id: "home", label: "Home", icon: Home },
  { id: "about", label: "About", icon: User },
  { id: "projects", label: "Work", icon: Folder },
  { id: "experience", label: "Experience", icon: Briefcase },
  { id: "contact", label: "Contact", icon: Mail },
];

export function Navbar() {
  const [active, setActive] = useState("home");
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [pendingScrollId, setPendingScrollId] = useState<string | null>(null);

  useEffect(() => {
    const onScroll = throttle(() => {
      setScrolled(window.scrollY > 48);
      for (const item of navItems) {
        const el = document.getElementById(item.id);
        if (!el) continue;
        const { top, bottom } = el.getBoundingClientRect();
        if (top <= 100 && bottom >= 100) {
          setActive(item.id);
          break;
        }
      }
    }, 16);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 768) setMenuOpen(false);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    const scrollY = window.scrollY;
    const prevHtml = document.documentElement.style.overflow;
    const prevBody = document.body.style.overflow;
    const prevPos = document.body.style.position;
    const prevTop = document.body.style.top;
    const prevWidth = document.body.style.width;
    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";
    document.body.style.position = "fixed";
    document.body.style.top = `-${scrollY}px`;
    document.body.style.width = "100%";
    return () => {
      document.documentElement.style.overflow = prevHtml;
      document.body.style.overflow = prevBody;
      document.body.style.position = prevPos;
      document.body.style.top = prevTop;
      document.body.style.width = prevWidth;
      window.scrollTo(0, scrollY);
    };
  }, [menuOpen]);

  useEffect(() => {
    if (menuOpen || !pendingScrollId) return;
    const timer = window.setTimeout(() => {
      document.getElementById(pendingScrollId)?.scrollIntoView({ behavior: "smooth", block: "start" });
      setPendingScrollId(null);
    }, 0);
    return () => window.clearTimeout(timer);
  }, [menuOpen, pendingScrollId]);

  const scrollTo = (id: string) => {
    if (menuOpen) {
      setPendingScrollId(id);
      setMenuOpen(false);
      return;
    }
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <>
      <header
        className={cn("sticky inset-x-0 top-0 z-50 transition-all duration-200", scrolled ? "py-3" : "py-4")}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div
            className={cn(
              "flex items-center justify-between gap-2 px-3 py-2",
              "border-[2.5px] border-[var(--border-ink)] bg-[var(--surface)]",
              "shadow-brutal"
            )}
          >
            <button
              onClick={() => scrollTo("home")}
              aria-label="Go to top"
              className="logo-frame relative h-10 w-10 shrink-0 border-2 border-[var(--ink)] overflow-hidden shadow-[3px_3px_0_0_var(--ink)] transition-transform duration-200 ease-[cubic-bezier(0.32,0.72,0,1)] hover:-translate-x-[2px] hover:-translate-y-[2px] active:translate-x-[1px] active:translate-y-[1px]"
            >
              <span className="logo-mark" aria-hidden="true" />
            </button>

            <nav className="hidden md:flex items-center gap-1 absolute left-1/2 -translate-x-1/2">
              {navItems.map((item) => {
                const isActive = active === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => scrollTo(item.id)}
                    aria-current={isActive ? "page" : undefined}
                    className={cn(
                      "group relative px-3 py-1.5 font-display font-semibold text-sm",
                      "border-2 border-transparent",
                      "transition-[transform,background-color,box-shadow,border-color] duration-200 ease-[cubic-bezier(0.32,0.72,0,1)]",
                      isActive
                        ? "bg-[var(--accent)] text-[var(--accent-ink)] border-[var(--border-ink)] shadow-[3px_3px_0_0_var(--border-ink)]"
                        : "text-[var(--ink)] hover:-translate-y-[2px] hover:border-[var(--border-ink)] hover:bg-[var(--surface-alt)] hover:shadow-[3px_3px_0_0_var(--border-ink)]"
                    )}
                  >
                    {item.label}
                  </button>
                );
              })}
            </nav>

            <div className="flex items-center gap-2">
              <ThemeToggle />
              <div className="hidden md:block">
                <BrutalButton as="a" href="/YashvanthS_Resume.pdf" download variant="ghost" size="sm">
                  <Download className="w-3.5 h-3.5" />
                  Resume
                </BrutalButton>
              </div>
              <div className="hidden md:block">
                <BrutalButton variant="primary" size="sm" onClick={() => scrollTo("contact")}>
                  Let&apos;s talk
                </BrutalButton>
              </div>

              <button
                onClick={() => setMenuOpen((p) => !p)}
                aria-label={menuOpen ? "Close menu" : "Open menu"}
                aria-expanded={menuOpen}
                className="md:hidden inline-flex items-center justify-center w-10 h-10 border-2 border-[var(--border-ink)] bg-[var(--accent)] text-[var(--accent-ink)] shadow-[3px_3px_0_0_var(--border-ink)]"
              >
                <AnimatePresence mode="wait" initial={false}>
                  {menuOpen ? (
                    <motion.span
                      key="x"
                      initial={{ opacity: 0, rotate: -90 }}
                      animate={{ opacity: 1, rotate: 0 }}
                      exit={{ opacity: 0, rotate: 90 }}
                      transition={{ duration: 0.15 }}
                      className="flex"
                    >
                      <X className="w-4 h-4" />
                    </motion.span>
                  ) : (
                    <motion.span
                      key="menu"
                      initial={{ opacity: 0, rotate: 90 }}
                      animate={{ opacity: 1, rotate: 0 }}
                      exit={{ opacity: 0, rotate: -90 }}
                      transition={{ duration: 0.15 }}
                      className="flex"
                    >
                      <Menu className="w-4 h-4" />
                    </motion.span>
                  )}
                </AnimatePresence>
              </button>
            </div>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {menuOpen && (
          <motion.nav
            key="panel"
            initial={{ clipPath: "inset(0% 0% 100% 0%)" }}
            animate={{ clipPath: "inset(0% 0% 0% 0%)" }}
            exit={{ clipPath: "inset(0% 0% 100% 0%)" }}
            transition={{ duration: 0.55, ease: [0.32, 0.72, 0, 1] }}
            className="fixed inset-0 z-[60] md:hidden flex h-dvh w-screen flex-col overflow-hidden bg-[var(--paper)]"
            aria-label="Mobile navigation"
          >
            {/* Background watermark — giant typographic wallpaper */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 flex items-end justify-end overflow-hidden select-none"
            >
              <span
                className="font-display font-bold leading-[0.85] tracking-[-0.06em] text-[var(--ink)] opacity-[0.04] whitespace-nowrap -mr-12 -mb-8"
                style={{ fontSize: "clamp(14rem, 50vw, 28rem)" }}
              >
                YASH.
              </span>
            </div>
            {/* Background grid texture */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 opacity-[0.4]"
              style={{
                backgroundImage:
                  "linear-gradient(rgba(11,11,12,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(11,11,12,0.04) 1px, transparent 1px)",
                backgroundSize: "40px 40px",
              }}
            />

            {/* Top strip — meta */}
            <div className="relative flex items-center justify-between px-6 pt-[max(env(safe-area-inset-top),1.25rem)] pb-4 border-b-[2.5px] border-[var(--ink)]">
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.18, duration: 0.4 }}
                className="flex items-center gap-2"
              >
                <span className="inline-flex items-center gap-1.5 px-2 py-1 border-2 border-[var(--ink)] bg-[var(--ink)] text-[var(--paper)] font-mono text-[9px] font-bold tracking-[0.22em] uppercase">
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--paper)] opacity-70" />
                    <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[var(--paper)]" />
                  </span>
                  menu · open
                </span>
              </motion.div>
              <motion.button
                initial={{ opacity: 0, rotate: -90, scale: 0.7 }}
                animate={{ opacity: 1, rotate: 0, scale: 1 }}
                exit={{ opacity: 0, rotate: 90, scale: 0.7 }}
                transition={{ delay: 0.18, duration: 0.4, ease: [0.32, 0.72, 0, 1] }}
                onClick={() => setMenuOpen(false)}
                aria-label="Close menu"
                className="inline-flex items-center justify-center w-11 h-11 border-[2.5px] border-[var(--ink)] bg-[var(--ink)] text-[var(--paper)] shadow-[4px_4px_0_0_var(--ink)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[1px_1px_0_0_var(--ink)] transition-transform duration-150"
              >
                <X className="w-5 h-5" />
              </motion.button>
            </div>

            {/* Big editorial nav list */}
            <ul className="relative flex-1 flex flex-col justify-center px-6 gap-1 overflow-y-auto py-6">
              {navItems.map((item, i) => {
                const isActive = active === item.id;
                const num = String(i + 1).padStart(2, "0");
                return (
                  <motion.li
                    key={item.id}
                    initial={{ opacity: 0, x: -40, skewX: 4 }}
                    animate={{ opacity: 1, x: 0, skewX: 0 }}
                    exit={{ opacity: 0, x: -40 }}
                    transition={{
                      delay: 0.22 + i * 0.06,
                      duration: 0.45,
                      ease: [0.32, 0.72, 0, 1],
                    }}
                  >
                    <button
                      onClick={() => scrollTo(item.id)}
                      aria-current={isActive ? "page" : undefined}
                      className={cn(
                        "group relative w-full flex items-baseline gap-4 py-3 text-left border-b-2 border-dashed border-[var(--ink)]/20",
                        "transition-colors duration-200"
                      )}
                    >
                      <span className="font-mono text-[11px] font-bold tabular-nums tracking-[0.18em] text-[var(--muted)] group-hover:text-[var(--ink)] transition-colors duration-200">
                        / {num}
                      </span>
                      <span
                        className={cn(
                          "font-display font-bold leading-[0.95] tracking-[-0.04em] transition-[color,transform] duration-300 ease-[cubic-bezier(0.32,0.72,0,1)]",
                          "group-hover:translate-x-2 group-active:translate-x-1",
                          isActive ? "text-[var(--ink)]" : "text-[var(--ink)]/85"
                        )}
                        style={{ fontSize: "clamp(2.4rem, 11vw, 4rem)" }}
                      >
                        {item.label}
                      </span>
                      {isActive && (
                        <span
                          className="ml-auto self-center font-mono text-[9px] font-bold tracking-[0.22em] uppercase text-[var(--paper)] bg-[var(--ink)] px-2 py-1 border-2 border-[var(--ink)] shadow-[2px_2px_0_0_var(--ink)]"
                          aria-hidden="true"
                        >
                          here
                        </span>
                      )}
                      {/* hover underline that draws in */}
                      <span
                        aria-hidden="true"
                        className="absolute left-0 right-0 bottom-0 h-[3px] bg-[var(--ink)] origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]"
                      />
                    </button>
                  </motion.li>
                );
              })}
            </ul>

            {/* Bottom strip — socials, time, CTAs, theme */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 24 }}
              transition={{ delay: 0.5, duration: 0.4, ease: [0.32, 0.72, 0, 1] }}
              className="relative px-6 pb-[max(env(safe-area-inset-bottom),1.5rem)] pt-5 border-t-[2.5px] border-[var(--ink)] bg-[var(--paper)]"
            >
              {/* Socials row */}
              <div className="flex items-center justify-between gap-3 mb-4">
                <span className="font-mono text-[9px] font-bold tracking-[0.22em] uppercase text-[var(--muted)]">
                  follow ↗
                </span>
                <div className="flex items-center gap-1.5">
                  {socials.slice(0, 5).map((s) => (
                    <a
                      key={s.name}
                      href={s.href}
                      {...(!s.noBlank && { target: "_blank", rel: "noopener noreferrer" })}
                      aria-label={s.name}
                      className="inline-flex items-center justify-center w-9 h-9 border-2 border-[var(--ink)] bg-[var(--surface)] text-[var(--ink)] shadow-[2px_2px_0_0_var(--ink)] active:translate-x-[1px] active:translate-y-[1px] active:shadow-[1px_1px_0_0_var(--ink)] transition-transform duration-150"
                    >
                      <span className="w-3.5 h-3.5">{s.icon}</span>
                    </a>
                  ))}
                </div>
              </div>

              {/* CTA row */}
              <div className="grid grid-cols-2 gap-3">
                <BrutalButton variant="primary" onClick={() => scrollTo("contact")}>
                  Let&apos;s talk
                </BrutalButton>
                <BrutalButton as="a" href="/YashvanthS_Resume.pdf" download variant="secondary">
                  <Download className="w-4 h-4" />
                  Resume
                </BrutalButton>
              </div>

              {/* Footer line */}
              <div className="mt-4 flex items-center justify-between font-mono text-[9px] tracking-[0.22em] uppercase text-[var(--muted)]">
                <span>portfolio · 2026</span>
                <span>chennai · ist</span>
              </div>
            </motion.div>
          </motion.nav>
        )}
      </AnimatePresence>
    </>
  );
}
