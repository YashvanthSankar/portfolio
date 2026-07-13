import { type ReactNode } from "react";
import { cn } from "@/lib/utils";

interface SectionProps {
  children: ReactNode;
  className?: string;
  innerClassName?: string;
  id?: string;
}

/**
 * Section wrapper — a hairline top rule and one shared container rhythm
 * (max-w-5xl · px-6 · py-24) so every section breathes the same way.
 */
export function Section({ children, className, innerClassName, id }: SectionProps) {
  return (
    <section id={id} className={cn("border-t border-line", className)}>
      <div className={cn("mx-auto max-w-5xl px-6 py-24 md:py-28", innerClassName)}>
        {children}
      </div>
    </section>
  );
}
