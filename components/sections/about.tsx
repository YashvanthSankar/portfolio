"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Check, Copy } from "lucide-react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { shouldAnimate } from "@/lib/utils";
import { SectionHeader } from "@/components/ui/section-header";
import { fadeUp, splitReveal } from "@/lib/split-reveal";

const EMAIL = "yashvanthsankar@gmail.com";

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
  const animate = shouldAnimate();
  const [count, setCount] = useState(() => (animate ? 0 : target));
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || !animate) return;
    const st = ScrollTrigger.create({
      trigger: el,
      start: "top 88%",
      once: true,
      onEnter() {
        if (started.current) return;
        started.current = true;
        const duration = 1500;
        const startTime = performance.now();
        const tick = (now: number) => {
          const t = Math.min((now - startTime) / duration, 1);
          const eased = 1 - Math.pow(1 - t, 4);
          const v = eased * target;
          setCount(float ? Math.round(v * 100) / 100 : Math.round(v));
          if (t < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      },
    });
    return () => st.kill();
  }, [target, animate, float]);

  return (
    <span ref={ref} className="tabular-nums">
      {float ? count.toFixed(2) : count}
      {suffix}
    </span>
  );
}

function CopyEmail() {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={() => {
        navigator.clipboard.writeText(EMAIL);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }}
      className="meta inline-flex items-center gap-2 text-[var(--text-2)] transition-colors duration-200 hover:text-[var(--accent)]"
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
    mm.add("(min-width: 768px) and (prefers-reduced-motion: no-preference)", () => {
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
          index="02"
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

            <div className="max-w-md space-y-0 border-t border-[var(--line-1)]">
              <div className="flex items-center justify-between gap-4 border-b border-[var(--line-1)] py-4">
                <span className="meta">Email</span>
                <div className="flex items-center gap-4">
                  <a href={`mailto:${EMAIL}`} className="link-line text-sm text-[var(--text-1)]">
                    {EMAIL}
                  </a>
                  <CopyEmail />
                </div>
              </div>
              <div className="flex items-center justify-between gap-4 border-b border-[var(--line-1)] py-4">
                <span className="meta">Based in</span>
                <span className="text-sm text-[var(--text-1)]">Chennai, India</span>
              </div>
              <div className="flex items-center justify-between gap-4 border-b border-[var(--line-1)] py-4">
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
