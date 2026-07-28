"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { ArrowDown, ArrowUpRight, Download } from "lucide-react";
import { gsap } from "@/lib/gsap";
import { shouldAnimate } from "@/lib/utils";
import { socials } from "@/data/socials";
import { HeroCanvas } from "@/components/gl/hero-canvas";
import { TextScramble } from "@/components/ui/text-scramble";
import { useMagnetic } from "@/lib/use-magnetic";
import { useScrollTo } from "@/components/providers/smooth-scroll";

const NAME_LINES = ["Yashvanth", "Sankar"];

export function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const primaryCta = useMagnetic<HTMLDivElement>(0.2, 8);
  const scrollTo = useScrollTo();

  /* useGSAP runs in a layout effect, so the pre-animation state lands
     before paint. Critically, that state is set here rather than as a
     JSX inline transform — a CSS percentage transform poisons GSAP's
     transform cache and the tween silently animates 0 → 0. */
  useGSAP(
    () => {
      if (!shouldAnimate()) return;

      const chars = gsap.utils.toArray<HTMLElement>("[data-hero-char]");
      const rise = gsap.utils.toArray<HTMLElement>("[data-hero-rise]");
      const socialIcons = gsap.utils.toArray<HTMLElement>("[data-hero-social]");

      gsap.set(chars, { yPercent: 118 });
      gsap.set([...rise, ...socialIcons], { autoAlpha: 0 });

      /* Clipping is switched on from JS purely for the duration of the
         rise, then switched back off. It is deliberately absent from the
         markup: a wrapper that clips by default would shear the descender
         of the "y" in Yashvanth for anyone whose JS never runs. */
      const lines = gsap.utils.toArray<HTMLElement>("[data-hero-line]");
      gsap.set(lines, { overflow: "hidden" });

      const tl = gsap.timeline({
        delay: 0.15,
        onComplete: () => {
          gsap.set(lines, { overflow: "visible" });
        },
      });

      tl.to(chars, {
        yPercent: 0,
        duration: 1.1,
        stagger: 0.025,
        ease: "expo.out",
      })
        .to(
          rise,
          { autoAlpha: 1, y: 0, duration: 0.9, stagger: 0.09, ease: "expo.out" },
          "-=0.65"
        )
        .from(rise, { y: 22, duration: 0.9, stagger: 0.09, ease: "expo.out" }, "<")
        .to(
          socialIcons,
          { autoAlpha: 1, duration: 0.5, stagger: 0.05, ease: "expo.out" },
          "-=0.5"
        );

      /* Hero content dissolves as the page curtain rises over it. */
      const mm = gsap.matchMedia();
      mm.add("(min-width: 768px) and (prefers-reduced-motion: no-preference)", () => {
        gsap.to(contentRef.current, {
          autoAlpha: 0.15,
          yPercent: -8,
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top top",
            end: "bottom top",
            scrub: 0.4,
          },
        });
      });

      return () => mm.revert();
    },
    { scope: sectionRef }
  );

  return (
    <section
      ref={sectionRef}
      id="home"
      className="sticky top-0 z-0 flex h-[100svh] items-center overflow-hidden"
    >
      <HeroCanvas />

      <div
        ref={contentRef}
        className="relative z-10 mx-auto w-full max-w-[var(--container)] px-[var(--gutter)] pt-20"
      >
        {/* Availability */}
        <div data-hero-rise className="mb-8 flex items-center gap-2.5">
          <span className="pulse-dot h-1.5 w-1.5 rounded-full bg-[var(--accent)] shadow-[var(--glow-accent)]" />
          <span className="meta text-[var(--text-2)]">
            <TextScramble text="Open to opportunities" startDelay={900} duration={620} />
          </span>
        </div>

        {/* Name — masked char rise. Every glyph is its own element so it can
            be staggered, which makes assistive tech spell the name out one
            letter at a time; the visual split is therefore hidden and the
            name given once as a real (absolutely positioned) text node. */}
        <h1 className="display-xl mb-7 select-none">
          <span className="sr-only">{NAME_LINES.join(" ")}.</span>
          {NAME_LINES.map((line, li) => (
            <span key={line} data-hero-line aria-hidden="true" className="block py-[0.12em]">
              {line.split("").map((char, ci) => (
                <span
                  key={`${line}-${ci}`}
                  data-hero-char
                  className="inline-block will-change-transform"
                >
                  {char}
                </span>
              ))}
              {li === NAME_LINES.length - 1 && (
                <span
                  data-hero-char
                  className="inline-block text-[var(--accent)] will-change-transform"
                >
                  .
                </span>
              )}
            </span>
          ))}
        </h1>

        {/* Role line */}
        <p data-hero-rise className="lead mb-10 max-w-xl text-[var(--text-2)]">
          Full-stack developer &amp; AI engineer building{" "}
          <span className="serif-accent text-[var(--text-1)]">fast, quiet</span> products for
          the modern web.
        </p>

        {/* CTAs */}
        <div data-hero-rise className="flex flex-wrap items-center gap-3">
          <div ref={primaryCta} className="magnetic inline-flex">
            <a
              href="#projects"
              onClick={(e) => {
                e.preventDefault();
                scrollTo("#projects");
              }}
              className="btn btn-primary"
            >
              View selected work
              <ArrowUpRight className="h-4 w-4" />
            </a>
          </div>
          <a href="/YashvanthS_Resume.pdf" download className="btn btn-outline">
            <Download className="h-4 w-4" />
            Résumé
          </a>
        </div>

        {/* Meta strip */}
        <div data-hero-rise className="mt-14 flex flex-wrap items-center gap-x-8 gap-y-4">
          <div className="flex items-center gap-4">
            {socials.slice(0, 5).map((s) => (
              <a
                key={s.name}
                data-hero-social
                href={s.href}
                {...(!s.noBlank && { target: "_blank", rel: "noopener noreferrer" })}
                aria-label={s.name}
                className="h-4 w-4 text-[var(--text-3)] transition-colors duration-200 hover:text-[var(--accent)]"
              >
                {s.icon}
              </a>
            ))}
          </div>
          <span className="meta hidden sm:inline">Chennai, IN · GMT+5:30</span>
          <span className="meta hidden md:inline">IIITDM Kancheepuram</span>
        </div>
      </div>

      {/* Scroll cue — right-aligned so it clears the meta strip on the left,
          and stacked above the fixed "?" shortcuts button, which occupies
          the bottom 60px of this same corner. */}
      <div
        className="pointer-events-none absolute bottom-20 right-[var(--gutter)] z-10 hidden lg:block"
        aria-hidden="true"
      >
        <span className="meta flex items-center gap-2 text-[var(--text-3)]">
          <ArrowDown className="h-3 w-3 animate-bounce" />
          Scroll
        </span>
      </div>
    </section>
  );
}
