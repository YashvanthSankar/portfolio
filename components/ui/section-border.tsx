"use client";

import { type ReactNode } from "react";
import { cn } from "@/lib/utils";

// L-shaped corner bracket — elegant engineering aesthetic
function CornerMark({ position }: { position: "tl" | "tr" | "bl" | "br" }) {
  const cls = {
    tl: "top-0 left-0 border-t border-l",
    tr: "top-0 right-0 border-t border-r",
    bl: "bottom-0 left-0 border-b border-l",
    br: "bottom-0 right-0 border-b border-r",
  }[position];

  return (
    <span
      className={cn(
        "absolute w-2.5 h-2.5 pointer-events-none z-10",
        "border-zinc-400/60 dark:border-zinc-500/40",
        cls
      )}
    />
  );
}

interface SectionBorderProps {
  children: ReactNode;
  className?: string;
  innerClassName?: string;
  id?: string;
}

export function SectionBorder({ children, className, innerClassName, id }: SectionBorderProps) {
  return (
    <section id={id} className={cn(className)}>
      <div
        className={cn(
          "relative max-w-6xl mx-auto border-x border-zinc-200 dark:border-zinc-800",
          innerClassName
        )}
      >
        <CornerMark position="tl" />
        <CornerMark position="tr" />
        <CornerMark position="bl" />
        <CornerMark position="br" />

        {children}
      </div>
    </section>
  );
}
