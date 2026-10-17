"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowUp } from "lucide-react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { shouldAnimate } from "@/lib/utils";
import { DESKTOP_MOTION } from "@/lib/motion";
import { sections, HERO_ID } from "@/data/sections";
import { socials } from "@/data/socials";
import { NAME } from "@/data/site";
import { fadeUp, scoped } from "@/lib/split-reveal";
import { SocialIcon } from "@/components/ui/social-icon";
import { useScrollTo } from "@/components/providers/smooth-scroll";

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
      className="fixed inset-x-0 top-0 z-[80] h-[2px] origin-left bg-[var(--accent)]"
      style={{ transform: "scaleX(0)", transformOrigin: "left" }}
      aria-hidden="true"
    />
  );
}

const colophon = [
  { label: "Framework", value: "Next.js 16" },
  { label: "Styling", value: "Tailwind v4" },
  { label: "Motion", value: "GSAP + Lenis" },
  { label: "Graphics", value: "WebGL" },
  { label: "Hosting", value: "Vercel" },
];

/* Every chapter but the hero, then the one route that isn't a chapter. */
const sitemap = [
  ...sections
    .filter((s) => s.id !== HERO_ID)
    .map((s) => ({ label: s.label, href: `/#${s.id}` })),
  { label: "All projects", href: "/work" },
];

export function Footer() {
  const footerRef = useRef<HTMLElement>(null);
  const wordmarkRef = useRef<HTMLParagraphElement>(null);
  const [time, setTime] = useState("");
  const scrollTo = useScrollTo();

  /* Live Chennai clock — a small "there's a person here" detail. */
  useEffect(() => {
    const tick = () => {
      setTime(
        new Intl.DateTimeFormat("en-US", {
          timeZone: "Asia/Kolkata",
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        }).format(new Date())
      );
    };
    tick();
    const id = setInterval(tick, 30_000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const cleanup = fadeUp("[data-footer-el]", {
      trigger: footerRef.current,
      start: "top 92%",
      stagger: 0.06,
      y: 18,
    });

    /* Final beat — the wordmark rises as the footer enters. */
    const chars = scoped("[data-footer-char]", wordmarkRef.current);
    const mm = gsap.matchMedia();
    mm.add(DESKTOP_MOTION, () => {
      gsap.fromTo(
        chars,
        { yPercent: 105 },
        {
          yPercent: 0,
          ease: "none",
          stagger: 0.03,
          scrollTrigger: {
            trigger: wordmarkRef.current,
            start: "top bottom",
            end: "bottom bottom",
            scrub: 0.6,
          },
        }
      );
    });

    return () => {
      cleanup();
      mm.revert();
    };
  }, []);

  const wordmark = "YASHVANTH";

  return (
    <footer
      ref={footerRef}
      className="relative z-10 overflow-hidden border-t border-[var(--line-1)] bg-[var(--bg-0)]"
    >
      {/* Closing CTA */}
      <div className="border-b border-[var(--line-1)]">
        <div className="mx-auto flex max-w-[var(--container)] flex-wrap items-center justify-between gap-6 px-[var(--gutter)] py-14">
          <div data-footer-el style={{ opacity: 0 }}>
            <div className="mb-3 flex items-center gap-2.5">
              <span className="pulse-dot h-1.5 w-1.5 rounded-full bg-[var(--accent)]" />
              <span className="meta">Available for work</span>
            </div>
            <p className="display-md max-w-lg font-normal">
              Let&apos;s build something{" "}
              <span className="serif-accent">worth shipping</span>.
            </p>
          </div>
          <Link
            data-footer-el
            href="/#contact"
            className="btn btn-primary"
            style={{ opacity: 0 }}
          >
            Start a conversation
          </Link>
        </div>
      </div>

      {/* Meta columns */}
      <div className="mx-auto grid max-w-[var(--container)] grid-cols-2 gap-10 px-[var(--gutter)] py-14 md:grid-cols-12">
        <div data-footer-el className="col-span-2 md:col-span-4" style={{ opacity: 0 }}>
          <p className="mb-2 text-sm font-medium text-[var(--text-1)]">{NAME}</p>
          <p className="text-sm leading-relaxed text-[var(--text-2)]">
            Full-stack engineer, AI tinkerer.
            <br />
            Chennai, IN{" "}
            {time && (
              <span className="font-mono text-[var(--text-1)]">· {time} IST</span>
            )}
          </p>
        </div>

        <div data-footer-el className="col-span-1 md:col-span-3" style={{ opacity: 0 }}>
          <p className="meta mb-4">Sitemap</p>
          <ul className="space-y-2">
            {sitemap.map((s) => (
              <li key={s.label}>
                <Link
                  href={s.href}
                  className="link-line tap-safe py-1.5 text-sm text-[var(--text-2)] hover:text-[var(--text-1)]"
                >
                  {s.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div data-footer-el className="col-span-1 md:col-span-3" style={{ opacity: 0 }}>
          <p className="meta mb-4">Colophon</p>
          <dl className="space-y-2">
            {colophon.map((c) => (
              <div key={c.label} className="flex justify-between gap-4 text-sm">
                <dt className="text-[var(--text-3)]">{c.label}</dt>
                <dd className="text-[var(--text-2)]">{c.value}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div data-footer-el className="col-span-2 md:col-span-2" style={{ opacity: 0 }}>
          <p className="meta mb-4">Elsewhere</p>
          <div className="tap-row flex flex-wrap gap-4">
            {socials.map((s) => (
              <a
                key={s.name}
                href={s.href}
                {...(!s.noBlank && { target: "_blank", rel: "noopener noreferrer" })}
                aria-label={s.name}
                className="tap-safe h-4 w-4 text-[var(--text-3)] transition-colors duration-200 hover:text-[var(--accent)]"
              >
                <SocialIcon icon={s.icon} />
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Outsized wordmark */}
      <div className="border-t border-[var(--line-1)] px-[var(--gutter)] pt-8" aria-hidden="true">
        <p
          ref={wordmarkRef}
          className="flex select-none justify-between overflow-hidden font-display font-semibold leading-[0.8] tracking-[-0.05em] text-[var(--text-1)]"
          style={{ fontSize: "clamp(3rem, 13.5vw, 13rem)" }}
        >
          {wordmark.split("").map((char, i) => (
            <span key={i} className="inline-block overflow-hidden">
              <span data-footer-char className="inline-block">
                {char}
              </span>
            </span>
          ))}
        </p>
      </div>

      {/* Bottom strip */}
      <div className="border-t border-[var(--line-1)]">
        <div className="mx-auto flex max-w-[var(--container)] flex-wrap items-center justify-between gap-4 px-[var(--gutter)] py-5">
          <p className="meta">
            © {new Date().getFullYear()} {NAME} · Hand-built, no template
          </p>
          <button
            onClick={() => scrollTo(0, { updateHash: false })}
            aria-label="Scroll to top of page"
            className="meta tap-safe group inline-flex items-center gap-2 text-[var(--text-2)] transition-colors duration-200 hover:text-[var(--accent)]"
          >
            <ArrowUp className="h-3 w-3 transition-transform duration-300 group-hover:-translate-y-0.5" />
            Back to top
          </button>
        </div>
      </div>
    </footer>
  );
}
