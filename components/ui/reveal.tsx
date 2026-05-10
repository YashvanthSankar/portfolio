"use client";

import { useEffect, useRef, useState, type ReactNode, type ElementType } from "react";
import { cn } from "@/lib/utils";

interface RevealProps {
  children: ReactNode;
  delay?: number;
  className?: string;
  as?: ElementType;
  once?: boolean;
  threshold?: number;
}

export function Reveal({
  children,
  delay = 0,
  className,
  as: Tag = "div",
  once = true,
  threshold = 0.15,
}: RevealProps) {
  const ref = useRef<HTMLElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const obs = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setVisible(true);
            if (once) obs.disconnect();
          } else if (!once) {
            setVisible(false);
          }
        }
      },
      { threshold, rootMargin: "0px 0px -8% 0px" }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [once, threshold]);

  const Component = Tag;
  return (
    <Component
      ref={ref as React.Ref<HTMLElement>}
      data-visible={visible}
      style={{ animationDelay: `${delay}ms` }}
      className={cn("reveal", className)}
    >
      {children}
    </Component>
  );
}
