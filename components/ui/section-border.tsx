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
    <section id={id} className={cn(className)}>
      <div className={cn("max-w-6xl mx-auto", innerClassName)}>
        {children}
      </div>
    </section>
  );
}
