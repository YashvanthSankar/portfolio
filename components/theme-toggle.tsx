"use client";

import { useSyncExternalStore } from "react";

type Theme = "light" | "dark";

const listeners = new Set<() => void>();
const notify = () => listeners.forEach((fn) => fn());

function subscribe(fn: () => void) {
  listeners.add(fn);
  const mql = window.matchMedia("(prefers-color-scheme: dark)");
  mql.addEventListener("change", fn);
  return () => {
    listeners.delete(fn);
    mql.removeEventListener("change", fn);
  };
}

function current(): Theme {
  const set = document.documentElement.getAttribute("data-theme");
  if (set === "light" || set === "dark") return set;
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

/**
 * Light / dark switch. The choice is written to `data-theme` on <html>
 * and to localStorage; the inline script in app/layout.tsx replays it
 * before first paint so there is no flash. With no stored choice the
 * system preference applies.
 */
export function ThemeToggle() {
  /* `null` on the server and during hydration, so the label never lies. */
  const theme = useSyncExternalStore(subscribe, current, () => null);

  const toggle = () => {
    const next: Theme = current() === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", next);
    try {
      localStorage.setItem("theme", next);
    } catch {
      /* private mode — the attribute still holds for this visit */
    }
    notify();
  };

  const next = theme === "dark" ? "Light" : "Dark";

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={`Switch to ${next.toLowerCase()} theme`}
      title={`${next} theme`}
      className="nav-link inline-flex items-center gap-1.5"
    >
      <span aria-hidden="true" className="theme-glyph" />
      <span className="theme-label">{theme === null ? "Theme" : next}</span>
    </button>
  );
}
