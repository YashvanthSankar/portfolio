"use client";

import { useEffect, useState, startTransition } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useTheme } from "next-themes";
import { throttle } from "@/lib/utils";
import { Home, Folder, User, Briefcase, Mail, Download, Menu, X, Sun, Moon } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { id: "home",       label: "home",       icon: Home },
  { id: "about",      label: "about",      icon: User },
  { id: "projects",   label: "work",       icon: Folder },
  { id: "experience", label: "experience", icon: Briefcase },
  { id: "contact",    label: "contact",    icon: Mail },
];

function Crosshair({ className }: { className: string }) {
  return (
    <span className={cn("absolute w-3 h-3 pointer-events-none z-20", className)}>
      <span className="absolute top-1/2 -translate-y-1/2 left-0 right-0 h-px bg-violet-500/70" />
      <span className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-px bg-violet-500/70" />
    </span>
  );
}

function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => { startTransition(() => setMounted(true)); }, []);
  if (!mounted) return <div className="w-9 h-9" />;
  return (
    <button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="w-9 h-9 flex items-center justify-center rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white hover:border-zinc-300 dark:hover:border-zinc-500 transition-all"
      aria-label="Toggle theme"
    >
      <AnimatePresence mode="wait" initial={false}>
        {theme === "dark" ? (
          <motion.div key="sun" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.15 }}>
            <Sun className="w-4 h-4" />
          </motion.div>
        ) : (
          <motion.div key="moon" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.15 }}>
            <Moon className="w-4 h-4" />
          </motion.div>
        )}
      </AnimatePresence>
    </button>
  );
}

export function Navbar() {
  const [active, setActive] = useState("home");
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = throttle(() => {
      setScrolled(window.scrollY > 20);
      for (const item of navItems) {
        const el = document.getElementById(item.id);
        if (!el) continue;
        const rect = el.getBoundingClientRect();
        if (rect.top <= 120 && rect.bottom >= 120) { setActive(item.id); break; }
      }
    }, 16);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollTo = (id: string) => {
    setMenuOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <>
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="sticky inset-x-0 top-0 z-50"
      >
        <div className={cn("mx-auto max-w-6xl px-4 sm:px-6 transition-all duration-300", scrolled ? "pt-2" : "pt-0")}>
          <div className="relative border-x border-zinc-200 dark:border-zinc-700 px-2 sm:px-3">
            <Crosshair className="-top-1.5 -left-1.5" />
            <Crosshair className="-top-1.5 -right-1.5" />
            <Crosshair className="-bottom-1.5 -left-1.5" />
            <Crosshair className="-bottom-1.5 -right-1.5" />

            <div className={cn(
              "relative flex items-center justify-between px-4 py-2.5 transition-all duration-300",
              scrolled
                ? "rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-md shadow-[0_8px_24px_rgba(0,0,0,0.08)] dark:shadow-[0_10px_28px_rgba(0,0,0,0.45)]"
                : "border-y border-zinc-200/85 dark:border-zinc-700/85 bg-transparent"
            )}>
            {/* Logo */}
            <button
              onClick={() => scrollTo("home")}
              className="relative h-8 w-8 rounded-lg overflow-hidden ring-1 ring-zinc-200 dark:ring-zinc-700 hover:ring-violet-400 transition-all z-10"
            >
              <Image src="/ys.png" alt="YS" fill className="object-cover" quality={85} />
            </button>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-1 z-10">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollTo(item.id)}
                  className={cn(
                    "px-3 py-1.5 rounded-lg text-sm border transition-all",
                    active === item.id
                      ? "text-zinc-900 dark:text-white bg-zinc-100 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-600"
                      : "text-zinc-500 dark:text-zinc-300 border-transparent hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100/80 dark:hover:bg-zinc-800/80 hover:border-zinc-200 dark:hover:border-zinc-600"
                  )}
                >
                  {item.label}
                </button>
              ))}
            </nav>

            {/* Right: theme + CTA + resume */}
            <div className="hidden md:flex items-center gap-2 z-10">
              <ThemeToggle />
              <a
                href="/YashvanthS_Resume.pdf"
                download
                className="flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-lg border border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white hover:border-zinc-300 dark:hover:border-zinc-500 transition-all"
              >
                <Download className="w-3.5 h-3.5" />
                resume
              </a>
              <button
                onClick={() => scrollTo("contact")}
                className="px-4 py-1.5 text-sm rounded-lg bg-violet-600 hover:bg-violet-700 text-white font-medium transition-colors"
              >
                let&apos;s talk
              </button>
            </div>

            {/* Mobile toggle */}
            <div className="md:hidden flex items-center gap-2 z-10">
              <ThemeToggle />
              <button
                onClick={() => setMenuOpen((p) => !p)}
                className="w-9 h-9 flex items-center justify-center rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white/80 dark:bg-zinc-900/80 text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white hover:border-zinc-300 dark:hover:border-zinc-500 transition-all"
                aria-label="Toggle menu"
              >
                {menuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
              </button>
            </div>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMenuOpen(false)}
              className="fixed inset-0 z-40 bg-black/25 backdrop-blur-[2px]"
            />
            <motion.div
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.22, ease: "easeOut" }}
              className="fixed top-[4.65rem] inset-x-0 z-50 px-4 sm:px-6 md:hidden"
            >
              <div className="mx-auto max-w-6xl relative overflow-hidden rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-md p-3 shadow-[0_14px_34px_rgba(0,0,0,0.12)] dark:shadow-[0_14px_34px_rgba(0,0,0,0.5)]">
                <div className="pointer-events-none absolute inset-0 opacity-25 [background-image:linear-gradient(rgba(0,0,0,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.08)_1px,transparent_1px)] [background-size:18px_18px] dark:[background-image:linear-gradient(rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.06)_1px,transparent_1px)]" />

                <div className="relative space-y-1 mb-3">
                  {navItems.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => scrollTo(item.id)}
                      className={cn(
                        "w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-left border transition-all",
                        active === item.id
                          ? "bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white border-zinc-200 dark:border-zinc-600"
                          : "text-zinc-600 dark:text-zinc-300 border-transparent hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:border-zinc-200 dark:hover:border-zinc-600"
                      )}
                    >
                      <item.icon className="w-4 h-4 shrink-0" />
                      <span className="text-sm">{item.label}</span>
                    </button>
                  ))}
                </div>

                <div className="relative grid grid-cols-2 gap-2 pt-2 border-t border-zinc-200/80 dark:border-zinc-700/80">
                  <button
                    onClick={() => scrollTo("contact")}
                    className="w-full py-2.5 rounded-lg bg-violet-600 hover:bg-violet-700 text-white text-sm font-medium transition-colors"
                  >
                    let&apos;s talk
                  </button>
                  <a
                    href="/YashvanthS_Resume.pdf"
                    download
                    className="w-full py-2.5 rounded-lg border border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-300 text-sm flex items-center justify-center gap-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all"
                  >
                    <Download className="w-4 h-4" />
                    resume
                  </a>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
