"use client";

import { type ReactNode, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import { gsap, ScrollTrigger } from "@/lib/gsap";

interface SectionHeaderProps {
  label: string;
  title: ReactNode;
  description?: string;
  center?: boolean;
  className?: string;
}

export function SectionHeader({ label, title, description, center = false, className }: SectionHeaderProps) {
  const rootRef  = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLParagraphElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const descRef  = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: rootRef.current,
          start: "top 88%",
          once: true,
        },
      });

      tl.fromTo(
        labelRef.current,
        { opacity: 0, y: 10, filter: "blur(4px)" },
        { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.5, ease: "power3.out" }
      )
        .fromTo(
          titleRef.current,
          { opacity: 0, y: 22, filter: "blur(6px)" },
          { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.65, ease: "power3.out" },
          "-=0.25"
        );

      if (descRef.current) {
        tl.fromTo(
          descRef.current,
          { opacity: 0, y: 14 },
          { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" },
          "-=0.35"
        );
      }
    }, rootRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={rootRef} className={cn("mb-12", center && "text-center", className)}>
      <p
        ref={labelRef}
        className="text-xs text-zinc-400 dark:text-zinc-500 tracking-widest uppercase mb-3"
        style={{ opacity: 0 }}
      >
        {`// ${label}`}
      </p>
      <h2
        ref={titleRef}
        className="text-3xl md:text-4xl font-bold text-zinc-900 dark:text-white"
        style={{ opacity: 0 }}
      >
        {title}
      </h2>
      {description && (
        <p
          ref={descRef}
          className="text-sm text-zinc-500 dark:text-zinc-400 mt-3 max-w-xl"
          style={{ opacity: 0 }}
        >
          {description}
        </p>
      )}
    </div>
  );
}
