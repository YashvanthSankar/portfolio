"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { throttle, cn } from "@/lib/utils";
import { Menu, X, ArrowUpRight } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/primitives";
import { socials } from "@/data/socials";

const navItems = [
  { id: "home", label: "Home" },
  { id: "about", label: "About" },
  { id: "projects", label: "Work" },
  { id: "experience", label: "Experience" },
  { id: "contact", label: "Contact" },
];

export function Navbar() {
  const [active, setActive] = useState("home");
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [pendingScrollId, setPendingScrollId] = useState<string | null>(null);

  useEffect(() => {
    const onScroll = throttle(() => {
      setScrolled(window.scrollY > 24);
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
        className={cn(
          "sticky inset-x-0 top-0 z-50 transition-[background-color,border-color,backdrop-filter] duration-300",
          scrolled
            ? "border-b border-line bg-paper/80 backdrop-blur-md"
            : "border-b border-transparent bg-transparent"
        )}
      >
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-6">
          <button
            onClick={() => scrollTo("home")}
            aria-label="Go to top"
            className="rounded-full text-[15px] font-semibold tracking-tight text-ink transition-opacity duration-200 hover:opacity-70"
          >
            ys<span className="text-faint">.</span>
          </button>

          <nav className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-1 md:flex">
            {navItems.map((item) => {
              const isActive = active === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => scrollTo(item.id)}
                  aria-current={isActive ? "page" : undefined}
                  className={cn(
                    "rounded-full px-3 py-1.5 text-sm transition-colors duration-200",
                    isActive
                      ? "bg-surface-hover text-ink"
                      : "text-muted hover:text-ink"
                  )}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>

          <div className="flex items-center gap-1.5">
            <ThemeToggle />
            <div className="hidden md:block">
              <Button as="a" href="/YashvanthS_Resume.pdf" download variant="secondary" size="sm">
                Resume
              </Button>
            </div>

            <button
              onClick={() => setMenuOpen((p) => !p)}
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-expanded={menuOpen}
              className="inline-flex h-9 w-9 items-center justify-center rounded-full text-muted transition-colors duration-200 hover:bg-surface-hover hover:text-ink md:hidden"
            >
              {menuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {menuOpen && (
          <motion.nav
            key="panel"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="fixed inset-0 z-40 flex h-dvh w-screen flex-col bg-paper pt-16 md:hidden"
            aria-label="Mobile navigation"
          >
            <ul className="flex-1 overflow-y-auto px-6 pt-6">
              {navItems.map((item, i) => {
                const isActive = active === item.id;
                return (
                  <motion.li
                    key={item.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.05 + i * 0.04, duration: 0.3, ease: "easeOut" }}
                    className="border-b border-line"
                  >
                    <button
                      onClick={() => scrollTo(item.id)}
                      aria-current={isActive ? "page" : undefined}
                      className="group flex w-full items-center justify-between py-4 text-left"
                    >
                      <span
                        className={cn(
                          "text-2xl font-medium tracking-tight transition-colors duration-200",
                          isActive ? "text-ink" : "text-muted group-hover:text-ink"
                        )}
                      >
                        {item.label}
                      </span>
                      <span className="font-mono text-[11px] tabular-nums text-faint">
                        0{i + 1}
                      </span>
                    </button>
                  </motion.li>
                );
              })}
            </ul>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25, duration: 0.3, ease: "easeOut" }}
              className="border-t border-line px-6 pb-[max(env(safe-area-inset-bottom),1.5rem)] pt-5"
            >
              <div className="mb-5 flex items-center gap-4">
                {socials.slice(0, 5).map((s) => (
                  <a
                    key={s.name}
                    href={s.href}
                    {...(!s.noBlank && { target: "_blank", rel: "noopener noreferrer" })}
                    aria-label={s.name}
                    className="text-muted transition-colors duration-200 hover:text-ink"
                  >
                    <span className="block h-4.5 w-4.5">{s.icon}</span>
                  </a>
                ))}
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Button onClick={() => scrollTo("contact")}>
                  Get in touch
                  <ArrowUpRight className="h-4 w-4" />
                </Button>
                <Button as="a" href="/YashvanthS_Resume.pdf" download variant="secondary">
                  Resume
                </Button>
              </div>
            </motion.div>
          </motion.nav>
        )}
      </AnimatePresence>
    </>
  );
}
