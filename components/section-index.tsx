"use client";

import { useEffect, useState } from "react";
import { throttle } from "@/lib/utils";

interface SectionEntry {
  id: string;
  label: string;
}

const sections: SectionEntry[] = [
  { id: "home", label: "Home" },
  { id: "now", label: "Now" },
  { id: "technologies", label: "Stack" },
  { id: "about", label: "About" },
  { id: "projects", label: "Work" },
  { id: "experience", label: "Journey" },
  { id: "contact", label: "Contact" },
];

/**
 * Fixed right-edge scroll-spy index. Minimal ticks that expand into
 * labels on hover; the active section's tick is longer and ink-toned.
 * Hidden on small screens and while the hero is still in view.
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
      className={`group/idx fixed right-6 top-1/2 z-40 hidden -translate-y-1/2 flex-col items-end gap-2 transition-opacity duration-500 lg:flex ${
        hidden ? "pointer-events-none opacity-0" : "opacity-100"
      }`}
    >
      {sections.map((s) => {
        const isActive = active === s.id;
        return (
          <button
            key={s.id}
            onClick={() => scrollTo(s.id)}
            aria-current={isActive ? "true" : undefined}
            aria-label={`Jump to ${s.label}`}
            className="group/item flex cursor-pointer items-center gap-3 py-0.5"
          >
            {/* Label — fades in when the index is hovered */}
            <span
              className={`text-[11px] font-medium transition-[opacity,transform,color] duration-200 ease-[cubic-bezier(0.32,0.72,0,1)] ${
                isActive ? "text-ink" : "text-faint group-hover/item:text-muted"
              } -translate-x-1 opacity-0 group-hover/idx:translate-x-0 group-hover/idx:opacity-100`}
            >
              {s.label}
            </span>

            {/* Tick */}
            <span
              aria-hidden="true"
              className={`block h-px transition-[width,background-color] duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] ${
                isActive
                  ? "w-6 bg-ink"
                  : "w-3 bg-line-strong group-hover/item:w-5 group-hover/item:bg-muted"
              }`}
            />
          </button>
        );
      })}
    </nav>
  );
}
