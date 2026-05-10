"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowUp, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { shouldAnimate } from "@/lib/utils";
import { socials } from "@/data/socials";

/* ── Scroll progress bar ── */
export function ScrollProgressBar() {
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!barRef.current || !shouldAnimate()) return;
    const st = ScrollTrigger.create({
      start: 0,
      end: "max",
      scrub: 0,
      onUpdate(self) {
        if (barRef.current) gsap.set(barRef.current, { scaleX: self.progress });
      },
    });
    return () => st.kill();
  }, []);

  return (
    <div
      ref={barRef}
      className="fixed top-0 left-0 right-0 h-[4px] z-[9999] origin-left bg-[var(--ink)]"
      style={{ transform: "scaleX(0)", transformOrigin: "left" }}
      aria-hidden="true"
    />
  );
}

const colophon = [
  { label: "Framework", value: "Next.js 16" },
  { label: "Styling", value: "Tailwind v4" },
  { label: "Motion", value: "GSAP + Framer" },
  { label: "Type", value: "Geist" },
  { label: "Hosting", value: "Vercel" },
];

const sitemap = [
  { label: "Home", href: "/#home" },
  { label: "Now", href: "/#now" },
  { label: "Stack", href: "/#technologies" },
  { label: "Work", href: "/#projects" },
  { label: "Journey", href: "/#experience" },
  { label: "Contact", href: "/#contact" },
  { label: "All projects", href: "/work" },
  { label: "Palette", href: "/palette" },
];

