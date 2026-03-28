"use client";

import { type ReactNode } from "react";
import { cn } from "@/lib/utils";

interface SectionBorderProps {
  children: ReactNode;
  className?: string;
  innerClassName?: string;
  id?: string;
}

export function SectionBorder({ children, className, innerClassName, id }: SectionBorderProps) {
  return (
    <section id={id} className={cn("relative", className)}>
      {/* Dashed vertical rail — spans full section height to connect across sections */}
      <div
        className="pointer-events-none absolute inset-0 max-w-6xl mx-auto
                   border-x border-dashed border-zinc-300 dark:border-zinc-700/70"
        aria-hidden
      />

      <div className={cn("max-w-6xl mx-auto", innerClassName)}>
        {children}
      </div>
    </section>
  );
}
