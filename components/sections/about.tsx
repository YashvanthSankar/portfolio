"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Check, Copy } from "lucide-react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { shouldAnimate } from "@/lib/utils";
import { DESKTOP_MOTION } from "@/lib/motion";
import { useIsoLayoutEffect } from "@/lib/use-iso-layout-effect";
import { SectionHeader } from "@/components/ui/section-header";
import { fadeUp, splitReveal } from "@/lib/split-reveal";
import { chapterNumber } from "@/data/sections";
import { EMAIL } from "@/data/site";

const stats = [
  { label: "Projects shipped", value: 15, suffix: "+" },
  { label: "Technologies", value: 20, suffix: "+" },
  { label: "CGPA", value: 9.27, suffix: "", float: true },
  { label: "Years building", value: 4, suffix: "+" },
];

function Counter({
  target,
  suffix = "",
  float,
}: {
  target: number;
  suffix?: string;
  float?: boolean;
}) {
  /* Start at the final value so SSR, hydration and a JS-less visit all
     agree — `shouldAnimate()` reads true on the server, so deciding the
     initial value from it mismatches under reduced motion. The pre-paint
     effect below rewinds to zero only when we're actually going to count. */
  const [count, setCount] = useState(target);
  const ref = useRef<HTMLSpanElement>(null);
  const frame = useRef(0);

  useIsoLayoutEffect(() => {
    if (shouldAnimate()) setCount(0);
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el || !shouldAnimate()) return;

    const st = ScrollTrigger.create({
      trigger: el,
      start: "top 88%",
      once: true,
      onEnter() {
        const duration = 1500;
        const startTime = performance.now();
        const tick = (now: number) => {
          const t = Math.min((now - startTime) / duration, 1);
          const eased = 1 - Math.pow(1 - t, 4);
          const v = eased * target;
          setCount(float ? Math.round(v * 100) / 100 : Math.round(v));
          if (t < 1) frame.current = requestAnimationFrame(tick);
        };
        frame.current = requestAnimationFrame(tick);
      },
    });

    return () => {
      cancelAnimationFrame(frame.current);
      st.kill();
    };
  }, [target, float]);

  return (
    <span ref={ref} className="tabular-nums">
      {float ? count.toFixed(2) : count}
      {suffix}
    </span>
  );
}

function CopyEmail() {
  const [copied, setCopied] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => {
    if (timer.current) clearTimeout(timer.current);
  }, []);

  /* `navigator.clipboard` is undefined on any non-secure origin, so this
     has to be guarded — an unhandled rejection here would leave the button
     stuck reading "Copy" with no indication anything happened. */
  const copy = async () => {
    try {
      await navigator.clipboard?.writeText(EMAIL);
      setCopied(true);
      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(() => setCopied(false), 2000);
    } catch {
      /* Clipboard denied or unavailable — the address is right there as a
         selectable mailto link, so there's nothing useful to say. */
    }
  };

  return (
    <button
      type="button"
      onClick={copy}
      aria-label={copied ? "Email address copied" : "Copy email address"}
      data-cursor="copy"
      className="meta tap-safe inline-flex items-center gap-2 text-[var(--text-2)] transition-colors duration-200 hover:text-[var(--accent)]"
    >
      {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
      {copied ? "Copied" : "Copy"}
    </button>
  );
}