/* ── Footer ── */
export function Footer() {
  const footerRef = useRef<HTMLElement>(null);
  const [showTop, setShowTop] = useState(false);
  const [time, setTime] = useState<string>("");

  useEffect(() => {
    const handler = () => setShowTop(window.scrollY > 400);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  // Live local-time clock for Chennai — small "I'm a real person" detail
  useEffect(() => {
    const tick = () => {
      const fmt = new Intl.DateTimeFormat("en-US", {
        timeZone: "Asia/Kolkata",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      });
      setTime(fmt.format(new Date()));
    };
    tick();
    const id = setInterval(tick, 30_000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    if (!shouldAnimate()) return;
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: { trigger: footerRef.current, start: "top 90%", once: true },
      });
      tl.fromTo(
        "[data-footer-el]",
        { opacity: 0, y: 18 },
        { opacity: 1, y: 0, duration: 0.55, stagger: 0.06, ease: "power3.out" }
      ).fromTo(
        "[data-footer-wordmark]",
        { opacity: 0, y: 80, skewY: 6 },
        { opacity: 1, y: 0, skewY: 0, duration: 1.0, ease: "power4.out" },
        "-=0.4"
      );
    }, footerRef);
    return () => ctx.revert();
  }, []);

  return (
    <footer ref={footerRef} className="relative border-t-[2.5px] border-[var(--border-ink)] bg-[var(--paper)] overflow-hidden">
      {/* TOP BAND — closing CTA */}
      <div className="border-b-[2.5px] border-[var(--border-ink)]">
        <div className="max-w-6xl mx-auto px-6 sm:px-10 py-10 md:py-14">
          <div
            data-footer-el
            className="flex flex-col md:flex-row md:items-center justify-between gap-6"
            style={{ opacity: 0 }}
          >
            <div>
              <span className="inline-flex items-center gap-2 px-2.5 py-1 border-2 border-[var(--border-ink)] bg-[var(--ink)] text-[var(--paper)] font-mono text-[10px] font-bold tracking-[0.22em] uppercase shadow-[3px_3px_0_0_var(--border-ink)]">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--paper)] opacity-70" />
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[var(--paper)]" />
                </span>
                Open for work
              </span>
              <h2
                className="font-display font-bold leading-[0.92] tracking-[-0.04em] mt-4 text-[var(--ink)]"
                style={{ fontSize: "clamp(1.6rem, 3.6vw, 2.6rem)" }}
              >
                Got an idea worth{" "}
                <span className="inline-block bg-[var(--ink)] text-[var(--paper)] border-[3px] border-[var(--border-ink)] px-3 shadow-[6px_6px_0_0_var(--border-ink)] -rotate-1">
                  shipping?
                </span>
              </h2>
            </div>
            <Link
              href="#contact"
              className="group inline-flex items-center gap-2 px-5 py-3 border-[2.5px] border-[var(--border-ink)] bg-[var(--ink)] text-[var(--paper)] font-display font-bold text-sm shadow-[6px_6px_0_0_var(--border-ink)] transition-[transform,box-shadow] duration-200 ease-[cubic-bezier(0.32,0.72,0,1)] hover:-translate-x-[3px] hover:-translate-y-[3px] hover:shadow-[9px_9px_0_0_var(--border-ink)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[2px_2px_0_0_var(--border-ink)] shrink-0"
            >
              Start a conversation
              <ArrowUpRight className="w-4 h-4 transition-transform duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
          </div>
        </div>
      </div>

      {/* MID BAND — sitemap + colophon + meta */}
      <div className="max-w-6xl mx-auto px-6 sm:px-10 py-10 md:py-14 grid grid-cols-2 md:grid-cols-12 gap-8">
        {/* Brand */}
        <div data-footer-el className="col-span-2 md:col-span-4 flex items-start gap-3" style={{ opacity: 0 }}>
          <div className="logo-frame relative h-12 w-12 shrink-0 border-2 border-[var(--ink)] shadow-[3px_3px_0_0_var(--ink)] overflow-hidden">
            <span className="logo-mark" aria-hidden="true" />
          </div>
          <div>
            <p className="font-display font-bold text-base text-[var(--ink)]">Yashvanth S</p>
            <p className="font-mono text-xs text-[var(--muted)] leading-relaxed mt-1">
              Full-stack engineer · AI tinkerer.
              <br />
              Chennai, IN · {time && <span className="text-[var(--ink)] font-bold">{time} IST</span>}
            </p>
          </div>
        </div>

        {/* Sitemap */}
        <div data-footer-el className="col-span-1 md:col-span-3" style={{ opacity: 0 }}>
          <p className="font-mono text-[10px] font-bold tracking-[0.22em] uppercase text-[var(--muted)] mb-3">
            Sitemap
          </p>
          <ul className="space-y-1.5">
            {sitemap.map((s) => (
              <li key={s.label}>
                <Link
                  href={s.href}
                  className="link-draw font-display font-semibold text-sm text-[var(--ink)]"
                >
                  {s.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Colophon */}
        <div data-footer-el className="col-span-1 md:col-span-3" style={{ opacity: 0 }}>
          <p className="font-mono text-[10px] font-bold tracking-[0.22em] uppercase text-[var(--muted)] mb-3">
            Colophon
          </p>
          <dl className="space-y-1.5">
            {colophon.map((c) => (
              <div key={c.label} className="flex justify-between gap-3 font-mono text-xs">
                <dt className="text-[var(--muted)]">{c.label}</dt>
                <dd className="text-[var(--ink)] font-bold tabular-nums">{c.value}</dd>
              </div>
            ))}
          </dl>
        </div>

        {/* Socials */}
        <div data-footer-el className="col-span-2 md:col-span-2" style={{ opacity: 0 }}>
          <p className="font-mono text-[10px] font-bold tracking-[0.22em] uppercase text-[var(--muted)] mb-3">
            Find me
          </p>
          <div className="flex flex-wrap gap-2">
            {socials.map((link) => (
              <a
                key={link.name}
                href={link.href}
                {...(!link.noBlank && { target: "_blank", rel: "noopener noreferrer" })}
                aria-label={link.name}
                className="inline-flex items-center justify-center w-9 h-9 border-2 border-[var(--border-ink)] bg-[var(--surface)] text-[var(--ink)] shadow-[2px_2px_0_0_var(--border-ink)] transition-[transform,box-shadow,background-color] duration-200 ease-[cubic-bezier(0.32,0.72,0,1)] hover:-translate-x-[2px] hover:-translate-y-[2px] hover:shadow-[4px_4px_0_0_var(--border-ink)] hover:bg-[var(--surface-alt)] active:translate-x-[1px] active:translate-y-[1px] active:shadow-[1px_1px_0_0_var(--border-ink)]"
              >
                <span className="w-4 h-4">{link.icon}</span>
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* WORDMARK — outsized closing signature */}
      <div
        className="border-t-[2.5px] border-[var(--border-ink)] overflow-hidden select-none"
        aria-hidden="true"
      >
        <div className="max-w-[1400px] mx-auto px-4 sm:px-10 pt-6 pb-2">
          <p
            data-footer-wordmark
            className="font-display font-bold leading-[0.85] tracking-[-0.06em] text-[var(--ink)] whitespace-nowrap"
            style={{ fontSize: "clamp(3rem, 14vw, 14rem)", opacity: 0 }}
          >
            YASHVANTH<span className="text-[var(--surface-alt)]">.</span>
          </p>
        </div>
      </div>

      {/* BOTTOM STRIP — copyright + back to top */}
      <div className="border-t-[2.5px] border-[var(--border-ink)]">
        <div className="max-w-6xl mx-auto px-6 sm:px-10 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p data-footer-el className="font-mono text-xs text-[var(--muted)]" style={{ opacity: 0 }}>
            © {new Date().getFullYear()} Yashvanth Sankar · Hand-built, no template.
          </p>
          <button
            data-footer-el
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            aria-label="Scroll to top of page"
            className="group inline-flex items-center gap-2 px-3.5 py-1.5 border-2 border-[var(--border-ink)] bg-[var(--surface)] text-[var(--ink)] font-mono text-[10px] font-bold uppercase tracking-[0.22em] shadow-[2px_2px_0_0_var(--border-ink)] transition-[transform,box-shadow,opacity] duration-200 ease-[cubic-bezier(0.32,0.72,0,1)] hover:-translate-x-[2px] hover:-translate-y-[2px] hover:shadow-[4px_4px_0_0_var(--border-ink)] active:translate-x-[1px] active:translate-y-[1px] active:shadow-[1px_1px_0_0_var(--border-ink)]"
            style={{ opacity: showTop ? 1 : 0 }}
          >
            <ArrowUp className="w-3 h-3 transition-transform duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:-translate-y-0.5" aria-hidden="true" />
            Top
          </button>
        </div>
      </div>
    </footer>
  );
}
