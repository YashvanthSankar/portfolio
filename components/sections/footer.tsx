"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowUp } from "lucide-react";
import Image from "next/image";
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
      className="fixed top-0 left-0 right-0 h-[4px] z-[9999] origin-left bg-[var(--accent)]"
      style={{ transform: "scaleX(0)", transformOrigin: "left" }}
      aria-hidden="true"
    />
  );
}

/* ── Footer ── */
export function Footer() {
  const footerRef = useRef<HTMLElement>(null);
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    const handler = () => setShowTop(window.scrollY > 400);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  useEffect(() => {
    if (!shouldAnimate()) return;
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: { trigger: footerRef.current, start: "top 95%", once: true },
      });
      tl.fromTo(
        "[data-footer-el]",
        { opacity: 0, y: 16 },
        { opacity: 1, y: 0, duration: 0.5, stagger: 0.08, ease: "power2.out" }
      );
    }, footerRef);
    return () => ctx.revert();
  }, []);

  return (
    <footer ref={footerRef} className="relative border-t-[2.5px] border-[var(--border-ink)] bg-[var(--paper)]">
      <div className="max-w-6xl mx-auto px-6 sm:px-10 py-10 md:py-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Logo + copyright */}
          <div data-footer-el className="flex items-center gap-3" style={{ opacity: 0 }}>
            <div className="relative h-10 w-10 border-2 border-[var(--border-ink)] bg-[var(--accent)] shadow-[3px_3px_0_0_var(--border-ink)] overflow-hidden">
              <Image src="/ys_red.webp" alt="" fill className="object-cover" quality={85} />
            </div>
            <div>
              <p className="font-display font-bold text-sm text-[var(--ink)]">Yashvanth S</p>
              <p className="font-mono text-xs text-[var(--muted)]">
                © {new Date().getFullYear()} · Built with Next.js
              </p>
            </div>
          </div>

          {/* Socials */}
          <div data-footer-el className="flex flex-wrap items-center justify-center gap-2" style={{ opacity: 0 }}>
            {socials.map((link) => (
              <a
                key={link.name}
                href={link.href}
                {...(!link.noBlank && { target: "_blank", rel: "noopener noreferrer" })}
                aria-label={link.name}
                className="inline-flex items-center justify-center w-9 h-9 border-2 border-[var(--border-ink)] bg-[var(--surface)] text-[var(--ink)] shadow-[2px_2px_0_0_var(--border-ink)] hover:-translate-x-[1px] hover:-translate-y-[1px] hover:shadow-[3px_3px_0_0_var(--border-ink)] hover:bg-[var(--highlight)] transition-transform duration-150"
              >
                <span className="w-4 h-4">{link.icon}</span>
              </a>
            ))}
          </div>

          {/* Back to top */}
          <button
            data-footer-el
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            aria-label="Scroll to top of page"
            className="inline-flex items-center gap-2 px-4 py-2 border-2 border-[var(--border-ink)] bg-[var(--ink)] text-[var(--paper)] font-display font-bold text-xs uppercase tracking-wider shadow-[3px_3px_0_0_var(--border-ink)] hover:-translate-x-[1px] hover:-translate-y-[1px] hover:shadow-[4px_4px_0_0_var(--border-ink)] transition-transform duration-150"
            style={{ opacity: showTop ? 1 : 0.5 }}
          >
            Back to top
            <ArrowUp className="w-3.5 h-3.5" aria-hidden="true" />
          </button>
        </div>
      </div>
    </footer>
  );
}
