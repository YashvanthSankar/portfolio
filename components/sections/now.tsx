import { ArrowUpRight } from "lucide-react";
import { SectionBorder } from "@/components/ui/section-border";
import { SectionHeader } from "@/components/ui/section-header";
import { Reveal } from "@/components/ui/reveal";

const items = [
  {
    label: "Shipping",
    title: "Promptli",
    detail: "Building a focused conversion surface for voice AI agents.",
    href: "https://promptli.com",
  },
  {
    label: "Co-founding",
    title: "Denoise Labs",
    detail: "A small studio making calm, opinionated AI products.",
    href: "https://denoiselabs.com",
  },
  {
    label: "Exploring",
    title: "Redpen & Refile",
    detail: "Quiet tools for writing and file workflows, currently in development.",
  },
];

export function NowSection() {
  return (
    <SectionBorder id="now">
      <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
        <SectionHeader
          label="01 / Now"
          title="What I’m focused on."
          description="A short, current view of what I’m building and learning. Updated May 2026."
          className="mb-0"
        />
        <div className="divide-y divide-[var(--border-ink)] border-y border-[var(--border-ink)]">
          {items.map((item, index) => {
            const content = (
              <Reveal delay={index * 60} className="group grid gap-3 py-6 sm:grid-cols-[7rem_1fr_auto] sm:items-start">
                <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--muted)]">{item.label}</span>
                <div>
                  <h3 className="text-base font-semibold tracking-[-0.02em]">{item.title}</h3>
                  <p className="mt-1.5 max-w-md text-sm leading-6 text-[var(--muted)]">{item.detail}</p>
                </div>
                {item.href && <ArrowUpRight className="arrow-nudge hidden h-4 w-4 text-[var(--muted)] sm:block" />}
              </Reveal>
            );
            return item.href ? (
              <a key={item.title} href={item.href} target="_blank" rel="noopener noreferrer" className="block">{content}</a>
            ) : <div key={item.title}>{content}</div>;
          })}
        </div>
      </div>
    </SectionBorder>
  );
}
