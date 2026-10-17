"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowUp } from "lucide-react";
import { sections, chapterNumber, chapterCount } from "@/data/sections";
import { useActiveSection } from "@/lib/use-active-section";
import { useScrollTo } from "@/components/providers/smooth-scroll";

/**
 * Mobile-only progress cluster (bottom-right). Mirrors the desktop
 * scroll-spy but sized for thumbs. Hidden on lg+ where SectionIndex runs.
 */
export function MobileProgress() {
  const { active, past } = useActiveSection({ revealAfter: 340, throttleMs: 110 });
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const scrollTo = useScrollTo();

  /* Dismiss on Escape or on any pointer down outside the cluster — which
     on a touch screen also covers "the reader started scrolling again". */
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    const onPointerDown = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onPointerDown);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onPointerDown);
    };
  }, [open]);

  const activeIdx = sections.findIndex((s) => s.id === active);
  const activeLabel = sections[activeIdx]?.label ?? "";

  const go = (id: string) => {
    setOpen(false);
    scrollTo(`#${id}`);
  };

  return (
    <div
      ref={rootRef}
      className={`fixed bottom-[max(env(safe-area-inset-bottom),1rem)] right-4 z-[55] flex flex-col items-end gap-2 transition-[opacity,transform] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] lg:hidden ${
        past ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-3 opacity-0"
      }`}
    >
      {open && (
        <div className="panel flex flex-col overflow-hidden">
          {sections.map((s) => {
            const isActive = active === s.id;
            return (
              <button
                key={s.id}
                onClick={() => go(s.id)}
                aria-current={isActive ? "true" : undefined}
                className={`flex items-center gap-3 px-4 py-2.5 text-left transition-colors duration-200 ${
                  isActive ? "bg-[var(--bg-2)] text-[var(--accent)]" : "text-[var(--text-2)]"
                }`}
              >
                <span className="meta tabular-nums">{chapterNumber(s.id)}</span>
                <span className="text-sm">{s.label}</span>
              </button>
            );
          })}
        </div>
      )}

      <div className="flex items-center gap-2">
        <button
          onClick={() => scrollTo(0, { updateHash: false })}
          aria-label="Scroll to top"
          className="panel inline-flex h-11 w-11 items-center justify-center text-[var(--text-2)]"
        >
          <ArrowUp className="h-4 w-4" />
        </button>

        <button
          onClick={() => setOpen((p) => !p)}
          aria-label={open ? "Close section list" : `Currently on ${activeLabel}. Open section list.`}
          aria-expanded={open}
          className={`panel inline-flex h-11 items-center gap-2.5 px-3.5 ${
            open ? "text-[var(--accent)]" : "text-[var(--text-2)]"
          }`}
        >
          <span aria-hidden="true" className="flex flex-col gap-[3px]">
            {sections.map((_, i) => (
              <span
                key={i}
                className={`block h-px w-3 transition-colors duration-200 ${
                  i === activeIdx
                    ? "bg-[var(--accent)]"
                    : i < activeIdx
                    ? "bg-[var(--text-2)]"
                    : "bg-[var(--line-2)]"
                }`}
              />
            ))}
          </span>
          <span className="meta tabular-nums">
            {chapterNumber(active)}
            <span className="text-[var(--text-3)]">
              /{String(chapterCount).padStart(2, "0")}
            </span>
          </span>
        </button>
      </div>
    </div>
  );
}
