"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { socials } from "@/data/socials";
import { Reveal } from "@/components/ui/reveal";

/* ── Scroll progress — 2px hairline at the very top ── */
export function ScrollProgressBar() {
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = barRef.current;
    if (!el) return;
    let raf = 0;
    const update = () => {
      const doc = document.documentElement;
      const max = doc.scrollHeight - doc.clientHeight;
      el.style.transform = `scaleX(${max > 0 ? doc.scrollTop / max : 0})`;
    };
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <div
      ref={barRef}
      className="fixed inset-x-0 top-0 z-[60] h-[2px] origin-left bg-ink"
      style={{ transform: "scaleX(0)" }}
      aria-hidden="true"
    />
  );
}

const sitemap = [
  { label: "Home", href: "/#home" },
  { label: "Now", href: "/#now" },
  { label: "Stack", href: "/#technologies" },
  { label: "About", href: "/#about" },
  { label: "Work", href: "/#projects" },
  { label: "Journey", href: "/#experience" },
  { label: "Contact", href: "/#contact" },
  { label: "All projects", href: "/work" },
];

/* ── Footer ── */
export function Footer() {
  const [time, setTime] = useState<string>("");

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

  return (
    <footer className="border-t border-line">
      <div className="mx-auto max-w-5xl px-6 py-16">
        <Reveal>
          <div className="grid gap-12 md:grid-cols-[1fr_auto_auto] md:gap-20">
            {/* Brand */}
            <div>
              <p className="text-[15px] font-semibold tracking-tight text-ink">
                Yashvanth Sankar
              </p>
              <p className="mt-1.5 max-w-xs text-sm leading-relaxed text-muted">
                Full-stack engineer &amp; AI tinkerer, building quiet, useful
                software.
              </p>
              <p className="mt-4 font-mono text-[11px] tracking-wide text-faint">
                Chennai, IN{time && <> · {time} IST</>}
              </p>
            </div>

            {/* Sitemap */}
            <div>
              <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-faint">
                Index
              </p>
              <ul className="mt-3 space-y-2">
                {sitemap.map((s) => (
                  <li key={s.label}>
                    <Link
                      href={s.href}
                      className="text-sm text-muted transition-colors duration-200 hover:text-ink"
                    >
                      {s.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Elsewhere */}
            <div>
              <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-faint">
                Elsewhere
              </p>
              <ul className="mt-3 space-y-2">
                {socials.map((link) => (
                  <li key={link.name}>
                    <a
                      href={link.href}
                      {...(!link.noBlank && { target: "_blank", rel: "noopener noreferrer" })}
                      className="group inline-flex items-center gap-1 text-sm text-muted transition-colors duration-200 hover:text-ink"
                    >
                      {link.name}
                      <ArrowUpRight className="h-3 w-3 text-faint opacity-0 transition-[opacity,transform] duration-200 group-hover:translate-x-0.5 group-hover:opacity-100" />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Reveal>
      </div>

      {/* Bottom strip */}
      <div className="border-t border-line">
        <div className="mx-auto flex max-w-5xl flex-col items-start justify-between gap-2 px-6 py-6 sm:flex-row sm:items-center">
          <p className="font-mono text-[11px] text-faint">
            © {new Date().getFullYear()} Yashvanth Sankar · Hand-built, no template.
          </p>
          <p className="font-mono text-[11px] text-faint">
            Next.js · Tailwind · Vercel ·{" "}
            <Link
              href="/palette"
              className="transition-colors duration-200 hover:text-ink"
            >
              Palette
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