export function About() {
  const sectionRef = useRef<HTMLElement>(null);
  const manifestoRef = useRef<HTMLParagraphElement>(null);
  const photoRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const cleanups = [
      splitReveal(manifestoRef.current, { type: "lines", stagger: 0.08 }),
      fadeUp("[data-about-stat]", {
        trigger: sectionRef.current,
        start: "top 70%",
        stagger: 0.08,
        y: 20,
      }),
    ];

    const mm = gsap.matchMedia();
    mm.add(DESKTOP_MOTION, () => {
      gsap.fromTo(
        photoRef.current,
        { y: 34 },
        {
          y: -34,
          ease: "none",
          scrollTrigger: {
            trigger: photoRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: 0.6,
          },
        }
      );
    });

    return () => {
      cleanups.forEach((fn) => fn());
      mm.revert();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="about"
      className="relative z-10 border-t border-[var(--line-1)] bg-[var(--bg-0)]"
    >
      <div className="mx-auto max-w-[var(--container)] px-[var(--gutter)] py-[var(--section-pad)]">
        <SectionHeader
          index={chapterNumber("about")}
          label="about"
          title={
            <>
              I care about the details{" "}
              <span className="serif-accent">nobody asks for</span>.
            </>
          }
        />

        <div className="grid gap-14 md:grid-cols-12 md:gap-16">
          <div className="md:col-span-7">
            <p ref={manifestoRef} className="display-md mb-10 max-w-2xl font-normal">
              CS student at IIITDM Kancheepuram, building full-stack apps and AI tools
              that solve real problems. Co-founder at Denoise Labs, developer on
              Promptli. Right now I&apos;m making AI feel quiet and useful.
            </p>

            {/* These rows wrap rather than hold one line. The address is a
                single unbreakable token ~187px wide; beside its label, the
                copy button and the gaps it needs ~315px, which is wider
                than the column on a 320px screen. Held on one line it
                widened the whole document and gave the page a horizontal
                scroll. */}
            <div className="max-w-md space-y-0 border-t border-[var(--line-1)]">
              <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 border-b border-[var(--line-1)] py-4">
                <span className="meta">Email</span>
                <div className="flex min-w-0 items-center gap-4">
                  <a
                    href={`mailto:${EMAIL}`}
                    className="link-line tap-safe break-all text-sm text-[var(--text-1)]"
                  >
                    {EMAIL}
                  </a>
                  <CopyEmail />
                </div>
              </div>
              <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 border-b border-[var(--line-1)] py-4">
                <span className="meta">Based in</span>
                <span className="text-sm text-[var(--text-1)]">Chennai, India</span>
              </div>
              <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 border-b border-[var(--line-1)] py-4">
                <span className="meta">Status</span>
                <span className="flex items-center gap-2 text-sm text-[var(--text-1)]">
                  <span className="pulse-dot h-1.5 w-1.5 rounded-full bg-[var(--accent)]" />
                  Open to work
                </span>
              </div>
            </div>
          </div>

          {/* Portrait — intrinsic width/height, never `fill`. An absolutely
              positioned image depends entirely on its parent having height,
              so a single missing utility collapses the whole frame. Sized to
              the source's native 460px so it stays sharp on 2x displays
              rather than being upscaled into a wider slot. */}
          <div className="md:col-span-5">
            <div ref={photoRef} className="relative mx-auto w-full max-w-[280px] md:ml-auto md:mr-0">
              <div className="relative overflow-hidden rounded-[var(--radius)] border border-[var(--line-1)] bg-[var(--bg-1)]">
                <Image
                  src="/yashvanth.jpg"
                  alt="Yashvanth S"
                  width={460}
                  height={460}
                  quality={95}
                  sizes="280px"
                  className="block h-auto w-full grayscale transition-[filter] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] hover:grayscale-0"
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[var(--bg-0)]/55 via-transparent to-transparent" />
              </div>
              <p className="meta mt-4">Chennai · GMT+5:30</p>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="mt-20 grid grid-cols-2 gap-px border-t border-[var(--line-1)] bg-[var(--line-1)] md:grid-cols-4">
          {stats.map((s) => (
            <div
              key={s.label}
              data-about-stat
              className="bg-[var(--bg-0)] px-1 py-8 md:px-2"
              style={{ opacity: 0 }}
            >
              <div className="display-md mb-2 font-semibold tracking-[-0.04em]">
                <Counter target={s.value} suffix={s.suffix} float={s.float} />
              </div>
              <div className="meta">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
