"use client";

import { type ReactNode } from "react";
import { cn } from "@/lib/utils";

interface SectionBorderProps {
  children: ReactNode;
  className?: string;
  innerClassName?: string;
  id?: string;
  label?: string;
}

/**
 * Brutal section wrapper. Renders a thick top border + optional corner label
 * (the "// section-01" type markers you see in brutalist designs).
 */
export function SectionBorder({ children, className, innerClassName, id, label }: SectionBorderProps) {
  return (
    <section id={id} className={cn("relative border-t-[2.5px] border-[var(--border-ink)]", className)}>
      {label && (
        <div
          className="absolute top-0 left-6 sm:left-10 -translate-y-1/2
                     px-2.5 py-0.5 bg-[var(--paper)] border-2 border-[var(--border-ink)]
                     font-mono font-bold text-[10px] tracking-[0.22em] uppercase text-[var(--ink)] z-10"
        >
          {label}
        </div>
      )}
      <div className={cn("max-w-6xl mx-auto", innerClassName)}>{children}</div>
    </section>
  );
}
