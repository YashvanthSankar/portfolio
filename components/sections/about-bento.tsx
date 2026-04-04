"use client";

import { useRef, useEffect, useState } from "react";
import { MapPin, Mail, Check, Copy } from "lucide-react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { SectionHeader } from "@/components/ui/section-header";
import { SectionBorder } from "@/components/ui/section-border";

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button
      onClick={handleCopy}
      className="flex items-center gap-1.5 text-xs text-zinc-400 dark:text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors"
    >
      {copied
        ? <><Check className="w-3 h-3 text-emerald-500" /><span className="text-emerald-500">copied</span></>
        : <><Copy className="w-3 h-3" /><span>copy</span></>
      }
    </button>
  );
}

/* Animated counter */
function Counter({ target, suffix = "" }: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
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
  }, [target]);

  return <span ref={ref} className="tabular-nums">{count}{suffix}</span>;
}

const stats = [
  { label: "projects",     value: 15, suffix: "+" },
  { label: "technologies", value: 20, suffix: "+" },
  { label: "gpa",          value: 9.27, suffix: "", isFloat: true },
  { label: "yrs coding",   value: 4,  suffix: "+"  },
];

/* Tilt card using GSAP */
function TiltCard({ children, className }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const onMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width  - 0.5;
      const y = (e.clientY - rect.top)  / rect.height - 0.5;
      gsap.to(el, { rotateY: x * 8, rotateX: -y * 8, duration: 0.4, ease: "power2.out", transformPerspective: 800 });
    };
    const onLeave = () => gsap.to(el, { rotateX: 0, rotateY: 0, duration: 0.6, ease: "elastic.out(1, 0.5)" });
    el.addEventListener("mousemove", onMove);
    el.addEventListener("mouseleave", onLeave);
    return () => { el.removeEventListener("mousemove", onMove); el.removeEventListener("mouseleave", onLeave); };
  }, []);

  return (
    <div
      ref={ref}
      data-bento-card
      className={`rounded-xl border border-rose-200 dark:border-rose-900/40 bg-[#FFE4E6] dark:bg-[#1a0509] p-5
                  hover:border-rose-300 dark:hover:border-rose-800
                  hover:shadow-[0_8px_30px_rgba(225,29,72,0.08)] dark:hover:shadow-[0_8px_30px_rgba(225,29,72,0.05)]
                  transition-[border-color,box-shadow] duration-300 ${className ?? ""}`}
      style={{ opacity: 0 }}
    >
      {children}
    </div>
  );
}

export function AboutBento() {
  const gridRef = useRef<HTMLDivElement>(null);

  /* Batch stagger cards in */
  useEffect(() => {
    const ctx = gsap.context(() => {
      const cards = document.querySelectorAll("[data-bento-card]");
      if (!cards.length) return;
      ScrollTrigger.batch(cards, {
        start: "top 88%",
        onEnter(batch) {
          gsap.fromTo(batch,
            { opacity: 0, y: 28, filter: "blur(6px)" },
            { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.6, stagger: 0.1, ease: "power3.out" }
          );
        },
        once: true,
      });
    }, gridRef);
    return () => ctx.revert();
  }, []);

  return (
    <SectionBorder id="about" coord="(1)" innerClassName="px-6 sm:px-10 py-16 md:py-24">
      <SectionHeader
        label="about"
        title={<>about <span className="text-rose-600 dark:text-rose-400">me</span></>}
        description="A passionate developer focused on creating impactful digital experiences."
      />

      <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-3 gap-4" style={{ perspective: "1000px" }}>
        {/* Bio */}
        <TiltCard className="md:col-span-2 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 rounded-full opacity-[0.06] pointer-events-none"
            style={{ background: "radial-gradient(circle, #e11d48 0%, transparent 70%)", transform: "translate(30%, -30%)" }} />
          <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed relative z-10">
            CS student at IIITDM Kancheepuram (BTech + MTech). I specialize in full-stack web
            applications and AI-powered solutions that solve real-world problems. When not coding,
            I&apos;m exploring new technologies and contributing to open-source.
          </p>
        </TiltCard>

        {/* Location */}
        <TiltCard>
          <div className="flex items-center gap-2 mb-3">
            <MapPin className="w-3.5 h-3.5 text-rose-400 dark:text-rose-500" />
            <span className="text-[10px] text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">location</span>
          </div>
          <p className="text-sm font-medium text-zinc-900 dark:text-white">Chennai, India</p>
          <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-0.5">IIITDM Kancheepuram</p>
        </TiltCard>

        {/* Email */}
        <TiltCard>
          <div className="flex items-center gap-2 mb-3">
            <Mail className="w-3.5 h-3.5 text-rose-400 dark:text-rose-500" />
            <span className="text-[10px] text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">email</span>
          </div>
          <a href="mailto:yashvanthsankar@gmail.com"
            className="block text-sm text-zinc-900 dark:text-white font-medium mb-2 hover:text-rose-600 dark:hover:text-rose-400 transition-colors break-words">
            yashvanthsankar@gmail.com
          </a>
          <CopyButton text="yashvanthsankar@gmail.com" />
        </TiltCard>

        {/* Stats */}
        <TiltCard className="md:col-span-2">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
            {stats.map((s) => (
              <div key={s.label} className="group">
                <div className="text-2xl font-bold text-zinc-900 dark:text-white group-hover:text-rose-600 dark:group-hover:text-rose-400 transition-colors duration-300">
                  {s.isFloat ? <span className="tabular-nums">{s.value}</span> : <Counter target={s.value} suffix={s.suffix} />}
                </div>
                <div className="text-[10px] text-zinc-400 dark:text-zinc-500 mt-0.5 uppercase tracking-wide">{s.label}</div>
              </div>
            ))}
          </div>
        </TiltCard>

        {/* Availability */}
        <div
          data-bento-card
          className="md:col-span-3 rounded-xl border border-rose-200 dark:border-rose-900/40
                     bg-[#FFE4E6] dark:bg-[#1a0509] p-5 flex items-center gap-3
                     hover:border-rose-300 dark:hover:border-rose-800 transition-colors duration-300
                     relative overflow-hidden"
          style={{ opacity: 0 }}
        >
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
            style={{ background: "linear-gradient(90deg, #e11d48 0%, transparent 60%)" }} />
          <span className="relative flex h-2 w-2 shrink-0">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
          </span>
          <span className="text-sm text-zinc-500 dark:text-zinc-400 relative z-10">
            available for <span className="text-zinc-900 dark:text-white font-semibold">freelance</span> &amp; <span className="text-zinc-900 dark:text-white font-semibold">full-time</span> opportunities
          </span>
        </div>
      </div>
    </SectionBorder>
  );
}
