"use client";

import { type ReactNode, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { fadeUp, splitReveal } from "@/lib/split-reveal";

interface SectionHeaderProps {
  /** Two-digit chapter number, e.g. `"01"`. */
  index: string;
  label: string;
  title: ReactNode;
  description?: string;
  className?: string;
}

export function SectionHeader({
  index,
  label,
  title,
  description,
  className,
}: SectionHeaderProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const descRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const cleanups = [
      fadeUp("[data-sh-label]", { trigger: rootRef.current, y: 14, duration: 0.6 }),
      splitReveal(titleRef.current, { type: "lines", stagger: 0.09, delay: 0.08 }),
      fadeUp(descRef.current, { trigger: rootRef.current, delay: 0.25, y: 16 }),
    ];
    return () => cleanups.forEach((fn) => fn());
  }, []);

  return (
    <div ref={rootRef} className={cn("mb-14 md:mb-20", className)}>
      <div
        data-sh-label
        className="mb-6 flex items-center gap-3 border-b border-[var(--line-1)] pb-4"
      >
        <span className="meta text-[var(--accent)]">{index}</span>
        <span className="meta">{label}</span>
      </div>
      <h2 ref={titleRef} className="display-lg max-w-4xl">
        {title}
      </h2>
      {description && (
        <p ref={descRef} className="lead mt-6 max-w-xl">
          {description}
        </p>
      )}
    </div>
  );
}
