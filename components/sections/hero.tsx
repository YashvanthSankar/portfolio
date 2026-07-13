import Link from "next/link";
import { ArrowDown, ArrowUpRight, Download } from "lucide-react";
import { socials } from "@/data/socials";
import { Reveal } from "@/components/ui/reveal";

export function SpotlightHero() {
  return (
    <section id="home" className="hero-stage site-container flex min-h-[calc(100svh-4.5rem)] scroll-mt-24 flex-col justify-between py-10 md:py-14">
      <Reveal className="relative z-10 flex items-center justify-between gap-6">
        <span className="inline-flex items-center gap-2 text-xs font-medium text-[var(--muted)]">
          <span className="status-dot text-[var(--ink)]" />
          Available for select opportunities
        </span>
        <span className="hidden font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--muted)] sm:block">
          Chennai, India
        </span>
      </Reveal>

      <div className="relative z-10 py-16 md:py-20">
        <Reveal>
          <p className="mb-5 text-sm font-medium text-[var(--muted)]">Full-stack developer &amp; AI engineer</p>
          <h1 className="hero-name" aria-label="Yashvanth Sankar">
            <span className="hero-name__line">Yashvanth</span>
            <span className="hero-name__line hero-name__line--second">Sankar.</span>
          </h1>
        </Reveal>

        <Reveal delay={110} className="mt-8 grid gap-8 border-t border-[var(--border-ink)] pt-6 md:mt-10 md:grid-cols-[1fr_1.2fr_auto] md:items-start md:gap-10">
          <p className="font-mono text-[10px] uppercase leading-5 tracking-[0.13em] text-[var(--muted)]">
            CS student at IIITDM<br />Co-founder, Denoise Labs
          </p>
          <p className="max-w-xl text-base leading-7 text-[var(--muted)] md:text-lg md:leading-8">
            I turn ambitious ideas into fast, thoughtful products—clear interfaces, dependable systems, and details that reward attention.
          </p>
          <div className="flex shrink-0 flex-wrap gap-3">
            <Link href="/work" className="button-primary group">
              View work <ArrowUpRight className="arrow-nudge h-4 w-4" />
            </Link>
            <a href="/YashvanthS_Resume.pdf" download className="button-secondary" aria-label="Download résumé">
              <Download className="h-3.5 w-3.5" />
            </a>
          </div>
        </Reveal>
      </div>

      <Reveal delay={180} className="relative z-10 flex items-end justify-between">
        <div className="flex flex-wrap gap-x-5 gap-y-2">
          {socials.slice(0, 4).map((social) => (
            <a
              key={social.name}
              href={social.href}
              {...(!social.noBlank && { target: "_blank", rel: "noopener noreferrer" })}
              className="text-xs text-[var(--muted)] transition-colors hover:text-[var(--ink)]"
            >
              {social.name}
            </a>
          ))}
        </div>
        <a href="#now" aria-label="Scroll to current work" className="scroll-cue inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.12em] text-[var(--muted)]">
          Scroll <ArrowDown className="h-3.5 w-3.5" />
        </a>
      </Reveal>
    </section>
  );
}
