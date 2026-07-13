"use client";

import { useEffect, useRef, useState } from "react";
import { Check, Copy } from "lucide-react";
import { shouldAnimate } from "@/lib/utils";
import { Section } from "@/components/ui/section";
import { SectionHeader } from "@/components/ui/section-header";
import { Reveal } from "@/components/ui/reveal";

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
      className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium text-muted transition-colors duration-200 hover:bg-surface-hover hover:text-ink"
    >
      {copied ? (
        <>
          <Check className="h-3.5 w-3.5" /> Copied
        </>
      ) : (
        <>
          <Copy className="h-3.5 w-3.5" /> Copy
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
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || started.current) return;
        started.current = true;
        obs.disconnect();
        const duration = 1200;
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
      { threshold: 0.5 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [target, animate, float]);

  return (
    <span ref={ref} className="tabular-nums">
      {float ? count.toFixed(2) : count}
      {suffix}
    </span>
  );
}

const stats = [
  { label: "Projects shipped", value: 15, suffix: "+" },
  { label: "Technologies", value: 20, suffix: "+" },
  { label: "GPA", value: 9.27, suffix: "", float: true },
  { label: "Years building", value: 4, suffix: "+" },
];

export function AboutSection() {
  return (
    <Section id="about">
      <SectionHeader label="About" title="Engineer who ships." />

      {/* Pull quote */}
      <Reveal>
        <p className="max-w-3xl text-xl font-medium leading-snug tracking-tight text-ink md:text-[1.75rem]">
          &ldquo;I build small, fast things — and care about the tiny details
          no one asks for.&rdquo;
        </p>
      </Reveal>

      {/* Bio */}
      <Reveal delay={80}>
        <p className="mt-8 max-w-2xl text-[15px] leading-relaxed text-muted">
          CS student at <span className="font-medium text-ink">IIITDM Kancheepuram</span>{" "}
          (BTech + MTech). I build full-stack web apps and AI tools that solve
          real problems. Co-founder at{" "}
          <span className="font-medium text-ink">Denoise Labs</span>, developer
          on <span className="font-medium text-ink">Promptli</span>. Right now:
          making AI feel quiet and useful.
        </p>
      </Reveal>

      {/* Stats */}
      <Reveal delay={140}>
        <div className="card mt-12 overflow-hidden">
          <div className="grid grid-cols-2 sm:grid-cols-4">
            {stats.map((s, i) => (
              <div
                key={s.label}
                className={[
                  "p-6 sm:p-8",
                  i === 0 && "border-b border-r border-line sm:border-b-0",
                  i === 1 && "border-b border-line sm:border-b-0 sm:border-r",
                  i === 2 && "border-r border-line",
                ]
                  .filter(Boolean)
                  .join(" ")}
              >
                <div className="text-3xl font-semibold tracking-tight text-ink md:text-4xl">
                  <Counter target={s.value} suffix={s.suffix} float={s.float} />
                </div>
                <p className="mt-2 font-mono text-[11px] uppercase tracking-[0.14em] text-faint">
                  {s.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </Reveal>

      {/* Email */}
      <Reveal delay={200}>
        <div className="mt-12 flex flex-wrap items-center justify-between gap-4 border-t border-line pt-8">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-faint">
              Email
            </p>
            <a
              href="mailto:yashvanthsankar@gmail.com"
              className="link-underline mt-1.5 text-lg font-medium tracking-tight text-ink"
            >
              yashvanthsankar@gmail.com
            </a>
          </div>
          <CopyButton text="yashvanthsankar@gmail.com" />
        </div>
      </Reveal>

      {/* Small print */}
      <Reveal delay={260}>
        <p className="mt-10 text-sm text-faint">
          Fueled by filter coffee, TypeScript, lo-fi at 3 am, and open source.
        </p>
      </Reveal>
    </Section>
  );
}
