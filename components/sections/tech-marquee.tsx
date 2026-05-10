"use client";

import { useRef, useEffect } from "react";
import type { IconType } from "react-icons";
import { FaAws, FaMobileAlt, FaSearch, FaShieldAlt } from "react-icons/fa";
import { TbApi, TbDatabase } from "react-icons/tb";
import {
  SiC, SiCplusplus, SiCss, SiDocker, SiExpress, SiFastapi, SiFigma,
  SiFirebase, SiGit, SiGithub, SiHtml5, SiJavascript, SiLinux,
  SiMongodb, SiMysql, SiNetlify, SiNextdotjs, SiNodedotjs, SiPostgresql,
  SiPostman, SiPrisma, SiPython, SiReact, SiRedis, SiShadcnui,
  SiSupabase, SiTailwindcss, SiTypescript, SiVercel,
} from "react-icons/si";
import { technologyCategories } from "@/data/technologies";
import { gsap } from "@/lib/gsap";
import { shouldAnimate } from "@/lib/utils";
import { SectionBorder } from "@/components/ui/section-border";
import { SectionHeader } from "@/components/ui/section-header";

const monoIcons: Record<string, IconType> = {
  javascript: SiJavascript, typescript: SiTypescript, python: SiPython,
  c: SiC, cplusplus: SiCplusplus, sql: TbDatabase, html5: SiHtml5, css3: SiCss,
  react: SiReact, nextdotjs: SiNextdotjs, tailwindcss: SiTailwindcss,
  shadcnui: SiShadcnui, responsive: FaMobileAlt, seo: FaSearch,
  nodedotjs: SiNodedotjs, express: SiExpress, fastapi: SiFastapi,
  api: TbApi, prisma: SiPrisma, auth: FaShieldAlt,
  postgresql: SiPostgresql, mongodb: SiMongodb, mysql: SiMysql,
  firebase: SiFirebase, supabase: SiSupabase, convex: TbDatabase,
  git: SiGit, github: SiGithub, docker: SiDocker, awslambda: FaAws,
  redis: SiRedis, vercel: SiVercel, netlify: SiNetlify,
  postman: SiPostman, figma: SiFigma, linux: SiLinux,
};

type Tech = { name: string; icon: string };

/* Flatten all categories into two interleaved rows so there's variety in each row */
const allTech: Tech[] = technologyCategories.flatMap((c) => c.items);
const rowA = allTech.filter((_, i) => i % 2 === 0);
const rowB = allTech.filter((_, i) => i % 2 === 1);

function TechChip({ item, variant = "surface" }: { item: Tech; variant?: "surface" | "ink" }) {
  const Icon = monoIcons[item.icon] ?? TbDatabase;
  const isInk = variant === "ink";
  return (
    <span
      className={`inline-flex items-stretch shrink-0 border-2 border-[var(--border-ink)] shadow-[2px_2px_0_0_var(--border-ink)] font-mono text-[13px] font-semibold ${
        isInk ? "bg-[var(--ink)] text-[var(--paper)]" : "bg-[var(--surface)] text-[var(--ink)]"
      }`}
    >
      <span
        className={`inline-flex items-center justify-center px-2.5 border-r-2 border-[var(--border-ink)] ${
          isInk ? "bg-[var(--paper)] text-[var(--ink)]" : "bg-[var(--ink)] text-[var(--paper)]"
        }`}
      >
        <Icon className="h-4 w-4" aria-hidden="true" />
      </span>
      <span className="inline-flex items-center px-3 py-1.5 whitespace-nowrap">
        {item.name}
      </span>
    </span>
  );
}

function MarqueeRow({
  items,
  direction = "left",
  speed = 60,
  variant = "surface",
}: {
  items: Tech[];
  direction?: "left" | "right";
  speed?: number;
  variant?: "surface" | "ink";
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const track = trackRef.current;
    if (!wrap || !track) return;
    if (!shouldAnimate()) return;

    let tween: gsap.core.Tween | null = null;
    let cancelled = false;

    const start = () => {
      if (cancelled) return;
      // Half of the duplicated track is the loop distance
      const half = track.scrollWidth / 2;
      if (half < 10) {
        // Children not laid out yet — try again next frame
        requestAnimationFrame(start);
        return;
      }
      const duration = half / speed;
      const from = direction === "left" ? 0 : -half;
      const to = direction === "left" ? -half : 0;

      tween?.kill();
      tween = gsap.fromTo(
        track,
        { x: from },
        { x: to, duration, ease: "none", repeat: -1 }
      );
    };

    // Wait for fonts so chip widths are stable, then start
    if (typeof document !== "undefined" && "fonts" in document) {
      document.fonts.ready.then(() => requestAnimationFrame(start));
    } else {
      requestAnimationFrame(start);
    }

    const onEnter = () => tween?.timeScale(0.2);
    const onLeave = () => tween?.timeScale(1);
    wrap.addEventListener("mouseenter", onEnter);
    wrap.addEventListener("mouseleave", onLeave);

    // Re-measure on resize
    const ro = new ResizeObserver(start);
    ro.observe(track);

    return () => {
      cancelled = true;
      tween?.kill();
      wrap.removeEventListener("mouseenter", onEnter);
      wrap.removeEventListener("mouseleave", onLeave);
      ro.disconnect();
    };
  }, [direction, speed]);

  return (
    <div ref={wrapRef} className="relative overflow-hidden">
      {/* Edge fades */}
      <div
        className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24"
        style={{ background: "linear-gradient(to right, var(--paper), transparent)" }}
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24"
        style={{ background: "linear-gradient(to left, var(--paper), transparent)" }}
        aria-hidden="true"
      />

      <div
        ref={trackRef}
        className="flex gap-3 py-3 will-change-transform"
        style={{ width: "max-content" }}
      >
        {/* Render twice for seamless loop */}
        {[...items, ...items].map((item, i) => (
          <TechChip key={`${item.name}-${i}`} item={item} variant={variant} />
        ))}
      </div>
    </div>
  );
}

export function TechMarquee() {
  return (
    <SectionBorder id="technologies" label="// stack" innerClassName="px-6 sm:px-10 py-16 md:py-24">
      <SectionHeader
        label="technologies"
        title={
          <>
            Engineering{" "}
            <span className="inline-block bg-[var(--accent)] text-[var(--accent-ink)] border-[3px] border-[var(--border-ink)] px-3 shadow-[6px_6px_0_0_var(--border-ink)] -rotate-1">
              Toolkit.
            </span>
          </>
        }
        description="The tools, frameworks, and languages I reach for to ship modern, opinionated software."
      />

      <div className="space-y-4 -mx-6 sm:-mx-10">
        <MarqueeRow items={rowA} direction="left" speed={45} variant="surface" />
        <MarqueeRow items={rowB} direction="right" speed={38} variant="ink" />
        <MarqueeRow items={rowA} direction="left" speed={52} variant="surface" />
      </div>

      <p className="mt-10 max-w-md font-mono text-xs text-[var(--muted)] leading-relaxed">
        <span className="font-bold text-[var(--ink)] uppercase tracking-[0.18em]">Hover</span> to slow,
        opinionated about a few — comfortable with most. Always picking up the next one.
      </p>
    </SectionBorder>
  );
}
