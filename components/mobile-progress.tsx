"use client";

import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";
import { throttle } from "@/lib/utils";

/**
 * Floating back-to-top button. Appears after meaningful scroll,
 * bottom-right, above the safe area. Quiet by design.
 */
export function BackToTop() {
  const [hidden, setHidden] = useState(true);

  useEffect(() => {
    const onScroll = throttle(() => {
      setHidden(window.scrollY < 600);
    }, 100);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      aria-label="Scroll to top"
      className={`fixed bottom-[max(env(safe-area-inset-bottom),1.25rem)] right-5 z-[45] inline-flex h-10 w-10 items-center justify-center rounded-full border border-line bg-surface/80 text-muted shadow-sm backdrop-blur-md transition-[opacity,transform,color,border-color] duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] hover:border-line-strong hover:text-ink lg:right-16 ${
        hidden ? "pointer-events-none translate-y-3 opacity-0" : "translate-y-0 opacity-100"
      }`}
    >
      <ArrowUp className="h-4 w-4" />
    </button>
  );
}
