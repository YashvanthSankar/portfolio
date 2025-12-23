"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import {
  Home,
  Folder,
  User,
  Briefcase,
  Mail,
  Download,
  Menu,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { id: "home", label: "Home", icon: Home },
  { id: "projects", label: "Work", icon: Folder },
  { id: "about", label: "About", icon: User },
  { id: "experience", label: "Experience", icon: Briefcase },
  { id: "contact", label: "Contact", icon: Mail },
];

export function Navbar() {
  const [active, setActive] = useState("home");
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 20);
      for (const item of navItems) {
        const el = document.getElementById(item.id);
        if (!el) continue;
        const rect = el.getBoundingClientRect();
        if (rect.top <= 120 && rect.bottom >= 120) {
          setActive(item.id);
          break;
        }
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollTo = (id: string) => {
    setMenuOpen(false);
    document.getElementById(id)?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  return (
    <>
      {/* ================= HEADER ================= */}
      <header className="fixed inset-x-0 top-0 z-50">
        <nav className="mx-auto max-w-screen-lg px-6 py-3">
          <div
            className={cn(
              "flex items-center justify-between rounded-full transition-all duration-300",
              scrolled
                ? "bg-black/30 backdrop-blur-md border border-white/10 px-6 py-3 shadow-lg"
                : "px-3 py-2"
            )}
          >
            {/* Logo */}
            <button
              onClick={() => scrollTo("home")}
              className="relative h-12 w-12 rounded-full overflow-hidden ring-1 ring-white/20 hover:ring-white/40 transition"
            >
              <Image src="/ys.png" alt="YS" fill className="object-cover" />
            </button>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-3">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollTo(item.id)}
                  className={cn(
                    "px-4 py-2 rounded-full text-sm font-medium transition-all duration-200",
                    active === item.id
                      ? "bg-white/20 text-white backdrop-blur-sm"
                      : "text-zinc-400 hover:text-white hover:bg-white/10"
                  )}
                >
                  {item.label}
                </button>
              ))}
            </div>

            {/* Desktop CTA */}
            <div className="hidden md:flex gap-3">
              <button
                onClick={() => scrollTo("contact")}
                className="px-5 py-2 rounded-full bg-white text-black font-semibold hover:scale-105 transition-transform"
              >
                Let’s Talk
              </button>
              <a
                href="/YashvanthS_Resume.pdf"
                download
                className="px-4 py-2 rounded-full border border-white/20 text-sm flex items-center gap-2 hover:bg-white/10 transition"
              >
                <Download className="w-4 h-4" />
                Resume
              </a>
            </div>

            {/* Mobile Toggle */}
            <button
              onClick={() => setMenuOpen((p) => !p)}
              className="md:hidden text-white p-2 rounded-full hover:bg-white/10 transition"
              aria-label="Toggle menu"
            >
              {menuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </nav>
      </header>

      {/* ================= MOBILE MENU ================= */}
      <AnimatePresence>
        {menuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMenuOpen(false)}
              className="fixed inset-0 z-20 bg-black/60 backdrop-blur-sm"
            />

            {/* Bottom Sheet */}
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", stiffness: 260, damping: 28 }}
              drag="y"
              dragConstraints={{ top: 0 }}
              dragElastic={0.2}
              onDragEnd={(_, info) => {
                if (info.offset.y > 120) setMenuOpen(false);
              }}
              className="fixed inset-x-0 bottom-0 z-30"
            >
              <div className="relative h-[75svh] mt-16 rounded-t-3xl overflow-hidden">
                {/* GLASS PANEL */}
                <div className="absolute inset-0 bg-white/5 backdrop-blur-3xl border-t border-white/20 shadow-inner" />

                {/* CONTENT */}
                <div className="relative z-10 p-6 pt-10 text-white flex flex-col h-full">
                  {/* Drag Handle */}
                  <div className="mx-auto mb-6 h-1.5 w-14 rounded-full bg-white/30" />

                  {/* Menu Items */}
                  <div className="space-y-4 flex-1 overflow-y-auto">
                    {navItems.map((item) => (
                      <button
                        key={item.id}
                        onClick={() => scrollTo(item.id)}
                        className="w-full flex items-center gap-4 px-6 py-4 rounded-2xl text-white text-left hover:text-zinc-300 transition-colors"
                      >
                        <item.icon className="w-6 h-6 text-zinc-400" />
                        <span className="text-lg font-medium">{item.label}</span>
                      </button>
                    ))}
                  </div>

                  {/* CTAs */}
                  <div className="mt-4 space-y-4">
                    ...
                  </div>
                </div>
              </div>
            </motion.div>

          </>
        )}
      </AnimatePresence>
    </>
  );
}
