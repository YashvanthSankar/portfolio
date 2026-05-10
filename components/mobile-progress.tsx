"use client";

import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";
import { throttle } from "@/lib/utils";

const sections = [
  { id: "home", label: "Home" },
  { id: "now", label: "Now" },
  { id: "technologies", label: "Stack" },
  { id: "about", label: "About" },
  { id: "projects", label: "Work" },
  { id: "experience", label: "Journey" },
  { id: "contact", label: "Contact" },
];

/**
 * Mobile-only floating cluster (bottom-right). Shows the user's
 * progress through the page as a vertical dot stack with the active
 * section labelled, plus a scroll-to-top FAB. Mirrors the spirit of
 * the desktop scroll-spy but optimized for thumb reach.
 *
 * Hidden on lg+ where SectionIndex takes over.
 */
export function MobileProgress() {
  const [active, setActive] = useState("home");
  const [hidden, setHidden] = useState(true);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = throttle(() => {
      setHidden(window.scrollY < 320);

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
    }, 100);

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
    setOpen(false);
  };

  const activeIdx = sections.findIndex((s) => s.id === active);
  const activeLabel = sections[activeIdx]?.label ?? "";

  return (
    <div
      className={`lg:hidden fixed right-4 bottom-[max(env(safe-area-inset-bottom),1rem)] z-[55] flex flex-col items-end gap-2 transition-[opacity,transform] duration-400 ease-[cubic-bezier(0.32,0.72,0,1)] ${
        hidden ? "opacity-0 translate-y-4 pointer-events-none" : "opacity-100 translate-y-0"
      }`}
    >
      {/* Expanded section list — appears when bubble tapped */}
      {open && (
        <div
          className="flex flex-col gap-1 p-3 border-[2.5px] border-[var(--ink)] bg-[var(--surface)] shadow-[5px_5px_0_0_var(--ink)] animate-[reveal-up_280ms_var(--ease-spring)_forwards]"
          style={{ opacity: 0 }}
        >
          {sections.map((s, i) => {
            const isActive = active === s.id;
            return (
              <button
                key={s.id}
                onClick={() => scrollTo(s.id)}
                aria-current={isActive ? "true" : undefined}
                className={`group flex items-center gap-3 px-3 py-2 text-right border-2 transition-[background-color,border-color,transform] duration-200 ease-[cubic-bezier(0.32,0.72,0,1)] ${
                  isActive
                    ? "border-[var(--ink)] bg-[var(--ink)] text-[var(--paper)]"
                    : "border-transparent text-[var(--ink)] active:bg-[var(--surface-alt)] active:border-[var(--ink)]"
                }`}
              >
                <span className="font-mono text-[9px] font-bold tabular-nums tracking-[0.18em] opacity-60">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="font-display font-semibold text-sm">{s.label}</span>
              </button>
            );
          })}
        </div>
      )}

      {/* Cluster — progress bubble + scroll-top */}
      <div className="flex items-center gap-2">
        {/* Scroll to top */}
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          aria-label="Scroll to top"
          className="inline-flex items-center justify-center w-11 h-11 border-[2.5px] border-[var(--ink)] bg-[var(--surface)] text-[var(--ink)] shadow-[3px_3px_0_0_var(--ink)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[1px_1px_0_0_var(--ink)] transition-transform duration-150"
        >
          <ArrowUp className="w-4 h-4" />
        </button>

        {/* Progress bubble — tap to toggle list */}
        <button
          onClick={() => setOpen((p) => !p)}
          aria-label={open ? "Close section list" : `Currently on ${activeLabel}. Open section list.`}
          aria-expanded={open}
          className={`group inline-flex items-center gap-2 h-11 pl-2 pr-3 border-[2.5px] border-[var(--ink)] shadow-[3px_3px_0_0_var(--ink)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[1px_1px_0_0_var(--ink)] transition-[transform,background-color] duration-150 ${
            open ? "bg-[var(--ink)] text-[var(--paper)]" : "bg-[var(--surface)] text-[var(--ink)]"
          }`}
        >
          {/* Vertical dot stack — visual progress */}
          <span
            aria-hidden="true"
            className="flex flex-col gap-[2px] py-1.5"
          >
            {sections.map((_, i) => (
              <span
                key={i}
                className={`block w-1 h-1 rounded-full transition-colors duration-200 ${
                  i === activeIdx
                    ? "bg-current"
                    : i < activeIdx
                    ? "bg-current opacity-60"
                    : "bg-current opacity-20"
                }`}
              />
            ))}
          </span>
          <span className="font-mono text-[10px] font-bold tracking-[0.18em] uppercase tabular-nums">
            {String(activeIdx + 1).padStart(2, "0")}
            <span className="opacity-50">/{String(sections.length).padStart(2, "0")}</span>
          </span>
        </button>
      </div>
    </div>
  );
}
