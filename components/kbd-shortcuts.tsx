"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";

/**
 * Global keyboard shortcuts. Single-letter taps (no modifier) jump
 * around the site like a power-user palette. Ignores typing into
 * inputs/textareas. Press ? to see the cheat-sheet.
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
          className="pointer-events-none fixed bottom-6 left-1/2 z-[60] -translate-x-1/2"
        >
          <span
            className="inline-flex h-11 min-w-11 items-center justify-center rounded-xl bg-ink px-3 text-lg font-semibold text-paper shadow-lg animate-[reveal-up_300ms_var(--ease-out)_forwards]"
            style={{ opacity: 0 }}
          >
            {pulse}
          </span>
        </div>
      )}

      {/* Cheat-sheet — bottom-left, toggled with ? */}
      <div
        className={`fixed bottom-5 left-5 z-[55] hidden transition-[opacity,transform] duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] md:block ${
          hintOpen
            ? "pointer-events-auto translate-y-0 opacity-100"
            : "pointer-events-none translate-y-2 opacity-0"
        }`}
      >
        <div className="card w-56 p-4 shadow-lg">
          <div className="mb-3 flex items-center justify-between">
            <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-faint">
              Shortcuts
            </span>
            <button
              onClick={() => setHintOpen(false)}
              aria-label="Close shortcuts"
              className="font-mono text-[11px] text-muted transition-colors hover:text-ink"
            >
              esc
            </button>
          </div>
          <ul className="space-y-1.5">
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
                <span className="text-[13px] text-muted">{l}</span>
                <kbd className="inline-flex h-5 min-w-5 items-center justify-center rounded-md border border-line bg-surface-hover px-1.5 font-mono text-[10px] font-medium text-ink">
                  {k}
                </kbd>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
}
