"use client";

import { useEffect, useState } from "react";
import { throttle } from "@/lib/utils";
import { useScrollTo } from "@/components/providers/smooth-scroll";

const sections = [
  { id: "home", label: "intro" },
  { id: "projects", label: "work" },
  { id: "about", label: "about" },
  { id: "experience", label: "experience" },
  { id: "now", label: "now" },
  { id: "technologies", label: "stack" },
  { id: "contact", label: "contact" },
];

/**
 * Fixed right-edge scroll-spy. Minimal ticks by default; labels slide in
 * on hover. Hidden until the hero starts scrolling away.
 */
export function SectionIndex() {
  const [active, setActive] = useState("home");
  const [hidden, setHidden] = useState(true);
  const scrollTo = useScrollTo();

  useEffect(() => {
    const onScroll = throttle(() => {
      setHidden(window.scrollY < 260);

      const probe = window.innerHeight * 0.33;
      let bestId = sections[0].id;
      let bestDelta = Number.POSITIVE_INFINITY;
      for (const s of sections) {
        const el = document.getElementById(s.id);
        if (!el) continue;
        const rect = el.getBoundingClientRect();
        if (rect.top <= probe && rect.bottom > probe) {
          bestId = s.id;
          break;
        }
        const d = Math.abs(rect.top - probe);
        if (d < bestDelta) {
          bestDelta = d;
          bestId = s.id;
        }
      }
      setActive(bestId);
    }, 90);

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      aria-label="Section navigation"
      className={`group/idx fixed right-6 top-1/2 z-40 hidden -translate-y-1/2 flex-col items-end gap-2.5 transition-opacity duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] lg:flex ${
        hidden ? "pointer-events-none opacity-0" : "opacity-100"
      }`}
    >
      {sections.map((s, i) => {
        const isActive = active === s.id;
        return (
          <button
            key={s.id}
            onClick={() => scrollTo(`#${s.id}`)}
            aria-current={isActive ? "true" : undefined}
            aria-label={`Jump to ${s.label}`}
            className="group/item flex items-center gap-3"
          >
            <span
              className={`meta -translate-x-2 opacity-0 transition-[opacity,transform,color] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover/idx:translate-x-0 group-hover/idx:opacity-100 ${
                isActive ? "text-[var(--accent)]" : "text-[var(--text-3)]"
              }`}
            >
              {String(i + 1).padStart(2, "0")} · {s.label}
            </span>
            <span
              aria-hidden="true"
              className={`block h-px transition-[width,background-color] duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                isActive
                  ? "w-7 bg-[var(--accent)]"
                  : "w-3.5 bg-[var(--line-2)] group-hover/item:w-5 group-hover/item:bg-[var(--text-2)]"
              }`}
            />
          </button>
        );
      })}
    </nav>
  );
}
