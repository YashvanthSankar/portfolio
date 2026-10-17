"use client";

import { sections, chapterNumber } from "@/data/sections";
import { useActiveSection } from "@/lib/use-active-section";
import { useScrollTo } from "@/components/providers/smooth-scroll";

/**
 * Fixed right-edge scroll-spy. Minimal ticks by default; labels slide in
 * on hover. Hidden until the hero starts scrolling away.
 */
export function SectionIndex() {
  const { active, past } = useActiveSection({ revealAfter: 260, throttleMs: 90 });
  const scrollTo = useScrollTo();

  return (
    <nav
      aria-label="Section navigation"
      className={`group/idx fixed right-6 top-1/2 z-40 hidden -translate-y-1/2 flex-col items-end gap-2.5 transition-opacity duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] lg:flex ${
        past ? "opacity-100" : "pointer-events-none opacity-0"
      }`}
    >
      {sections.map((s) => {
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
              aria-hidden="true"
              className={`meta -translate-x-2 opacity-0 transition-[opacity,transform,color] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover/idx:translate-x-0 group-hover/idx:opacity-100 ${
                isActive ? "text-[var(--accent)]" : "text-[var(--text-3)]"
              }`}
            >
              {chapterNumber(s.id)} · {s.label}
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
