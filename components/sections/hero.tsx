"use client";

import { Download, ArrowUpRight, Sparkles } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";
import { shouldAnimate } from "@/lib/utils";
import { socials } from "@/data/socials";
import { BrutalButton, BrutalBadge, BrutalTag } from "@/components/ui/brutal";
import { TextScramble } from "@/components/ui/text-scramble";
import { useMagnetic } from "@/lib/use-magnetic";

const roles = ["Full-Stack Dev", "AI Engineer", "CS Student"];

function ScrollCue() {
  const [visible, setVisible] = useState(true);
  useEffect(() => {
    const handler = () => setVisible(window.scrollY < 80);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);
  return (
    <div
      className="hidden md:flex absolute bottom-8 left-10 flex-col items-center gap-3 pointer-events-none transition-opacity duration-500"
      style={{ opacity: visible ? 1 : 0 }}
      aria-hidden="true"
    >
      <span className="font-mono text-[10px] tracking-[0.32em] uppercase text-[var(--muted)] [writing-mode:vertical-rl] rotate-180">
        scroll · keep going
      </span>
      <div className="relative w-[2px] h-20 bg-[var(--border-ink)]/30 overflow-hidden">
        <span className="scroll-cue-tick absolute left-0 right-0 h-3 bg-[var(--ink)]" />
      </div>
      <span className="font-mono text-[9px] tracking-[0.32em] tabular-nums text-[var(--muted)]">
        001
      </span>
    </div>
  );
}

export function SpotlightHero() {
  const sectionRef = useRef<HTMLElement>(null);
  const spotlightRef = useRef<HTMLDivElement>(null);
  const badgeRef = useRef<HTMLDivElement>(null);
  const nameRef = useRef<HTMLHeadingElement>(null);
  const roleRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const socialsRef = useRef<HTMLDivElement>(null);
  const primaryCtaRef = useMagnetic<HTMLDivElement>(0.18, 6);

  useEffect(() => {
    const section = sectionRef.current;
    const spot = spotlightRef.current;
    if (!section || !spot) return;
    if (window.matchMedia("(hover: none)").matches) return;
    if (!shouldAnimate()) return;

    let lastDot = 0;
    const onMove = (e: MouseEvent) => {
      const rect = section.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      spot.style.setProperty("--x", `${x}%`);
      spot.style.setProperty("--y", `${y}%`);

      // Throttle: emit a fading ink dot every ~70ms
      const now = performance.now();
      if (now - lastDot < 70) return;
      lastDot = now;

      const dot = document.createElement("span");
      dot.className = "ink-trail-dot";
      dot.style.left = `${e.clientX - rect.left}px`;
      dot.style.top = `${e.clientY - rect.top}px`;
      section.appendChild(dot);
      // Auto-remove after the CSS animation completes
      window.setTimeout(() => dot.remove(), 900);
    };
    const onEnter = () => spot.setAttribute("data-active", "true");
    const onLeave = () => spot.setAttribute("data-active", "false");

    section.addEventListener("mousemove", onMove);
    section.addEventListener("mouseenter", onEnter);
    section.addEventListener("mouseleave", onLeave);
    return () => {
      section.removeEventListener("mousemove", onMove);
      section.removeEventListener("mouseenter", onEnter);
      section.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  useEffect(() => {
    if (!shouldAnimate()) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".scroll-cue-tick",
        { y: -16, opacity: 0 },
        {
          y: 80,
          opacity: 1,
          duration: 1.6,
          repeat: -1,
          ease: "power2.in",
          keyframes: {
            "0%":   { y: -16, opacity: 0 },
            "20%":  { opacity: 1 },
            "80%":  { opacity: 1 },
            "100%": { y: 80, opacity: 0 },
          },
        }
      );

      const tl = gsap.timeline({ delay: 0.15 });

      tl.fromTo(
        badgeRef.current,
        { opacity: 0, y: 16, rotate: -8 },
        { opacity: 1, y: 0, rotate: -1.2, duration: 0.55, ease: "back.out(2)" }
      );

      if (nameRef.current) {
        const words = nameRef.current.querySelectorAll(".hero-word");
        tl.fromTo(
          words,
          { opacity: 0, y: 60, skewY: 8 },
          {
            opacity: 1, y: 0, skewY: 0,
            duration: 0.7, stagger: 0.12, ease: "power4.out",
          },
          "-=0.2"
        );
      }

      tl.fromTo(
        roleRef.current?.querySelectorAll("[data-role-tag]") ?? [],
        { opacity: 0, y: 16, scale: 0.85 },
        { opacity: 1, y: 0, scale: 1, duration: 0.5, stagger: 0.08, ease: "back.out(1.7)" },
        "-=0.4"
      )
        .fromTo(
          ctaRef.current,
          { opacity: 0, y: 18 },
          { opacity: 1, y: 0, duration: 0.55, ease: "power3.out" },
          "-=0.3"
        )
        .fromTo(
          socialsRef.current?.querySelectorAll("a") ?? [],
          { opacity: 0, y: 10, scale: 0.8 },
          { opacity: 1, y: 0, scale: 1, duration: 0.4, stagger: 0.05, ease: "back.out(1.5)" },
          "-=0.3"
        );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="home"
      className="relative min-h-[100dvh] flex items-center overflow-hidden"
    >
      <div ref={spotlightRef} className="cursor-spotlight" aria-hidden="true" />

      <div className="relative z-10 w-full max-w-6xl mx-auto px-6 sm:px-10 pt-32 pb-28">
        {/* Availability badge */}
        <div ref={badgeRef} className="inline-block mb-10" style={{ opacity: 0 }}>
          <BrutalBadge variant="highlight" className="animate-wobble">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping bg-[var(--accent)]" />
              <span className="relative inline-flex h-2 w-2 bg-[var(--accent)] border border-[var(--border-ink)]" />
            </span>
            <Sparkles className="w-3 h-3" />
            Open to opportunities
          </BrutalBadge>
        </div>

        {/* Name — stacked, massive, with highlight on last word */}
        <h1
          ref={nameRef}
          className="font-display font-bold leading-[0.88] tracking-[-0.04em] text-[var(--ink)] mb-8 select-none"
          style={{ fontSize: "clamp(3.5rem, 11vw, 9rem)" }}
        >
          <span className="hero-word inline-block mr-[0.15em]" style={{ opacity: 0 }}>
            Yashvanth
          </span>
          <br />
          <span
            className="hero-word inline-block bg-[var(--accent)] text-[var(--accent-ink)] border-[3px] border-[var(--border-ink)] px-4 md:px-6 py-1 shadow-[8px_8px_0_0_var(--border-ink)] -rotate-1"
            style={{ opacity: 0 }}
          >
            <TextScramble text="Sankar." startDelay={620} duration={700} />
          </span>
        </h1>

        {/* Role tags */}
        <div ref={roleRef} className="mb-10 flex flex-wrap items-center gap-2.5">
          {roles.map((r, i) => (
            <span key={r} data-role-tag style={{ opacity: 0 }}>
              <BrutalTag
                variant={i === 0 ? "ink" : i === 1 ? "secondary" : "surface"}
                className={i === 1 ? "-rotate-sticker-1" : i === 2 ? "rotate-sticker-1" : ""}
              >
                {r}
              </BrutalTag>
            </span>
          ))}
        </div>

        <div className="mb-10 max-w-2xl">
          <p className="text-base sm:text-lg text-[var(--ink)] leading-[1.7]">
            Building fast, opinionated products for the modern web &amp; AI-first workflows.{" "}
            <span className="text-[var(--muted)]">Currently at IIITDM Kancheepuram.</span>
          </p>
        </div>

        {/* CTAs */}
        <div ref={ctaRef} className="flex flex-wrap items-center gap-4" style={{ opacity: 0 }}>
          <div ref={primaryCtaRef} className="magnetic inline-flex">
            <BrutalButton as="link" href="/work" variant="primary" size="lg">
              View my work
              <ArrowUpRight className="w-4 h-4" />
            </BrutalButton>
          </div>

          <BrutalButton as="link" href="#contact" variant="secondary" size="lg">
            Let&apos;s talk
          </BrutalButton>

          <BrutalButton as="a" href="/YashvanthS_Resume.pdf" download variant="ink" size="lg">
            <Download className="w-4 h-4" />
            Resume
          </BrutalButton>
        </div>

        {/* Socials */}
        <div ref={socialsRef} className="mt-14 flex flex-wrap items-center gap-2">
          {socials.map((s) => (
            <a
              key={s.name}
              href={s.href}
              {...(!s.noBlank && { target: "_blank", rel: "noopener noreferrer" })}
              aria-label={s.name}
              style={{ opacity: 0 }}
              className="inline-flex items-center justify-center w-10 h-10
                         border-2 border-[var(--border-ink)] bg-[var(--surface)] text-[var(--ink)]
                         shadow-[3px_3px_0_0_var(--border-ink)]
                         transition-[transform,box-shadow,background-color] duration-200 ease-[cubic-bezier(0.32,0.72,0,1)]
                         hover:-translate-x-[3px] hover:-translate-y-[3px]
                         hover:shadow-[6px_6px_0_0_var(--border-ink)]
                         hover:bg-[var(--surface-alt)]
                         active:translate-x-[2px] active:translate-y-[2px]
                         active:shadow-[1px_1px_0_0_var(--border-ink)]"
            >
              <span className="w-4 h-4">{s.icon}</span>
            </a>
          ))}
        </div>
      </div>

      <ScrollCue />
    </section>
  );
}
