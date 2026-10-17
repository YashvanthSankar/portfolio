"use client";

import { useEffect, useRef } from "react";
import { ArrowUpRight } from "lucide-react";
import { fadeUp } from "@/lib/split-reveal";
import { REVEAL_START, STAGGER } from "@/lib/motion";
import { chapterNumber } from "@/data/sections";

/**
 * "Now" — what I'm working on this season, not historically.
 * Inspired by nownownow.com. Update `lastUpdated` when this changes.
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
      "A studio and agency for agentic AI. Modern, opinionated AI products under one brand with a sharp four-person team.",
    href: "https://denoiselabs.com",
  },
  {
    label: "Cooking",
    title: "Redpen & Refile",
    role: "Team product",
    detail:
      "Two Denoise Labs products in early development. Quiet AI tools for writers and file workflows.",
  },
];

function relative(date: string) {
  const d = new Date(date);
  if (isNaN(+d)) return date;
  const days = Math.max(0, Math.round((Date.now() - +d) / 86400000));
  if (days === 0) return "today";
  if (days === 1) return "1 day ago";
  if (days < 30) return `${days} days ago`;
  const months = Math.round(days / 30);
  return months === 1 ? "1 month ago" : `${months} months ago`;
}

export function NowSection() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const cleanup = fadeUp("[data-now-card]", {
      trigger: ref.current,
      start: REVEAL_START,
      stagger: STAGGER.loose,
      y: 24,
    });
    return cleanup;
  }, []);

  return (
    <section
      id="now"
      className="relative z-10 border-t border-[var(--line-1)] bg-[var(--bg-0)]"
    >
      <div className="mx-auto max-w-[var(--container)] px-[var(--gutter)] py-[var(--section-pad)]">
        <div className="mb-12 flex flex-wrap items-end justify-between gap-6 border-b border-[var(--line-1)] pb-6">
          <div className="flex items-center gap-3">
            <span className="meta text-[var(--accent)]">{chapterNumber("now")}</span>
            <span className="meta">right now</span>
          </div>
          <span className="meta">
            updated {relative(lastUpdated)} · {lastUpdated}
          </span>
        </div>

        <div ref={ref} className="grid gap-px bg-[var(--line-1)] md:grid-cols-3">
          {items.map((item, i) => {
            const Wrap = item.href ? "a" : "div";
            const wrapProps = item.href
              ? { href: item.href, target: "_blank", rel: "noopener noreferrer" as const }
              : {};
            return (
              <Wrap
                key={item.title}
                data-now-card
                {...wrapProps}
                className="group relative flex flex-col bg-[var(--bg-0)] p-7 transition-colors duration-300 hover:bg-[var(--bg-1)]"
                style={{ opacity: 0 }}
              >
                {/* Accent rule that draws in on hover */}
                <span className="absolute inset-y-0 left-0 w-px origin-top scale-y-0 bg-[var(--accent)] transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-y-100" />

                <div className="mb-8 flex items-center justify-between">
                  <span className="meta text-[var(--accent)]">{item.label}</span>
                  <span className="meta">0{i + 1}</span>
                </div>

                <h3 className="mb-1 text-xl font-medium tracking-[-0.02em] text-[var(--text-1)]">
                  {item.title}
                </h3>
                <p className="meta mb-5">{item.role}</p>
                <p className="flex-1 text-sm leading-relaxed text-[var(--text-2)]">
                  {item.detail}
                </p>

                {item.href && (
                  <span className="meta mt-7 inline-flex items-center gap-1.5 text-[var(--text-1)] transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-1">
                    Visit
                    <ArrowUpRight className="h-3 w-3" />
                  </span>
                )}
              </Wrap>
            );
          })}
        </div>
      </div>
    </section>
  );
}
