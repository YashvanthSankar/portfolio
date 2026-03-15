"use client";

import { type ReactNode } from "react";
import { cn } from "@/lib/utils";

// Small + crosshair marker where the infinite lines intersect
function Crosshair({ className }: { className?: string }) {
  return (
    <span className={cn("absolute w-3 h-3 pointer-events-none z-10", className)}>
      {/* horizontal arm */}
      <span className="absolute top-1/2 -translate-y-1/2 left-0 right-0 h-px bg-violet-500/70" />
      {/* vertical arm */}
      <span className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-px bg-violet-500/70" />
    </span>
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
    <section
      id={id}
      className={cn(className)}
    >
      <div
        className={cn(
          // Vertical lines at content edges — "infinite" vertical lines
          "relative max-w-6xl mx-auto border-x border-zinc-200 dark:border-zinc-800",
          innerClassName
        )}
      >
        {/* 4 crosshair marks at the intersections (corners) */}
        <Crosshair className="-top-1.5 -left-1.5" />
        <Crosshair className="-top-1.5 -right-1.5" />
        <Crosshair className="-bottom-1.5 -left-1.5" />
        <Crosshair className="-bottom-1.5 -right-1.5" />

        {children}
      </div>
    </section>
  );
}
