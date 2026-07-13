"use client";

import { ArrowUpRight, ArrowDown } from "lucide-react";
import { socials } from "@/data/socials";
import { Button, Dot } from "@/components/ui/primitives";

export function Hero() {
  return (
    <section id="home" className="relative flex min-h-[calc(100svh-4rem)] items-center">
      <div className="mx-auto w-full max-w-5xl px-6 pb-24 pt-16">
        {/* Availability */}
        <div className="fade-up" style={{ "--delay": "0ms" } as React.CSSProperties}>
          <span className="inline-flex items-center gap-2.5 rounded-full border border-line bg-surface py-1.5 pl-3.5 pr-4 text-[13px] text-muted">
            <Dot className="text-ink" />
            Open to opportunities
          </span>
        </div>

        {/* Name */}
        <h1
          className="fade-up mt-8 text-[clamp(2.75rem,7vw,5rem)] font-semibold leading-[1.02] tracking-[-0.035em] text-ink"
          style={{ "--delay": "80ms" } as React.CSSProperties}
        >
          Yashvanth Sankar
        </h1>

        {/* Role */}
        <p
          className="fade-up mt-5 font-mono text-[13px] tracking-wide text-faint"
          style={{ "--delay": "160ms" } as React.CSSProperties}
        >
          Full-Stack Developer · AI Engineer · CS @ IIITDM Kancheepuram
        </p>

        {/* Lede */}
        <p
          className="fade-up mt-6 max-w-xl text-base leading-relaxed text-muted sm:text-lg"
          style={{ "--delay": "240ms" } as React.CSSProperties}
        >
          I build fast, quiet products for the modern web and AI-first
          workflows — and care about the tiny details no one asks for.
        </p>

        {/* CTAs */}
        <div
          className="fade-up mt-10 flex flex-wrap items-center gap-3"
          style={{ "--delay": "320ms" } as React.CSSProperties}
        >
          <Button as="link" href="/work" size="lg" className="group">
            View my work
            <ArrowUpRight className="h-4 w-4 transition-transform duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </Button>
          <Button as="link" href="#contact" variant="secondary" size="lg">
            Get in touch
          </Button>
          <Button as="a" href="/YashvanthS_Resume.pdf" download variant="ghost" size="lg" className="group">
            Resume
            <ArrowDown className="h-4 w-4 transition-transform duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:translate-y-0.5" />
          </Button>
        </div>

        {/* Socials */}
        <div
          className="fade-up mt-14 flex items-center gap-5"
          style={{ "--delay": "400ms" } as React.CSSProperties}
        >
          {socials.map((s) => (
            <a
              key={s.name}
              href={s.href}
              {...(!s.noBlank && { target: "_blank", rel: "noopener noreferrer" })}
              aria-label={s.name}
              className="text-faint transition-[color,transform] duration-200 hover:-translate-y-0.5 hover:text-ink"
            >
              <span className="block h-[18px] w-[18px]">{s.icon}</span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
