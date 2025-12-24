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
  ArrowRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

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
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 100, damping: 20 }}
        className="fixed inset-x-0 top-0 z-50"
      >
        <nav className="mx-auto max-w-screen-lg px-6 py-4">
          <motion.div
            animate={{
              backgroundColor: scrolled ? "rgba(0, 0, 0, 0.4)" : "rgba(0, 0, 0, 0)",
              backdropFilter: scrolled ? "blur(20px)" : "blur(0px)",
            }}
            transition={{ duration: 0.3 }}
            className={cn(
              "flex items-center justify-between rounded-full transition-all duration-300",
              scrolled
                ? "border border-white/10 px-6 py-3 shadow-2xl shadow-black/50"
                : "px-3 py-2"
            )}
          >
            {/* Logo with hover effect */}
            <motion.button
              whileHover={{ scale: 1.1, rotate: 5 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => scrollTo("home")}
              className="relative h-12 w-12 rounded-full overflow-hidden ring-2 ring-white/20 hover:ring-white/50 transition-all"
            >
              <Image src="/ys.png" alt="YS" fill className="object-cover" />
              <div className="absolute inset-0 bg-gradient-to-br from-white/0 to-white/10" />
            </motion.button>

            {/* Desktop Nav with enhanced styling */}
            <div className="hidden md:flex items-center gap-2 relative">
              {navItems.map((item) => (
                <motion.button
                  key={item.id}
                  onClick={() => scrollTo(item.id)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={cn(
                    "relative px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 overflow-hidden",
                    active === item.id
                      ? "text-white"
                      : "text-zinc-400 hover:text-white"
                  )}
                >
                  {active === item.id && (
                    <motion.div
                      layoutId="navbar-active"
                      className="absolute inset-0 bg-gradient-to-r from-white/20 to-white/10 backdrop-blur-sm"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10">{item.label}</span>
                </motion.button>
              ))}
            </div>

            {/* Desktop CTA with enhanced effects */}
            <div className="hidden md:flex gap-3">
              <motion.button
                whileHover={{ scale: 1.05, boxShadow: "0 0 20px rgba(255,255,255,0.3)" }}
                whileTap={{ scale: 0.95 }}
                onClick={() => scrollTo("contact")}
                className="relative px-5 py-2 rounded-full bg-white text-black font-semibold overflow-hidden group"
              >
                <span className="relative z-10 flex items-center gap-2">
                  Let&apos;s Talk
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-zinc-100 to-white opacity-0 group-hover:opacity-100 transition-opacity" />
              </motion.button>
              
              <motion.a
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                href="/YashvanthS_Resume.pdf"
                download
                className="px-4 py-2 rounded-full border border-white/20 text-sm flex items-center gap-2 hover:bg-white/10 hover:border-white/30 transition-all backdrop-blur-sm"
              >
                <Download className="w-4 h-4" />
                Resume
              </motion.a>
            </div>

            {/* Mobile Toggle with animation */}
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => setMenuOpen((p) => !p)}
              className="md:hidden text-white p-2 rounded-full hover:bg-white/10 transition"
              aria-label="Toggle menu"
            >
              <AnimatePresence mode="wait">
                {menuOpen ? (
                  <motion.div
                    key="close"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <X />
                  </motion.div>
                ) : (
                  <motion.div
                    key="menu"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Menu />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          </motion.div>
        </nav>
      </motion.header>

      {/* ================= MOBILE MENU ================= */}
      <AnimatePresence>
        {menuOpen && (
          <>
            {/* Enhanced Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMenuOpen(false)}
              className="fixed inset-0 z-40 bg-black/70 backdrop-blur-md"
            />

            {/* Enhanced Bottom Sheet */}
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              drag="y"
              dragConstraints={{ top: 0 }}
              dragElastic={0.2}
              onDragEnd={(_, info) => {
                if (info.offset.y > 120) setMenuOpen(false);
              }}
              className="fixed inset-x-0 bottom-0 z-50"
            >
              <div className="relative h-[75svh] mt-16 rounded-t-3xl overflow-hidden">
                {/* Enhanced Glass Panel with gradient */}
                <div className="absolute inset-0 bg-gradient-to-b from-zinc-900/95 to-black/95 backdrop-blur-3xl border-t border-white/20 shadow-2xl" />
                
                {/* Subtle glow effect */}
                <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/50 to-transparent" />

                {/* CONTENT */}
                <div className="relative z-10 p-6 pt-8 text-white flex flex-col h-full">
                  {/* Enhanced Drag Handle */}
                  <div className="mx-auto mb-8 h-1.5 w-16 rounded-full bg-white/40 shadow-lg shadow-white/20" />

                  {/* Enhanced Menu Items */}
                  <div className="space-y-2 flex-1 overflow-y-auto">
                    {navItems.map((item, index) => (
                      <motion.button
                        key={item.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        onClick={() => scrollTo(item.id)}
                        className={cn(
                          "w-full flex items-center gap-4 px-6 py-4 rounded-2xl text-left transition-all group",
                          active === item.id
                            ? "bg-white/10 text-white"
                            : "hover:bg-white/5 text-zinc-300"
                        )}
                      >
                        <div className={cn(
                          "p-2 rounded-xl transition-all",
                          active === item.id
                            ? "bg-white/20 text-white"
                            : "bg-white/5 text-zinc-400 group-hover:bg-white/10 group-hover:text-white"
                        )}>
                          <item.icon className="w-5 h-5" />
                        </div>
                        <span className="text-lg font-medium">{item.label}</span>
                        <ArrowRight className={cn(
                          "w-5 h-5 ml-auto opacity-0 -translate-x-2 transition-all",
                          "group-hover:opacity-100 group-hover:translate-x-0"
                        )} />
                      </motion.button>
                    ))}
                  </div>

                  {/* Enhanced CTAs */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="mt-6 space-y-3 pt-6 border-t border-white/10"
                  >
                    <button
                      onClick={() => scrollTo("contact")}
                      className="w-full px-6 py-4 rounded-2xl bg-white text-black font-semibold flex items-center justify-center gap-2 hover:bg-zinc-100 transition-all shadow-lg shadow-white/20"
                    >
                      Let&apos;s Talk
                      <ArrowRight className="w-5 h-5" />
                    </button>
                    
                    <a
                      href="/YashvanthS_Resume.pdf"
                      download
                      className="w-full px-6 py-4 rounded-2xl border border-white/20 flex items-center justify-center gap-2 hover:bg-white/5 transition-all backdrop-blur-sm"
                    >
                      <Download className="w-5 h-5" />
                      Download Resume
                    </a>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}