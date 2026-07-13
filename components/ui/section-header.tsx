import { type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Reveal } from "@/components/ui/reveal";

interface SectionHeaderProps {
  label: string;
  title: ReactNode;
  description?: string;
  className?: string;
}

export function SectionHeader({ label, title, description, className }: SectionHeaderProps) {
  return (
    <Reveal className={cn("mb-12 md:mb-14", className)}>
      <p className="font-mono text-[11px] font-medium uppercase tracking-[0.18em] text-faint">
        {label}
      </p>
      <h2 className="mt-3 text-2xl font-semibold tracking-tight text-ink md:text-[2rem] md:leading-tight">
        {title}
      </h2>
      {description && (
        <p className="mt-3 max-w-lg text-[15px] leading-relaxed text-muted">{description}</p>
      )}
    </Reveal>
  );
}
