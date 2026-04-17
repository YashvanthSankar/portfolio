"use client";

import { type ReactNode, useRef, useEffect } from "react";
import { cn, shouldAnimate } from "@/lib/utils";
import { gsap } from "@/lib/gsap";

interface SectionHeaderProps {
  label: string;
  title: ReactNode;
  description?: string;
  center?: boolean;
  className?: string;
}

export function SectionHeader({ label, title, description, center = false, className }: SectionHeaderProps) {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!shouldAnimate()) return;
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: { trigger: rootRef.current, start: "top 88%", once: true },
      });
      tl.fromTo(
        "[data-sh-label]",
        { opacity: 0, x: -16 },
        { opacity: 1, x: 0, duration: 0.5, ease: "power3.out" }
      )
        .fromTo(
          "[data-sh-title]",
          { opacity: 0, y: 24 },
          { opacity: 1, y: 0, duration: 0.55, ease: "power3.out" },
          "-=0.25"
        )
        .fromTo(
          "[data-sh-desc]",
          { opacity: 0, y: 12 },
          { opacity: 1, y: 0, duration: 0.45, ease: "power2.out" },
          "-=0.3"
        );
    }, rootRef);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={rootRef} className={cn("mb-12 md:mb-16", center && "text-center flex flex-col items-center", className)}>
      <span
        data-sh-label
        className="inline-flex items-center gap-2 px-3 py-1 mb-5
                   bg-[var(--accent)] text-[var(--accent-ink)] border-2 border-[var(--border-ink)]
                   shadow-[3px_3px_0_0_var(--border-ink)]
                   font-display font-bold text-[11px] tracking-[0.22em] uppercase
                   -rotate-sticker-1 self-start"
        style={{ opacity: 0 }}
      >
        <span className="block w-2 h-2 bg-current" aria-hidden="true" />
        {label}
      </span>
      <h2
        data-sh-title
        className="font-display font-bold text-[clamp(2rem,5vw,3.5rem)] leading-[0.95] tracking-tight text-[var(--ink)]"
        style={{ opacity: 0 }}
      >
        {title}
      </h2>
      {description && (
        <p
          data-sh-desc
          className={cn(
            "text-sm md:text-base text-[var(--muted)] mt-4 max-w-2xl leading-relaxed",
            center && "text-center"
          )}
          style={{ opacity: 0 }}
        >
          {description}
        </p>
      )}
    </div>
  );
}
