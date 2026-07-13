"use client";

import { useEffect, useRef, useState } from "react";
import { flushSync } from "react-dom";
import { Sun, Moon } from "lucide-react";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";

interface ThemeToggleProps {
  className?: string;
}

type DocWithVT = Document & {
  startViewTransition?: (cb: () => void) => { ready: Promise<void> };
};

export function ThemeToggle({ className }: ThemeToggleProps) {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const btnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="h-9 w-9" aria-hidden="true" />;
  }

  const isDark = resolvedTheme === "dark";

  const handleToggle = () => {
    const next = isDark ? "light" : "dark";
    const doc = document as DocWithVT;

    // No-VT fallback: just toggle
    if (!doc.startViewTransition || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setTheme(next);
      return;
    }

    // Compute origin point (center of button) for radial reveal
    const r = btnRef.current?.getBoundingClientRect();
    const cx = r ? r.left + r.width / 2 : window.innerWidth - 60;
    const cy = r ? r.top + r.height / 2 : 40;
    const radius = Math.hypot(
      Math.max(cx, window.innerWidth - cx),
      Math.max(cy, window.innerHeight - cy)
    );

    // Force the theme change to commit synchronously inside the
    // view-transition callback so the "new" snapshot is captured with
    // the correct .dark class applied. Without flushSync, next-themes'
    // async update can land *after* the snapshot, leaving both states
    // identical (no visible wipe — esp. dark→light).
    const transition = doc.startViewTransition(() => {
      flushSync(() => setTheme(next));
    });

    transition.ready.then(() => {
      document.documentElement.animate(
        {
          clipPath: [
            `circle(0px at ${cx}px ${cy}px)`,
            `circle(${radius}px at ${cx}px ${cy}px)`,
          ],
        },
        {
          duration: 520,
          easing: "cubic-bezier(0.32, 0.72, 0, 1)",
          pseudoElement: "::view-transition-new(root)",
        }
      );
    });
  };

  return (
    <button
      ref={btnRef}
      onClick={handleToggle}
      aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
      className={cn(
        "relative inline-flex h-9 w-9 items-center justify-center overflow-hidden rounded-full",
        "text-muted transition-colors duration-200 hover:bg-surface-hover hover:text-ink",
        className
      )}
    >
      <span
        className="absolute inset-0 flex items-center justify-center transition-[transform,opacity] duration-300 ease-[cubic-bezier(0.32,0.72,0,1)]"
        style={{
          transform: isDark ? "translateY(0) rotate(0deg)" : "translateY(140%) rotate(-90deg)",
          opacity: isDark ? 1 : 0,
        }}
        aria-hidden="true"
      >
        <Sun className="h-4 w-4" />
      </span>
      <span
        className="absolute inset-0 flex items-center justify-center transition-[transform,opacity] duration-300 ease-[cubic-bezier(0.32,0.72,0,1)]"
        style={{
          transform: isDark ? "translateY(-140%) rotate(90deg)" : "translateY(0) rotate(0deg)",
          opacity: isDark ? 0 : 1,
        }}
        aria-hidden="true"
      >
        <Moon className="h-4 w-4" />
      </span>
    </button>
  );
}
