"use client";

import { useEffect, useRef, useState } from "react";
import { useTheme } from "next-themes";

/**
 * Global keyboard shortcuts. Single-letter taps (no modifier) jump
 * around the site like a power-user palette. Ignores typing into
 * inputs/textareas. Shows a tiny corner hint on first key tap.
 *
 *   H → home  ·  N → now  ·  S → stack  ·  A → about
 *   W → work  ·  J → journey  ·  C → contact  ·  T → toggle theme
 *   ? → toggle hint
 */
const map: Record<string, string> = {
  h: "home",
  n: "now",
  s: "technologies",
  a: "about",
  w: "projects",
  j: "experience",
  c: "contact",
};

export function KbdShortcuts() {
  const { resolvedTheme, setTheme } = useTheme();
  const [hintOpen, setHintOpen] = useState(false);
  const [pulse, setPulse] = useState<string | null>(null);
  const seen = useRef(false);

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
      if (k === "t") {
        e.preventDefault();
        setTheme(resolvedTheme === "dark" ? "light" : "dark");
        setPulse("T");
        setTimeout(() => setPulse(null), 600);
        return;
      }
      if (k in map) {
        e.preventDefault();
        const id = map[k];
        document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
        setPulse(k.toUpperCase());
        setTimeout(() => setPulse(null), 600);
        // First-time tap shows the hint pill briefly
        if (!seen.current) {
          seen.current = true;
          setHintOpen(true);
          setTimeout(() => setHintOpen(false), 3200);
        }
      }
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [resolvedTheme, setTheme]);

  return (
    <>
      {/* Last-pressed key flash */}
      {pulse && (
        <div
          aria-hidden="true"
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[60] pointer-events-none"
        >
          <span
            className="inline-flex items-center justify-center min-w-12 h-12 px-3 border-[2.5px] border-[var(--ink)] bg-[var(--ink)] text-[var(--paper)] font-display font-bold text-2xl shadow-[5px_5px_0_0_var(--ink)] animate-[reveal-up_400ms_var(--ease-spring)_forwards]"
            style={{ opacity: 0 }}
          >
            {pulse}
          </span>
        </div>
      )}

      {/* Hint pill — bottom-right corner */}
      <div
        className={`hidden md:flex fixed bottom-6 right-6 z-[55] flex-col items-end gap-2 transition-[opacity,transform] duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] ${
          hintOpen
            ? "opacity-100 translate-y-0 pointer-events-auto"
            : "opacity-0 translate-y-2 pointer-events-none"
        }`}
      >
        <div className="border-[2.5px] border-[var(--ink)] bg-[var(--surface)] shadow-[5px_5px_0_0_var(--ink)] p-4 max-w-xs">
          <div className="flex items-center justify-between gap-4 mb-3">
            <span className="font-mono text-[10px] font-bold tracking-[0.22em] uppercase text-[var(--muted)]">
              Shortcuts
            </span>
            <button
              onClick={() => setHintOpen(false)}
              aria-label="Close shortcuts"
              className="font-mono text-[10px] font-bold text-[var(--ink)] hover:underline"
            >
              esc
            </button>
          </div>
          <ul className="space-y-1.5 text-xs">
            {[
              ["H", "Home"],
              ["N", "Now"],
              ["S", "Stack"],
              ["A", "About"],
              ["W", "Work"],
              ["J", "Journey"],
              ["C", "Contact"],
              ["T", "Toggle theme"],
              ["?", "Toggle this"],
            ].map(([k, l]) => (
              <li key={k} className="flex items-center justify-between gap-3">
                <span className="text-[var(--ink)] font-display font-semibold">{l}</span>
                <kbd className="inline-flex items-center justify-center min-w-[22px] h-[22px] px-1.5 border-2 border-[var(--ink)] bg-[var(--paper)] text-[var(--ink)] font-mono text-[10px] font-bold shadow-[2px_2px_0_0_var(--ink)]">
                  {k}
                </kbd>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Tiny "?" trigger — fixed bottom-right when hint closed */}
      <button
        onClick={() => setHintOpen(true)}
        aria-label="Show keyboard shortcuts"
        className={`hidden md:inline-flex fixed bottom-6 right-6 z-[54] items-center justify-center w-9 h-9 border-2 border-[var(--ink)] bg-[var(--surface)] text-[var(--ink)] font-display font-bold text-sm shadow-[3px_3px_0_0_var(--ink)] transition-[transform,box-shadow,opacity] duration-200 ease-[cubic-bezier(0.32,0.72,0,1)] hover:-translate-x-[2px] hover:-translate-y-[2px] hover:shadow-[5px_5px_0_0_var(--ink)] ${
          hintOpen ? "opacity-0 pointer-events-none" : "opacity-100"
        }`}
      >
        ?
      </button>
    </>
  );
}
