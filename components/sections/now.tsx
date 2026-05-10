"use client";

import { useEffect, useRef } from "react";
import { Hammer, Rocket, FlaskConical } from "lucide-react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { shouldAnimate } from "@/lib/utils";
import { SectionBorder } from "@/components/ui/section-border";

/**
 * "Now" — a small living chapter between hero and stack.
 * Inspired by nownownow.com — what I'm working on, learning, and reading
 * right now (not what I've done historically). Update the lastUpdated date
 * when this changes.
 */
const lastUpdated = "2026-05-10";

const items = [
  {
    icon: Hammer,
    label: "Shipping",
    title: "Promptli",
    role: "Developer",
    detail:
      "Building the lead-capture and conversion surface for promptli.com. Voice AI agents that actually convert.",
    href: "https://promptli.com",
  },
  {
    icon: Rocket,
    label: "Co-founding",
    title: "Denoise Labs",
    role: "Co-founder",
    detail:
      "A studio + agency for agentic AI. Building modern, opinionated AI products under one brand with a sharp four-person team.",
    href: "https://denoiselabs.com",
  },
  {
    icon: FlaskConical,
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
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || !shouldAnimate()) return;
    const ctx = gsap.context(() => {
      const cards = el.querySelectorAll<HTMLElement>("[data-now-card]");
      ScrollTrigger.batch(cards, {
        start: "top 90%",
        onEnter(batch) {
          gsap.fromTo(
            batch,
            { opacity: 0, y: 18 },
            { opacity: 1, y: 0, duration: 0.5, stagger: 0.08, ease: "power3.out" }
          );
        },
        once: true,
      });

      gsap.fromTo(
        el.querySelector("[data-now-header]"),
        { opacity: 0, y: 12 },
        {
          opacity: 1, y: 0, duration: 0.5, ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 88%", once: true },
        }
      );
    }, ref);
    return () => ctx.revert();
  }, []);

  return (
    <SectionBorder id="now" label="// now" innerClassName="px-6 sm:px-10 py-14 md:py-20">
      <div ref={ref} className="space-y-8">
        <div
          data-now-header
          className="flex items-end justify-between gap-6 flex-wrap"
          style={{ opacity: 0 }}
        >
          <div className="max-w-xl">
            <span className="inline-flex items-center gap-2 px-2.5 py-1 border-2 border-[var(--border-ink)] bg-[var(--ink)] text-[var(--paper)] font-mono text-[10px] font-bold tracking-[0.22em] uppercase shadow-[3px_3px_0_0_var(--border-ink)]">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--paper)] opacity-70" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[var(--paper)]" />
              </span>
              Right now
            </span>
            <h2
              className="font-display font-bold leading-[0.95] tracking-[-0.04em] mt-4 text-[var(--ink)]"
              style={{ fontSize: "clamp(2rem, 5vw, 3.25rem)" }}
            >
              What I&apos;m{" "}
              <span className="relative inline-block">
                shipping
                <span className="absolute left-0 right-0 -bottom-1 h-[6px] bg-[var(--ink)]" aria-hidden="true" />
              </span>{" "}
              this season.
            </h2>
          </div>
          <p className="font-mono text-[11px] text-[var(--muted)] tracking-wide">
            <span className="text-[var(--ink)] font-bold uppercase tracking-[0.18em]">Last touched</span>
            <br />
            {fmt(lastUpdated)} · {lastUpdated}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {items.map((item, i) => {
            const Wrap = item.href ? "a" : "article";
            const wrapProps = item.href
              ? { href: item.href, target: "_blank", rel: "noopener noreferrer" as const }
              : {};
            return (
              <Wrap
                key={item.label}
                data-now-card
                {...wrapProps}
                className="group relative flex flex-col bg-[var(--surface)] border-[2.5px] border-[var(--border-ink)] shadow-brutal brutal-card-hover p-5"
                style={{ opacity: 0 }}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="inline-flex items-center justify-center w-9 h-9 border-2 border-[var(--border-ink)] bg-[var(--ink)] text-[var(--paper)] shadow-[2px_2px_0_0_var(--border-ink)] transition-transform duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:rotate-6">
                    <item.icon className="w-4 h-4" aria-hidden="true" />
                  </div>
                  <span className="font-mono text-[10px] font-bold tracking-[0.22em] uppercase text-[var(--muted)]">
                    {item.label} · 0{i + 1}
                  </span>
                </div>
                <h3 className="font-display font-bold text-lg text-[var(--ink)] leading-tight">
                  {item.title}
                </h3>
                <p className="font-mono text-[10px] font-bold tracking-[0.18em] uppercase text-[var(--muted)] mt-1 mb-3">
                  {item.role}
                </p>
                <p className="text-sm text-[var(--ink)] leading-[1.6] flex-1">{item.detail}</p>
                {item.href && (
                  <span className="mt-4 inline-flex items-center gap-1 font-mono text-[10px] font-bold uppercase tracking-[0.22em] text-[var(--ink)] transition-transform duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:translate-x-1">
                    Visit ↗
                  </span>
                )}
              </Wrap>
            );
          })}
        </div>
      </div>
    </SectionBorder>
  );
}
