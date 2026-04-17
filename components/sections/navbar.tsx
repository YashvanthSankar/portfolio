"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { throttle, cn } from "@/lib/utils";
import { Home, Folder, User, Briefcase, Mail, Download, Menu, X } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { BrutalButton } from "@/components/ui/brutal";

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
              className="relative h-10 w-10 shrink-0 border-2 border-[var(--border-ink)] overflow-hidden bg-[var(--accent)]"
            >
              <Image src="/ys_red.webp" alt="" fill className="object-cover" quality={85} />
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
                      "relative px-3 py-1.5 font-display font-semibold text-sm transition-transform duration-100",
                      "border-2 border-transparent",
                      isActive
                        ? "bg-[var(--accent)] text-[var(--accent-ink)] border-[var(--border-ink)] shadow-[3px_3px_0_0_var(--border-ink)]"
                        : "text-[var(--ink)] hover:-translate-y-[1px] hover:border-[var(--border-ink)] hover:bg-[var(--surface)] hover:shadow-[3px_3px_0_0_var(--border-ink)]"
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
            initial={{ x: "-100%" }}
            animate={{ x: "0%" }}
            exit={{ x: "-100%" }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 z-[60] md:hidden flex h-dvh w-screen flex-col overflow-hidden bg-[var(--paper)]"
          >
            <div className="flex items-center justify-between px-6 pt-[max(env(safe-area-inset-top),1rem)] pb-4 border-b-[2.5px] border-[var(--border-ink)]">
              <span className="font-display font-bold text-lg">Menu</span>
              <button
                onClick={() => setMenuOpen(false)}
                aria-label="Close menu"
                className="inline-flex items-center justify-center w-10 h-10 border-2 border-[var(--border-ink)] bg-[var(--accent)] text-[var(--accent-ink)] shadow-[3px_3px_0_0_var(--border-ink)]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <ul className="flex-1 flex flex-col justify-center px-6 gap-3">
              {navItems.map((item, i) => {
                const isActive = active === item.id;
                return (
                  <motion.li
                    key={item.id}
                    initial={{ opacity: 0, x: -32 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.06, duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <button
                      onClick={() => scrollTo(item.id)}
                      aria-current={isActive ? "page" : undefined}
                      className={cn(
                        "w-full flex items-center gap-4 px-5 py-4 text-left",
                        "border-[2.5px] border-[var(--border-ink)] font-display font-bold text-2xl",
                        "shadow-brutal transition-transform duration-150",
                        "hover:-translate-x-[2px] hover:-translate-y-[2px] hover:shadow-[8px_8px_0_0_var(--border-ink)]",
                        isActive
                          ? "bg-[var(--accent)] text-[var(--accent-ink)]"
                          : "bg-[var(--surface)] text-[var(--ink)]"
                      )}
                    >
                      <item.icon className="w-5 h-5 shrink-0" aria-hidden="true" />
                      {item.label}
                    </button>
                  </motion.li>
                );
              })}
            </ul>

            <div className="px-6 pb-8 grid grid-cols-2 gap-3 border-t-[2.5px] border-[var(--border-ink)] pt-5">
              <BrutalButton variant="primary" onClick={() => scrollTo("contact")}>
                Let&apos;s talk
              </BrutalButton>
              <BrutalButton as="a" href="/YashvanthS_Resume.pdf" download variant="ghost">
                <Download className="w-4 h-4" />
                Resume
              </BrutalButton>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </>
  );
}
