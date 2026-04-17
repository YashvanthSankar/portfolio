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
import { gsap, ScrollTrigger } from "@/lib/gsap";
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

/* Per-category visual design: body bg + tab (colored tag at top) + layout span */
type Variant = {
  body: string;          /* card body classes */
  tab: string;           /* tab label pill classes */
  tabRotate: string;
  number: string;        /* big bg index number color */
  chip: string;          /* chip bg */
  iconBox: string;       /* square behind icon inside chip */
};

const variants: Variant[] = [
  /* Languages — featured, accent body, ink text */
  {
    body: "bg-[var(--accent)] text-[var(--accent-ink)]",
    tab: "bg-[var(--ink)] text-[var(--paper)]",
    tabRotate: "-rotate-3",
    number: "text-[var(--accent-ink)] opacity-10",
    chip: "bg-[var(--paper)] text-[var(--ink)]",
    iconBox: "bg-[var(--accent)] text-[var(--accent-ink)]",
  },
  /* Frontend */
  {
    body: "bg-[var(--surface)] text-[var(--ink)]",
    tab: "bg-[var(--accent)] text-[var(--accent-ink)]",
    tabRotate: "rotate-2",
    number: "text-[var(--ink)] opacity-[0.06]",
    chip: "bg-[var(--paper)] text-[var(--ink)]",
    iconBox: "bg-[var(--ink)] text-[var(--paper)]",
  },
  /* Backend */
  {
    body: "bg-[var(--ink)] text-[var(--paper)]",
    tab: "bg-[var(--accent)] text-[var(--accent-ink)]",
    tabRotate: "-rotate-2",
    number: "text-[var(--paper)] opacity-10",
    chip: "bg-[var(--paper)] text-[var(--ink)]",
    iconBox: "bg-[var(--accent)] text-[var(--accent-ink)]",
  },
  /* Databases */
  {
    body: "bg-[var(--surface-alt)] text-[var(--ink)]",
    tab: "bg-[var(--ink)] text-[var(--paper)]",
    tabRotate: "rotate-3",
    number: "text-[var(--ink)] opacity-[0.08]",
    chip: "bg-[var(--paper)] text-[var(--ink)]",
    iconBox: "bg-[var(--ink)] text-[var(--paper)]",
  },
  /* DevOps & Tools */
  {
    body: "bg-[var(--surface)] text-[var(--ink)]",
    tab: "bg-[var(--ink)] text-[var(--paper)]",
    tabRotate: "-rotate-2",
    number: "text-[var(--ink)] opacity-[0.06]",
    chip: "bg-[var(--paper)] text-[var(--ink)]",
    iconBox: "bg-[var(--accent)] text-[var(--accent-ink)]",
  },
];

/* Grid layout — asymmetric but height follows content (no row-span) */
const spanFor = (i: number) => {
  /* 6-col grid on xl. Cards flow with their own content height. */
  switch (i) {
    case 0: return "xl:col-span-4";   /* Languages — wider, featured */
    case 1: return "xl:col-span-2";   /* Frontend */
    case 2: return "xl:col-span-3";   /* Backend */
    case 3: return "xl:col-span-3";   /* Databases */
    case 4: return "xl:col-span-6";   /* DevOps — full width */
    default: return "xl:col-span-3";
  }
};

export function TechMarquee() {
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!shouldAnimate()) return;
    const ctx = gsap.context(() => {
      const cards = gridRef.current?.querySelectorAll<HTMLElement>("[data-tech-card]");
      if (!cards?.length) return;
      ScrollTrigger.batch(cards, {
        start: "top 88%",
        onEnter(batch) {
          gsap.fromTo(
            batch,
            { opacity: 0, y: 36 },
            { opacity: 1, y: 0, duration: 0.55, stagger: 0.1, ease: "power3.out" }
          );
        },
        once: true,
      });
    }, gridRef);
    return () => ctx.revert();
  }, []);

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
        description="A curated stack of languages, frameworks, and tools I use to ship modern applications."
      />

      <div
        ref={gridRef}
        className="grid gap-6 grid-cols-1 md:grid-cols-2 xl:grid-cols-6"
      >
        {technologyCategories.map((category, i) => {
          const v = variants[i] ?? variants[0];

          return (
            <article
              key={category.title}
              data-tech-card
              className={`relative border-[2.5px] border-[var(--border-ink)] shadow-brutal brutal-card-hover ${v.body} ${spanFor(i)}`}
              style={{ opacity: 0 }}
            >
              {/* Inner clipper — contains the big bg number without clipping the hanging tab */}
              <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <span
                  aria-hidden="true"
                  className={`absolute bottom-0 right-4 translate-y-[18%] font-display font-black select-none leading-none ${v.number}`}
                  style={{ fontSize: "clamp(5rem, 14vw, 10rem)" }}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
              </div>

              {/* Hanging tab — bleeds above card edge (NOT clipped) */}
              <div
                className={`absolute -top-4 left-5 inline-flex items-center gap-2 px-3 py-1.5 border-[2.5px] border-[var(--border-ink)] shadow-[3px_3px_0_0_var(--border-ink)] font-display font-bold text-[11px] tracking-[0.22em] uppercase ${v.tab} ${v.tabRotate}`}
              >
                <span className="w-1.5 h-1.5 bg-current" aria-hidden="true" />
                {category.title}
              </div>

              {/* Content */}
              <div className="relative z-10 p-6 pt-10 flex flex-wrap gap-2">
                {category.items.map((item) => {
                  const Icon = monoIcons[item.icon] ?? TbDatabase;
                  return (
                    <span
                      key={item.name}
                      className={`group inline-flex items-stretch border-2 border-[var(--border-ink)] shadow-[2px_2px_0_0_var(--border-ink)] font-mono text-[12px] font-semibold transition-transform duration-150 hover:-translate-x-[1px] hover:-translate-y-[1px] hover:shadow-[3px_3px_0_0_var(--border-ink)] ${v.chip}`}
                    >
                      <span className={`inline-flex items-center justify-center px-2 border-r-2 border-[var(--border-ink)] ${v.iconBox}`}>
                        <Icon className="h-3.5 w-3.5" aria-hidden="true" />
                      </span>
                      <span className="inline-flex items-center px-2.5 py-1">
                        {item.name}
                      </span>
                    </span>
                  );
                })}
              </div>

              {/* Corner tick-marks for extra brutalist texture on featured card */}
              {i === 0 && (
                <>
                  <span className="absolute top-2 right-2 w-3 h-3 border-[2.5px] border-[var(--accent-ink)] opacity-40" aria-hidden="true" />
                  <span className="absolute bottom-2 left-2 w-3 h-3 border-[2.5px] border-[var(--accent-ink)] opacity-40" aria-hidden="true" />
                </>
              )}
            </article>
          );
        })}
      </div>
    </SectionBorder>
  );
}
