"use client";

import { useEffect, useRef, useState } from "react";
import { useScrollTo } from "@/components/providers/smooth-scroll";

/**
 * Single-letter jumps, no modifier — a power-user palette for the page.
 * Ignores typing inside inputs. First tap surfaces the hint panel once.
 *
 *   W → work · A → about · E → experience · N → now
 *   S → stack · C → contact · H → home · ? → toggle hint
 */
const map: Record<string, string> = {
  h: "home",
  w: "projects",
  a: "about",
  e: "experience",
  n: "now",
  s: "technologies",
  c: "contact",
};

const hints: Array<[string, string]> = [
  ["H", "Home"],
  ["W", "Work"],
  ["A", "About"],
  ["E", "Experience"],
  ["N", "Now"],
  ["S", "Stack"],
  ["C", "Contact"],
  ["?", "Toggle this"],
];

export function KbdShortcuts() {
  const [hintOpen, setHintOpen] = useState(false);
  const [pulse, setPulse] = useState<string | null>(null);
  const seen = useRef(false);
  const scrollTo = useScrollTo();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      const target = e.target as HTMLElement | null;
      if (target) {
        const tag = target.tagName;
        if (tag === "INPUT" || tag === "TEXTAREA" || target.isContentEditable) return;
      }
      const k = e.key.toLowerCase();

      if (k === "?") {
        e.preventDefault();
        setHintOpen((p) => !p);
        seen.current = true;
        return;
      }
      if (k === "escape") {
        setHintOpen(false);
        return;
      }
      if (k in map) {
        e.preventDefault();
        scrollTo(`#${map[k]}`);
        setPulse(k.toUpperCase());
        setTimeout(() => setPulse(null), 600);
        if (!seen.current) {
          seen.current = true;
          setHintOpen(true);
          setTimeout(() => setHintOpen(false), 3200);
        }
      }
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [scrollTo]);

  return (
    <>
      {/* Last-pressed key flash */}
      {pulse && (
        <div
          aria-hidden="true"
          className="pointer-events-none fixed bottom-8 left-1/2 z-[60] -translate-x-1/2"
        >
          <span className="inline-flex h-11 min-w-11 items-center justify-center rounded-[var(--radius)] border border-[var(--accent)] bg-[var(--bg-1)] px-3 font-mono text-lg font-medium text-[var(--accent)] shadow-[var(--glow-accent)]">
            {pulse}
          </span>
        </div>
      )}

      {/* Hint panel */}
      <div
        className={`fixed bottom-6 right-6 z-[55] hidden transition-[opacity,transform] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] md:block ${
          hintOpen
            ? "pointer-events-auto translate-y-0 opacity-100"
            : "pointer-events-none translate-y-2 opacity-0"
        }`}
      >
        <div className="panel w-[15rem] p-5">
          <div className="mb-4 flex items-center justify-between">
            <span className="meta">Shortcuts</span>
            <button
              onClick={() => setHintOpen(false)}
              aria-label="Close shortcuts"
              className="meta text-[var(--text-2)] transition-colors hover:text-[var(--text-1)]"
            >
              esc
            </button>
          </div>
          <ul className="space-y-2.5">
            {hints.map(([k, l]) => (
              <li key={k} className="flex items-center justify-between gap-3">
                <span className="text-[13px] text-[var(--text-2)]">{l}</span>
                <kbd className="inline-flex h-[22px] min-w-[22px] items-center justify-center rounded-[2px] border border-[var(--line-2)] px-1.5 font-mono text-[10px] text-[var(--text-1)]">
                  {k}
                </kbd>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* "?" trigger */}
      <button
        onClick={() => setHintOpen(true)}
        aria-label="Show keyboard shortcuts"
        className={`fixed bottom-6 right-6 z-[54] hidden h-9 w-9 items-center justify-center rounded-[var(--radius)] border border-[var(--line-1)] bg-[var(--bg-1)] font-mono text-sm text-[var(--text-2)] transition-[opacity,color,border-color] duration-200 hover:border-[var(--line-2)] hover:text-[var(--text-1)] md:inline-flex ${
          hintOpen ? "pointer-events-none opacity-0" : "opacity-100"
        }`}
      >
        ?
      </button>
    </>
  );
}
