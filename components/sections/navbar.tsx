"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Home, Folder, User, Briefcase, Mail } from "lucide-react";

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

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 20);
      
      // Update active section based on scroll
      for (const item of navItems) {
        const el = document.getElementById(item.id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 100 && rect.bottom >= 100) {
            setActive(item.id);
            break;
          }
        }
      }
    };
    
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollTo = (id: string) => {
    setActive(id);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        scrolled ? "py-3" : "py-5"
      )}
    >
      <nav className="max-w-screen-lg mx-auto px-6">
        <div className={cn(
          "flex items-center justify-between px-6 py-3 rounded-full transition-all duration-300",
          scrolled 
            ? "bg-zinc-900/80 backdrop-blur-xl border border-zinc-800/50 shadow-lg shadow-black/10" 
            : "bg-transparent"
        )}>
          {/* Logo */}
          <a 
            href="#home" 
            onClick={(e) => { e.preventDefault(); scrollTo("home"); }}
            className="text-lg font-semibold text-white"
          >
            YS<span className="text-zinc-500">.</span>
          </a>

          {/* Nav Links */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollTo(item.id)}
                className={cn(
                  "relative px-4 py-2 text-sm font-medium rounded-full transition-colors",
                  active === item.id
                    ? "text-white"
                    : "text-zinc-400 hover:text-zinc-200"
                )}
              >
                {active === item.id && (
                  <motion.div
                    layoutId="navIndicator"
                    className="absolute inset-0 bg-zinc-800 rounded-full"
                    transition={{ type: "spring", stiffness: 350, damping: 30 }}
                  />
                )}
                <span className="relative z-10">{item.label}</span>
              </button>
            ))}
          </div>

          {/* CTA */}
          <a
            href="#contact"
            onClick={(e) => { e.preventDefault(); scrollTo("contact"); }}
            className="hidden md:flex items-center gap-2 px-4 py-2 text-sm font-medium text-zinc-900 bg-white rounded-full hover:bg-zinc-100 transition-colors"
          >
            Let&apos;s Talk
          </a>

          {/* Mobile Menu Button */}
          <button className="md:hidden p-2 text-zinc-400">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </nav>
    </motion.header>
  );
}
