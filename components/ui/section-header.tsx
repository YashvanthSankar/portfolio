import { type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Reveal } from "@/components/ui/reveal";

interface SectionHeaderProps {
  label: string;
  title: ReactNode;
  description?: string;
  center?: boolean;
  className?: string;
}

export function SectionHeader({ label, title, description, center = false, className }: SectionHeaderProps) {
  return (
    <Reveal
      className={cn(
        "mb-12 md:mb-16",
        center && "mx-auto flex max-w-3xl flex-col items-center text-center",
        className
      )}
    >
      <span className="eyebrow">{label}</span>
      <h2 className={cn("section-title", center && "mx-auto")}>{title}</h2>
      {description && <p className={cn("section-description", center && "mx-auto")}>{description}</p>}
    </Reveal>
  );
}
