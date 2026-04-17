"use client";

import { useRef, useEffect, useState } from "react";
import { MapPin, Mail, Check, Copy, Zap } from "lucide-react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { shouldAnimate } from "@/lib/utils";
import { SectionHeader } from "@/components/ui/section-header";
import { SectionBorder } from "@/components/ui/section-border";

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      onClick={() => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }}
      className="inline-flex items-center gap-1.5 px-2 py-1 border-2 border-[var(--border-ink)] bg-[var(--paper)] text-[var(--ink)] font-mono text-[10px] font-bold uppercase tracking-wider shadow-[2px_2px_0_0_var(--border-ink)] hover:-translate-x-[1px] hover:-translate-y-[1px] hover:shadow-[3px_3px_0_0_var(--border-ink)] transition-transform duration-150"
    >
      {copied ? (
        <>
          <Check className="w-3 h-3" /> Copied
        </>
      ) : (
        <>
          <Copy className="w-3 h-3" /> Copy
        </>
      )}
    </button>
  );
}

function Counter({ target, suffix = "" }: { target: number; suffix?: string }) {
  const animate = shouldAnimate();
  const [count, setCount] = useState(() => (animate ? 0 : target));
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || !animate) return;
    const st = ScrollTrigger.create({
      trigger: el,
      start: "top 90%",
      once: true,
      onEnter() {
        if (started.current) return;
        started.current = true;
        const duration = 1200;
        const startTime = performance.now();
        const tick = (now: number) => {
          const t = Math.min((now - startTime) / duration, 1);
          const ease = 1 - Math.pow(1 - t, 3);
          setCount(Math.round(ease * target));
          if (t < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      },
    });
    return () => st.kill();
  }, [target, animate]);

  return (
    <span ref={ref} className="tabular-nums">
      {count}
      {suffix}
    </span>
  );
}

const stats = [
  { label: "projects", value: 15, suffix: "+" },
  { label: "technologies", value: 20, suffix: "+" },
  { label: "gpa", value: 9.27, suffix: "", isFloat: true },
  { label: "yrs coding", value: 4, suffix: "+" },
];

export function AboutBento() {
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!shouldAnimate()) return;
    const ctx = gsap.context(() => {
      const cards = gridRef.current?.querySelectorAll<HTMLElement>("[data-bento-card]");
      if (!cards?.length) return;
      ScrollTrigger.batch(cards, {
        start: "top 88%",
        onEnter(batch) {
          gsap.fromTo(
            batch,
            { opacity: 0, y: 32 },
            { opacity: 1, y: 0, duration: 0.6, stagger: 0.1, ease: "power3.out" }
          );
        },
        once: true,
      });
    }, gridRef);
    return () => ctx.revert();
  }, []);

  return (
    <SectionBorder id="about" label="// about" innerClassName="px-6 sm:px-10 py-16 md:py-24">
      <SectionHeader
        label="who am i"
        title={
          <>
            About{" "}
            <span className="inline-block bg-[var(--accent)] text-[var(--accent-ink)] border-[3px] border-[var(--border-ink)] px-3 shadow-[6px_6px_0_0_var(--border-ink)] rotate-1">
              me.
            </span>
          </>
        }
        description="Passionate developer focused on impactful digital experiences."
      />

      <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Bio — spans 2 */}
        <div
          data-bento-card
          className="md:col-span-2 relative bg-[var(--surface)] border-[2.5px] border-[var(--border-ink)] shadow-brutal p-7"
          style={{ opacity: 0 }}
        >
          <div className="absolute -top-3 left-6 px-3 py-1 bg-[var(--accent)] text-[var(--accent-ink)] border-2 border-[var(--border-ink)] font-display font-bold text-[10px] tracking-[0.2em] uppercase shadow-[3px_3px_0_0_var(--border-ink)] -rotate-sticker-1">
            Bio
          </div>
          <p className="text-base md:text-lg text-[var(--ink)] leading-[1.7] mt-2">
            CS student at{" "}
            <span className="bg-[var(--ink)] text-[var(--paper)] px-1.5 font-display font-bold">
              IIITDM Kancheepuram
            </span>{" "}
            (BTech + MTech). I specialize in full-stack web applications and AI-powered solutions
            that solve real-world problems. When not coding, I&apos;m exploring new tech and
            contributing to open source.
          </p>
        </div>

        {/* Location */}
        <div
          data-bento-card
          className="relative bg-[var(--ink)] text-[var(--paper)] border-[2.5px] border-[var(--border-ink)] shadow-brutal p-6"
          style={{ opacity: 0 }}
        >
          <div className="flex items-center gap-2 mb-4">
            <MapPin className="w-4 h-4" aria-hidden="true" />
            <span className="font-mono text-[10px] font-bold uppercase tracking-[0.22em]">location</span>
          </div>
          <p className="font-display text-2xl font-bold">Chennai</p>
          <p className="text-sm mt-1 opacity-80">Tamil Nadu, India</p>
        </div>

        {/* Email */}
        <div
          data-bento-card
          className="relative bg-[var(--surface)] border-[2.5px] border-[var(--border-ink)] shadow-brutal p-6"
          style={{ opacity: 0 }}
        >
          <div className="flex items-center gap-2 mb-4">
            <Mail className="w-4 h-4" aria-hidden="true" />
            <span className="font-mono text-[10px] font-bold uppercase tracking-[0.22em]">email</span>
          </div>
          <a
            href="mailto:yashvanthsankar@gmail.com"
            className="block font-display font-bold text-[var(--ink)] mb-3 break-words hover:underline decoration-4 decoration-[var(--accent)] underline-offset-4"
          >
            yashvanthsankar@gmail.com
          </a>
          <CopyButton text="yashvanthsankar@gmail.com" />
        </div>

        {/* Stats — spans 2 */}
        <div
          data-bento-card
          className="md:col-span-2 bg-[var(--surface-alt)] border-[2.5px] border-[var(--border-ink)] shadow-brutal p-6"
          style={{ opacity: 0 }}
        >
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
            {stats.map((s) => (
              <div key={s.label} className="border-r-2 last:border-r-0 border-dashed border-[var(--ink)] pr-4 last:pr-0">
                <div className="font-display text-3xl md:text-4xl font-bold text-[var(--ink)] leading-none">
                  {s.isFloat ? <span className="tabular-nums">{s.value}</span> : <Counter target={s.value} suffix={s.suffix} />}
                </div>
                <div className="font-mono text-[10px] text-[var(--ink)] mt-2 uppercase tracking-[0.2em] font-bold">
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Availability — spans 3 */}
        <div
          data-bento-card
          className="md:col-span-3 bg-[var(--accent)] text-[var(--accent-ink)] border-[2.5px] border-[var(--border-ink)] shadow-brutal p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
          style={{ opacity: 0 }}
        >
          <div className="flex items-center gap-4">
            <Zap className="w-6 h-6 shrink-0" aria-hidden="true" />
            <p className="font-display text-lg md:text-xl font-bold">
              Available for <span className="underline decoration-[3px] underline-offset-4">freelance</span> &amp;{" "}
              <span className="underline decoration-[3px] underline-offset-4">full-time</span> opportunities
            </p>
          </div>
          <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-[var(--paper)] border-2 border-[var(--border-ink)] text-[var(--ink)] font-mono text-xs font-bold uppercase tracking-widest shadow-[3px_3px_0_0_var(--border-ink)]">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping bg-[var(--success)]" />
              <span className="relative inline-flex h-2 w-2 bg-[var(--success)]" />
            </span>
            Online now
          </span>
        </div>
      </div>
    </SectionBorder>
  );
}
