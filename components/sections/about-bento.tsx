"use client";

import { useRef, useEffect, useState } from "react";
import { MapPin, Mail, Check, Copy, Coffee, Music, Code2, Heart } from "lucide-react";
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
      className="inline-flex items-center gap-1.5 px-2 py-1 border-2 border-[var(--border-ink)] bg-[var(--paper)] text-[var(--ink)] font-mono text-[10px] font-bold uppercase tracking-wider shadow-[2px_2px_0_0_var(--border-ink)] transition-[transform,box-shadow,background-color] duration-200 ease-[cubic-bezier(0.32,0.72,0,1)] hover:-translate-x-[1px] hover:-translate-y-[1px] hover:shadow-[3px_3px_0_0_var(--border-ink)] hover:bg-[var(--surface-alt)]"
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

function Counter({ target, suffix = "", float }: { target: number; suffix?: string; float?: boolean }) {
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
        const duration = 1400;
        const startTime = performance.now();
        const tick = (now: number) => {
          const t = Math.min((now - startTime) / duration, 1);
          const ease = 1 - Math.pow(1 - t, 3);
          const v = ease * target;
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

const stats = [
  { label: "shipped", value: 15, suffix: "+" },
  { label: "stack", value: 20, suffix: "+" },
  { label: "gpa", value: 9.27, suffix: "", float: true },
  { label: "yrs ↗", value: 4, suffix: "+" },
];

const loves: { icon: typeof Coffee; label: string }[] = [
  { icon: Coffee, label: "filter coffee" },
  { icon: Code2, label: "TypeScript" },
  { icon: Music, label: "lo-fi at 3am" },
  { icon: Heart, label: "open source" },
  { icon: Coffee, label: "filter coffee" },
  { icon: Code2, label: "TypeScript" },
  { icon: Music, label: "lo-fi at 3am" },
  { icon: Heart, label: "open source" },
];

export function AboutBento() {
  const gridRef = useRef<HTMLDivElement>(null);
  const quoteRef = useRef<HTMLDivElement>(null);
  const [mouseX, setMouseX] = useState(50);
  const [mouseY, setMouseY] = useState(50);

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
            { opacity: 1, y: 0, duration: 0.6, stagger: 0.08, ease: "power3.out" }
          );
        },
        once: true,
      });

      // Word-stagger reveal on the giant pull-quote
      const words = quoteRef.current?.querySelectorAll<HTMLElement>("[data-quote-word]");
      if (words?.length) {
        gsap.fromTo(
          words,
          { opacity: 0, y: 24, skewY: 4 },
          {
            opacity: 1, y: 0, skewY: 0,
            duration: 0.7, stagger: 0.06, ease: "power4.out",
            scrollTrigger: { trigger: quoteRef.current, start: "top 80%", once: true },
          }
        );
      }
    }, gridRef);
    return () => ctx.revert();
  }, []);

  // Cursor-tracked subtle shift on the bio card
  const onBioMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    setMouseX(((e.clientX - r.left) / r.width) * 100);
    setMouseY(((e.clientY - r.top) / r.height) * 100);
  };

  return (
    <SectionBorder id="about" label="// about" innerClassName="px-6 sm:px-10 py-16 md:py-24">
      <SectionHeader
        label="profile"
        title={
          <>
            Engineer who{" "}
            <span className="inline-block bg-[var(--ink)] text-[var(--paper)] border-[3px] border-[var(--ink)] px-3 shadow-[6px_6px_0_0_var(--ink)] -rotate-1">
              ships.
            </span>
          </>
        }
        description="Less talking. More building. Here's what that looks like."
      />

      {/* PULL QUOTE — signature moment */}
      <div ref={quoteRef} className="mb-10 md:mb-14">
        <p
          className="font-display font-bold leading-[1.1] md:leading-[0.95] tracking-[-0.045em] text-[var(--ink)] max-w-5xl"
          style={{ fontSize: "clamp(1.75rem, 5.5vw, 4rem)" }}
        >
          {[
            "I", "build", "small,", "fast",
            "things,",
            "and", "care",
            "about", "the", "tiny",
            "details", "no", "one", "asks", "for.",
          ].map((w, i) => (
            <span
              key={i}
              data-quote-word
              className={`inline-block mr-[0.18em] ${
                ["small,", "fast"].includes(w)
                  ? "underline decoration-[3px] md:decoration-[6px] underline-offset-[5px] md:underline-offset-[10px]"
                  : ""
              }`}
              style={{ opacity: 0 }}
            >
              {w}
            </span>
          ))}
        </p>
      </div>

      <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-6 gap-5 items-stretch">
        {/* Bio card with cursor-light — 4 cols */}
        <div
          data-bento-card
          onMouseMove={onBioMove}
          className="group/bio md:col-span-4 relative overflow-hidden flex flex-col bg-[var(--surface)] border-[2.5px] border-[var(--ink)] shadow-brutal brutal-card-hover"
          style={{ opacity: 0 }}
        >
          {/* cursor light */}
          <div
            className="pointer-events-none absolute inset-0 transition-opacity duration-500 opacity-0 group-hover/bio:opacity-100 z-0"
            style={{
              background: `radial-gradient(360px circle at ${mouseX}% ${mouseY}%, color-mix(in srgb, var(--ink) 12%, transparent), transparent 65%)`,
            }}
            aria-hidden="true"
          />

          {/* Header band */}
          <div className="relative flex items-center gap-3 px-5 py-2.5 border-b-2 border-dashed border-[var(--ink)]/40">
            <span className="font-mono font-bold text-[10px] tracking-[0.22em] uppercase text-[var(--muted)]">
              {`// bio`}
            </span>
          </div>

          <div className="relative flex-1 p-7">
            <p className="text-base md:text-lg text-[var(--ink)] leading-[1.7]">
              CS student at{" "}
              <span className="bg-[var(--ink)] text-[var(--paper)] px-1.5 font-display font-bold">
                IIITDM Kancheepuram
              </span>{" "}
              (BTech + MTech). I build full-stack web apps and AI tools that
              solve <em className="not-italic underline decoration-[3px] underline-offset-4">real</em> problems.
              Co-founder at{" "}
              <span className="font-display font-bold underline decoration-[3px] underline-offset-4">
                Denoise Labs
              </span>
              , developer on{" "}
              <span className="font-display font-bold underline decoration-[3px] underline-offset-4">
                Promptli
              </span>
              . Right now: making AI feel quiet and useful.
            </p>
          </div>
        </div>

        {/* Location — 2 cols, ink */}
        <div
          data-bento-card
          className="md:col-span-2 relative overflow-hidden bg-[var(--ink)] text-[var(--paper)] border-[2.5px] border-[var(--ink)] shadow-brutal brutal-card-hover p-6"
          style={{ opacity: 0 }}
        >
          {/* tiny grid texture */}
          <div
            className="absolute inset-0 opacity-[0.06]"
            style={{
              backgroundImage:
                "linear-gradient(var(--paper) 1px, transparent 1px), linear-gradient(90deg, var(--paper) 1px, transparent 1px)",
              backgroundSize: "16px 16px",
            }}
            aria-hidden="true"
          />
          <div className="relative">
            <div className="flex items-center gap-2 mb-5">
              <MapPin className="w-4 h-4" aria-hidden="true" />
              <span className="font-mono text-[10px] font-bold uppercase tracking-[0.22em]">
                location
              </span>
            </div>
            <p className="font-display text-3xl md:text-4xl font-bold tracking-[-0.04em] leading-none">
              Chennai.
            </p>
            <p className="font-mono text-[11px] mt-3 opacity-70">India · GMT+5:30</p>
          </div>
        </div>

        {/* Stats wall — 6 cols full-bleed */}
        <div
          data-bento-card
          className="md:col-span-6 relative bg-[var(--surface)] border-[2.5px] border-[var(--ink)] shadow-brutal overflow-hidden"
          style={{ opacity: 0 }}
        >
          {/* Header band */}
          <div className="flex items-center gap-3 px-5 py-2.5 border-b-2 border-dashed border-[var(--ink)]/40">
            <span className="font-mono font-bold text-[10px] tracking-[0.22em] uppercase text-[var(--muted)]">
              {`// by the numbers`}
            </span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4">
            {stats.map((s, i) => (
              <div
                key={s.label}
                className={`group relative p-6 sm:p-8 ${
                  i < 3 ? "border-r-2 border-dashed border-[var(--ink)]/40" : ""
                } ${i < 2 ? "border-b-2 sm:border-b-0 border-dashed border-[var(--ink)]/40" : ""}`}
              >
                <span className="absolute top-3 right-3 font-mono text-[9px] font-bold tracking-[0.22em] uppercase text-[var(--muted)] tabular-nums">
                  0{i + 1}
                </span>
                <div
                  className="font-display font-bold text-[var(--ink)] leading-none tracking-[-0.04em]"
                  style={{ fontSize: "clamp(2.5rem, 5vw, 4rem)" }}
                >
                  <Counter target={s.value} suffix={s.suffix} float={s.float} />
                </div>
                <div className="font-mono text-[10px] text-[var(--muted)] mt-3 uppercase tracking-[0.22em] font-bold group-hover:text-[var(--ink)] transition-colors duration-200">
                  {s.label}
                </div>
                {/* hover bottom-bar */}
                <span
                  aria-hidden="true"
                  className="absolute left-0 bottom-0 h-[3px] w-0 bg-[var(--ink)] transition-[width] duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:w-full"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Email — full width */}
        <div
          data-bento-card
          className="md:col-span-6 relative bg-[var(--surface)] border-[2.5px] border-[var(--ink)] shadow-brutal brutal-card-hover overflow-hidden"
          style={{ opacity: 0 }}
        >
          {/* Header band */}
          <div className="flex items-center gap-3 px-5 py-2.5 border-b-2 border-dashed border-[var(--ink)]/40">
            <span className="inline-flex items-center gap-2 font-mono font-bold text-[10px] tracking-[0.22em] uppercase text-[var(--muted)]">
              <Mail className="w-3 h-3" aria-hidden="true" />
              email
            </span>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5">
            <a
              href="mailto:yashvanthsankar@gmail.com"
              className="font-display font-bold text-lg md:text-2xl text-[var(--ink)] break-words tracking-[-0.02em] link-draw"
            >
              yashvanthsankar@gmail.com
            </a>
            <CopyButton text="yashvanthsankar@gmail.com" />
          </div>
        </div>

        {/* Loves marquee — full bleed */}
        <div
          data-bento-card
          className="md:col-span-6 relative bg-[var(--ink)] text-[var(--paper)] border-[2.5px] border-[var(--ink)] shadow-brutal overflow-hidden"
          style={{ opacity: 0 }}
        >
          {/* Header band — inline, full-width */}
          <div className="flex items-center gap-3 px-5 py-2.5 border-b-2 border-dashed border-[var(--paper)]/30">
            <span className="font-mono font-bold text-[10px] tracking-[0.22em] uppercase text-[var(--paper)]/70">
              {`// currently loving`}
            </span>
          </div>

          {/* edge fades */}
          <div
            className="pointer-events-none absolute inset-y-[2.6rem] left-0 z-10 w-24"
            style={{ background: "linear-gradient(to right, var(--ink), transparent)" }}
            aria-hidden="true"
          />
          <div
            className="pointer-events-none absolute inset-y-[2.6rem] right-0 z-10 w-24"
            style={{ background: "linear-gradient(to left, var(--ink), transparent)" }}
            aria-hidden="true"
          />
          <div className="flex gap-12 py-6 marquee-loves">
            {[...loves, ...loves].map((l, i) => (
              <span
                key={i}
                className="inline-flex items-center gap-3 font-display font-bold text-2xl md:text-3xl tracking-[-0.03em] shrink-0"
              >
                <l.icon className="w-6 h-6 shrink-0" aria-hidden="true" />
                {l.label}
                <span className="opacity-30 ml-4">·</span>
              </span>
            ))}
          </div>
        </div>

        {/* Availability — 6 cols, big closing band */}
        <div
          data-bento-card
          className="md:col-span-6 relative bg-[var(--surface-alt)] border-[2.5px] border-[var(--ink)] shadow-brutal p-6 md:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 overflow-hidden"
          style={{ opacity: 0 }}
        >
          <div className="flex items-center gap-4">
            <div className="inline-flex items-center justify-center w-12 h-12 shrink-0 border-2 border-[var(--ink)] bg-[var(--ink)] text-[var(--paper)] shadow-[3px_3px_0_0_var(--ink)]">
              <span className="relative flex h-2.5 w-2.5 items-center justify-center">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full border-2 border-[var(--paper)]" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[var(--paper)]" />
              </span>
            </div>
            <div>
              <p className="font-mono text-[10px] font-bold uppercase tracking-[0.22em] text-[var(--muted)] mb-1">
                Available
              </p>
              <p className="font-display text-lg md:text-2xl font-bold tracking-[-0.02em] text-[var(--ink)] leading-tight">
                Open to{" "}
                <span className="bg-[var(--ink)] text-[var(--paper)] px-1.5">freelance</span>{" "}
                &amp;{" "}
                <span className="bg-[var(--ink)] text-[var(--paper)] px-1.5">full-time</span>{" "}
                roles
              </p>
            </div>
          </div>
          <a
            href="#contact"
            className="group inline-flex items-center gap-2 px-5 py-3 border-[2.5px] border-[var(--ink)] bg-[var(--ink)] text-[var(--paper)] font-display font-bold text-sm shadow-[5px_5px_0_0_var(--ink)] transition-[transform,box-shadow] duration-200 ease-[cubic-bezier(0.32,0.72,0,1)] hover:-translate-x-[3px] hover:-translate-y-[3px] hover:shadow-[8px_8px_0_0_var(--ink)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[2px_2px_0_0_var(--ink)] shrink-0"
          >
            Reach out
            <span className="inline-block transition-transform duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
              ↗
            </span>
          </a>
        </div>
      </div>
    </SectionBorder>
  );
}
