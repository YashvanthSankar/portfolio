"use client";

import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";
import { throttle } from "@/lib/utils";
import { useScrollTo } from "@/components/providers/smooth-scroll";

const sections = [
  { id: "home", label: "Intro" },
  { id: "projects", label: "Work" },
  { id: "about", label: "About" },
  { id: "experience", label: "Experience" },
  { id: "now", label: "Now" },
  { id: "technologies", label: "Stack" },
  { id: "contact", label: "Contact" },
];

/**
 * Mobile-only progress cluster (bottom-right). Mirrors the desktop
 * scroll-spy but sized for thumbs. Hidden on lg+ where SectionIndex runs.
 */
export function MobileProgress() {
  const [active, setActive] = useState("home");
  const [hidden, setHidden] = useState(true);
  const [open, setOpen] = useState(false);
  const scrollTo = useScrollTo();

  useEffect(() => {
    const onScroll = throttle(() => {
      setHidden(window.scrollY < 340);

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
    }, 110);

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const activeIdx = sections.findIndex((s) => s.id === active);
  const activeLabel = sections[activeIdx]?.label ?? "";

  const go = (id: string) => {
    setOpen(false);
    scrollTo(`#${id}`);
  };

  return (
    <div
      className={`fixed bottom-[max(env(safe-area-inset-bottom),1rem)] right-4 z-[55] flex flex-col items-end gap-2 transition-[opacity,transform] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] lg:hidden ${
        hidden ? "pointer-events-none translate-y-3 opacity-0" : "translate-y-0 opacity-100"
      }`}
    >
      {open && (
        <div className="panel flex flex-col overflow-hidden">
          {sections.map((s, i) => {
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
                <span className="meta tabular-nums">
                  {String(i + 1).padStart(2, "0")}
                </span>
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
            {String(activeIdx + 1).padStart(2, "0")}
            <span className="text-[var(--text-3)]">
              /{String(sections.length).padStart(2, "0")}
            </span>
          </span>
        </button>
      </div>
    </div>
  );
}
