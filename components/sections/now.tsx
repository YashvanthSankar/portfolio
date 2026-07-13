"use client";

import { ArrowUpRight } from "lucide-react";
import { Section } from "@/components/ui/section";
import { SectionHeader } from "@/components/ui/section-header";
import { Reveal } from "@/components/ui/reveal";

/**
 * "Now" — what I'm working on right now (not what I've done historically).
 * Inspired by nownownow.com. Update lastUpdated when this changes.
 */
const lastUpdated = "2026-05-10";

const items = [
  {
    label: "Shipping",
    title: "Promptli",
    role: "Developer",
    detail:
      "Building the lead-capture and conversion surface for promptli.com. Voice AI agents that actually convert.",
    href: "https://promptli.com",
  },
  {
    label: "Co-founding",
    title: "Denoise Labs",
    role: "Co-founder",
    detail:
      "A studio + agency for agentic AI. Building modern, opinionated AI products under one brand with a sharp four-person team.",
    href: "https://denoiselabs.com",
  },
  {
    label: "Cooking",
    title: "Redpen & Refile",
    role: "Team product",
    detail:
      "Two Denoise Labs products in early development. Quiet AI tools for writers and file workflows. More soon.",
  },
];

function fmt(date: string) {
  const d = new Date(date);
  if (isNaN(+d)) return date;
  const days = Math.max(0, Math.round((Date.now() - +d) / 86400000));
  if (days === 0) return "today";
  if (days === 1) return "1 day ago";
  if (days < 30) return `${days} days ago`;
  const months = Math.round(days / 30);
  if (months === 1) return "1 month ago";
  return `${months} months ago`;
}

export function NowSection() {
  return (
    <Section id="now">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <SectionHeader
          label="Now"
          title="What I'm shipping right now."
          className="mb-0"
        />
        <Reveal delay={100} className="mb-1">
          <p className="font-mono text-[11px] tracking-wide text-faint">
            Updated {fmt(lastUpdated)}
          </p>
        </Reveal>
      </div>

      <div className="mt-12 grid grid-cols-1 gap-4 md:grid-cols-3">
        {items.map((item, i) => {
          const Wrap = item.href ? "a" : "article";
          const wrapProps = item.href
            ? { href: item.href, target: "_blank", rel: "noopener noreferrer" as const }
            : {};
          return (
            <Reveal key={item.title} delay={i * 70} className="h-full">
              <Wrap
                {...wrapProps}
                className="card card-hover group flex h-full flex-col p-6"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[11px] font-medium uppercase tracking-[0.16em] text-faint">
                    {item.label}
                  </span>
                  {item.href && (
                    <ArrowUpRight className="h-4 w-4 text-faint transition-[color,transform] duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-ink" />
                  )}
                </div>
                <h3 className="mt-5 text-base font-medium text-ink">{item.title}</h3>
                <p className="mt-0.5 text-[13px] text-faint">{item.role}</p>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-muted">{item.detail}</p>
              </Wrap>
            </Reveal>
          );
        })}
      </div>
    </Section>
  );
}
