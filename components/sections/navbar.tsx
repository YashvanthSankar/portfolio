"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { throttle } from "@/lib/utils";
import { Home, Folder, User, Briefcase, Mail, Download, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/theme-toggle";

const navItems = [
  { id: "home",       label: "home",       icon: Home },
  { id: "about",      label: "about",      icon: User },
  { id: "projects",   label: "work",       icon: Folder },
  { id: "experience", label: "experience", icon: Briefcase },
  { id: "contact",    label: "contact",    icon: Mail },
];

export function Navbar() {
  const [active, setActive]     = useState("home");
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [pendingScrollId, setPendingScrollId] = useState<string | null>(null);
  const headerRef               = useRef<HTMLElement>(null);

  /* ── scroll tracking ── */
  useEffect(() => {
    const onScroll = throttle(() => {
      setScrolled(window.scrollY > 48);
      for (const item of navItems) {
        const el = document.getElementById(item.id);
        if (!el) continue;
        const { top, bottom } = el.getBoundingClientRect();
        if (top <= 100 && bottom >= 100) { setActive(item.id); break; }
      }
    }, 16);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* ── close on resize to desktop ── */
  useEffect(() => {
    const onResize = () => { if (window.innerWidth >= 768) setMenuOpen(false); };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  /* ── lock background scroll while mobile menu is open ── */
  useEffect(() => {
    if (!menuOpen) return;

    const scrollY = window.scrollY;
    const originalHtmlOverflow = document.documentElement.style.overflow;
    const originalBodyOverflow = document.body.style.overflow;
    const originalBodyPosition = document.body.style.position;
    const originalBodyTop = document.body.style.top;
    const originalBodyWidth = document.body.style.width;

    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";
    document.body.style.position = "fixed";
    document.body.style.top = `-${scrollY}px`;
    document.body.style.width = "100%";

    return () => {
      document.documentElement.style.overflow = originalHtmlOverflow;
      document.body.style.overflow = originalBodyOverflow;
      document.body.style.position = originalBodyPosition;
      document.body.style.top = originalBodyTop;
      document.body.style.width = originalBodyWidth;
      window.scrollTo(0, scrollY);
    };
  }, [menuOpen]);

  useEffect(() => {
    if (menuOpen || !pendingScrollId) return;

    // Wait for menu close + body scroll unlock cleanup before scrolling.
    const timer = window.setTimeout(() => {
      document.getElementById(pendingScrollId)?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
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
      {/* ═══════════════════════════ HEADER ═══════════════════════════ */}
      <motion.header
        ref={headerRef}
        initial={{ y: -72, opacity: 0 }}
        animate={{ y: 0,   opacity: 1 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="sticky inset-x-0 top-0 z-50"
      >
        {/*
         * Outer shell:
         *   • not scrolled → full-width, flush with page edges, side borders to
         *     match the SectionBorder column frame running down the page
         *   • scrolled     → inset, adds top/bottom gap so the pill "floats"
         */}
        <div
          className={cn(
            "max-w-6xl mx-auto transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]",
            scrolled ? "px-4 sm:px-6 pt-3 pb-2" : "px-6 sm:px-10 pt-0 pb-0"
          )}
        >
          {/*
           * Inner bar — morphs between flat background bar and floating pill.
           * border-radius is in inline style so CSS can interpolate it smoothly.
           */}
          <div
            style={{
              borderRadius:  scrolled ? "1rem" : "0",
              paddingLeft:   scrolled ? "12px" : "0",
              paddingRight:  scrolled ? "12px" : "0",
              transition:    "border-radius 500ms cubic-bezier(0.22,1,0.36,1), padding 500ms cubic-bezier(0.22,1,0.36,1), background-color 500ms cubic-bezier(0.22,1,0.36,1), box-shadow 500ms cubic-bezier(0.22,1,0.36,1), border-color 500ms cubic-bezier(0.22,1,0.36,1)",
            }}
            className={cn(
              "relative flex items-center justify-between gap-2 py-2.5",
              "border overflow-hidden",
              scrolled
                ? "border-rose-200 dark:border-rose-900/40 bg-[#FFF1F2]/95 dark:bg-[#0d0307]/95 backdrop-blur-xl shadow-[0_4px_20px_rgba(0,0,0,0.07)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.55)]"
                : "border-transparent bg-transparent backdrop-blur-none shadow-none"
            )}
          >
            {/* ── Logo ── */}
            <button
              onClick={() => scrollTo("home")}
              aria-label="Go to top"
              className="relative z-10 h-8 w-8 shrink-0 rounded-lg overflow-hidden
                         ring-1 ring-zinc-200 dark:ring-zinc-800
                         hover:ring-rose-400 dark:hover:ring-rose-500
                         transition-all duration-200"
            >
              <Image src="/ys_red.webp" alt="YS" fill className="object-cover" quality={85} />
            </button>

            {/* ── Desktop nav — absolutely centered ── */}
            <nav className="hidden md:flex items-center gap-0.5 absolute left-1/2 -translate-x-1/2 z-10">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollTo(item.id)}
                  className={cn(
                    "relative px-3.5 py-1.5 text-sm rounded-xl transition-colors duration-150",
                    active === item.id
                      ? "text-zinc-900 dark:text-white font-medium"
                      : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200"
                  )}
                >
                  {item.label}

                  {/* Spring-animated dot that slides between active items */}
                  {active === item.id && (
                    <motion.span
                      layoutId="nav-dot"
                      className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-rose-500"
                      transition={{ type: "spring", stiffness: 500, damping: 35 }}
                    />
                  )}
                </button>
              ))}
            </nav>

            {/* ── Right actions ── */}
            <div className="relative z-10 flex items-center gap-1">
              {/* Theme toggle — all sizes */}
              <ThemeToggle
                className="w-8 h-8 flex items-center justify-center rounded-xl
                           text-zinc-500 dark:text-zinc-400
                           hover:text-zinc-900 dark:hover:text-white
                           hover:bg-zinc-100/80 dark:hover:bg-zinc-800/80
                           transition-all duration-150"
              />

              {/* Desktop-only: resume + CTA */}
              <a
                href="/YashvanthS_Resume.pdf"
                download
                className="hidden md:flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-xl
                           text-zinc-500 dark:text-zinc-400
                           hover:text-zinc-900 dark:hover:text-white
                           hover:bg-zinc-100/80 dark:hover:bg-zinc-800/80
                           transition-all duration-150"
              >
                <Download className="w-3.5 h-3.5" />
                resume
              </a>

              <button
                onClick={() => scrollTo("contact")}
                className="hidden md:block px-3.5 py-1.5 text-sm rounded-xl font-medium
                           bg-[#1a0509] dark:bg-white text-white dark:text-zinc-900
                           hover:bg-zinc-700 dark:hover:bg-zinc-100
                           transition-colors duration-150"
              >
                let&apos;s talk
              </button>

              {/* Mobile-only: hamburger with rotating icon */}
              <button
                onClick={() => setMenuOpen((p) => !p)}
                aria-label="Toggle menu"
                aria-expanded={menuOpen}
                className="md:hidden w-8 h-8 flex items-center justify-center rounded-xl
                           text-zinc-500 dark:text-zinc-400
                           hover:text-zinc-900 dark:hover:text-white
                           hover:bg-zinc-100/80 dark:hover:bg-zinc-800/80
                           transition-all duration-150"
              >
                <AnimatePresence mode="wait" initial={false}>
                  {menuOpen ? (
                    <motion.span key="x" className="flex"
                      initial={{ opacity: 0, rotate: -90 }}
                      animate={{ opacity: 1, rotate:   0 }}
                      exit={{   opacity: 0, rotate:  90 }}
                      transition={{ duration: 0.15 }}
                    >
                      <X className="w-4 h-4" />
                    </motion.span>
                  ) : (
                    <motion.span key="menu" className="flex"
                      initial={{ opacity: 0, rotate:  90 }}
                      animate={{ opacity: 1, rotate:   0 }}
                      exit={{   opacity: 0, rotate: -90 }}
                      transition={{ duration: 0.15 }}
                    >
                      <Menu className="w-4 h-4" />
                    </motion.span>
                  )}
                </AnimatePresence>
              </button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* ═══════════════════════════ MOBILE MENU ═══════════════════════ */}
      <AnimatePresence>
        {menuOpen && (
          <>
            {/* Full-screen mobile menu — sits below navbar */}
            <motion.nav
              key="panel"
              initial={{ x: "-100%" }}
              animate={{ x: "0%"    }}
              exit={{    x: "-100%" }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="fixed inset-0 z-[60] md:hidden flex h-dvh w-screen flex-col overflow-hidden overscroll-none
                         bg-[#FFF1F2] dark:bg-[#0d0307]"
            >
              <div className="flex items-center justify-end px-6 pt-[max(env(safe-area-inset-top),1rem)] pb-2">
                <button
                  onClick={() => setMenuOpen(false)}
                  aria-label="Close menu"
                  className="w-9 h-9 flex items-center justify-center rounded-xl
                             text-zinc-500 dark:text-zinc-400
                             hover:text-zinc-900 dark:hover:text-white
                             hover:bg-zinc-100/80 dark:hover:bg-zinc-800/80
                             transition-all duration-150"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Nav links — centered vertically */}
              <ul className="flex-1 flex flex-col justify-center px-8 gap-1 overflow-hidden">
                {navItems.map((item, i) => (
                  <motion.li
                    key={item.id}
                    initial={{ opacity: 0, x: -32 }}
                    animate={{ opacity: 1, x:  0  }}
                    transition={{ delay: i * 0.07, duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <button
                      onClick={() => scrollTo(item.id)}
                      className={cn(
                        "w-full flex items-center gap-4 px-4 py-3 rounded-2xl text-left relative",
                        "transition-colors duration-150",
                        active === item.id
                          ? "text-zinc-900 dark:text-white"
                          : "text-zinc-400 dark:text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
                      )}
                    >
                      {active === item.id && (
                        <motion.span
                          layoutId="menu-accent"
                          className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-7 rounded-full bg-rose-500"
                          transition={{ type: "spring", stiffness: 500, damping: 35 }}
                        />
                      )}
                      <item.icon
                        className={cn(
                          "w-5 h-5 shrink-0 transition-colors",
                          active === item.id ? "text-rose-500" : "text-zinc-400 dark:text-zinc-500"
                        )}
                      />
                      <span className="text-2xl font-medium tracking-tight">{item.label}</span>
                    </button>
                  </motion.li>
                ))}
              </ul>

              {/* CTA row — pinned to bottom */}
              <div className="px-6 pb-8 grid grid-cols-2 gap-3
                              border-t border-rose-200/60 dark:border-rose-900/30 pt-4">
                <button
                  onClick={() => scrollTo("contact")}
                  className="py-3 rounded-2xl text-sm font-medium
                             bg-[#1a0509] dark:bg-white text-white dark:text-zinc-900
                             hover:bg-zinc-700 dark:hover:bg-zinc-100
                             transition-colors duration-150"
                >
                  let&apos;s talk
                </button>
                <a
                  href="/YashvanthS_Resume.pdf"
                  download
                  className="py-3 rounded-2xl text-sm
                             border border-rose-200 dark:border-rose-900/40
                             text-zinc-600 dark:text-zinc-300
                             flex items-center justify-center gap-2
                             hover:bg-zinc-50 dark:hover:bg-zinc-900
                             transition-colors duration-150"
                >
                  <Download className="w-3.5 h-3.5" />
                  resume
                </a>
              </div>
            </motion.nav>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
