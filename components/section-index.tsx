"use client";

import { useEffect, useState } from "react";
import { throttle } from "@/lib/utils";

interface SectionEntry {
  id: string;
  label: string;
}

const sections: SectionEntry[] = [
  { id: "home", label: "hero" },
  { id: "now", label: "now" },
  { id: "technologies", label: "stack" },
  { id: "about", label: "about" },
  { id: "projects", label: "work" },
  { id: "experience", label: "journey" },
  { id: "contact", label: "contact" },
];

/**
 * Fixed right-edge scroll-spy index. Earns its place by being:
 *   1. Live — tracks the section currently in view
 *   2. Clickable — each item smooth-scrolls to its section
 *   3. Expands on hover — labels reveal, otherwise minimal ticks
 *   4. Hidden on small screens, hidden once scrolled past contact
 */
export function SectionIndex() {
  const [active, setActive] = useState("home");
  const [hidden, setHidden] = useState(true);

  useEffect(() => {
    const onScroll = throttle(() => {
      // Show after the hero starts scrolling out
      setHidden(window.scrollY < 240);

      // Find which section's top is closest to the 1/3 viewport line
      const probe = window.innerHeight * 0.33;
      let bestId = sections[0].id;
      let bestDelta = Number.POSITIVE_INFINITY;
      for (const s of sections) {
        const el = document.getElementById(s.id);
        if (!el) continue;
        const rect = el.getBoundingClientRect();
        // Section is "active" if its top has passed the probe line and
        // its bottom hasn't yet
        if (rect.top <= probe && rect.bottom > probe) {
          bestId = s.id;
          bestDelta = 0;
          break;
        }
        const d = Math.abs(rect.top - probe);
        if (d < bestDelta) {
          bestDelta = d;
          bestId = s.id;
        }
      }
      setActive(bestId);
    }, 80);

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <nav
      aria-label="Section navigation"
      className={`group/idx hidden lg:flex fixed top-1/2 right-6 -translate-y-1/2 z-40 flex-col items-end gap-1 transition-opacity duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] ${
        hidden ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
    >
      <span className="mb-2 font-mono text-[9px] font-bold tracking-[0.32em] uppercase text-[var(--muted)] opacity-0 group-hover/idx:opacity-100 transition-opacity duration-200">
        index
      </span>
      {sections.map((s, i) => {
        const isActive = active === s.id;
        return (
          <button
            key={s.id}
            onClick={() => scrollTo(s.id)}
            aria-current={isActive ? "true" : undefined}
            aria-label={`Jump to ${s.label}`}
            className="group/item relative flex items-center gap-3 cursor-pointer"
          >
            {/* Number + label — slide-in from right on hover */}
            <span
              className={`font-mono text-[10px] font-bold tracking-[0.18em] uppercase transition-[opacity,transform,color] duration-200 ease-[cubic-bezier(0.32,0.72,0,1)] opacity-0 -translate-x-2 group-hover/idx:opacity-100 group-hover/idx:translate-x-0 ${
                isActive ? "text-[var(--ink)]" : "text-[var(--muted)]"
              }`}
            >
              <span className="tabular-nums opacity-60">
                {String(i + 1).padStart(3, "0")}
              </span>
              <span className="ml-2">·</span>
              <span className="ml-2">{s.label}</span>
            </span>

            {/* Tick mark — always visible, expands when active */}
            <span
              aria-hidden="true"
              className={`block h-[2px] transition-[width,background-color] duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] ${
                isActive
                  ? "w-7 bg-[var(--ink)]"
                  : "w-3 bg-[var(--border-ink)]/50 group-hover/item:w-5 group-hover/item:bg-[var(--ink)]"
              }`}
            />
          </button>
        );
      })}
    </nav>
  );
}
