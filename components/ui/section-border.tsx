import { type ReactNode } from "react";
import { cn } from "@/lib/utils";

interface SectionBorderProps {
  children: ReactNode;
  className?: string;
  innerClassName?: string;
  id?: string;
  label?: string;
}

export function SectionBorder({ children, className, innerClassName, id }: SectionBorderProps) {
  return (
    <section id={id} className={cn("section-shell", className)}>
      <div className={cn("site-container", innerClassName)}>{children}</div>
    </section>
  );
}
