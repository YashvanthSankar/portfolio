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

const categoryAccentIcons = [
  "text-yellow-500", "text-cyan-500", "text-green-500", "text-blue-500", "text-orange-500",
];

export function TechMarquee() {
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const cards = gridRef.current?.querySelectorAll("[data-tech-card]");
      if (!cards?.length) return;

      ScrollTrigger.batch(cards, {
        start: "top 88%",
        onEnter(batch) {
          gsap.fromTo(batch,
            { opacity: 0, y: 24, filter: "blur(6px)" },
            {
              opacity: 1, y: 0, filter: "blur(0px)", duration: 0.55, stagger: 0.1, ease: "power3.out",
              onComplete() {
                /* Animate accent lines after cards appear */
                const lines = gridRef.current?.querySelectorAll("[data-accent-line]");
                if (lines?.length) {
                  gsap.to(lines, { scaleX: 1, duration: 0.6, stagger: 0.08, ease: "power2.out" });
                }
              },
            }
          );
        },
        once: true,
      });

      /* Chip hover — GSAP for buttery scale */
      const chips = gridRef.current?.querySelectorAll("[data-tech-chip]");
      chips?.forEach((chip) => {
        const el = chip as HTMLElement;
        el.addEventListener("mouseenter", () =>
          gsap.to(el, { scale: 1.08, y: -2, duration: 0.2, ease: "power2.out" })
        );
        el.addEventListener("mouseleave", () =>
          gsap.to(el, { scale: 1, y: 0, duration: 0.35, ease: "elastic.out(1, 0.5)" })
        );
      });
    }, gridRef);
    return () => ctx.revert();
  }, []);

  return (
    <SectionBorder id="technologies" coord="(0)" innerClassName="px-6 sm:px-10 py-16 md:py-24">
      <SectionHeader
        label="technologies i use"
        title={<>Engineering <span className="text-rose-600 dark:text-rose-400">Toolkit</span></>}
        description="A curated stack of languages, frameworks, and tools I use to build modern applications."
      />

      <div ref={gridRef} className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {technologyCategories.map((category, i) => (
          <article
            key={category.title}
            data-tech-card
            className="group rounded-xl border border-rose-200 dark:border-rose-900/40 bg-[#FFE4E6] dark:bg-[#1a0509] p-5
                       hover:border-rose-300 dark:hover:border-rose-800
                       hover:shadow-[0_4px_24px_rgba(225,29,72,0.07)] dark:hover:shadow-[0_4px_24px_rgba(225,29,72,0.05)]
                       transition-[border-color,box-shadow] duration-300 relative overflow-hidden"
            style={{ opacity: 0 }}
          >
            {/* Corner number */}
            <div className="absolute top-3 right-4 font-mono text-[10px] text-zinc-200 dark:text-zinc-800 select-none pointer-events-none">
              {String(i + 1).padStart(2, "0")}
            </div>

            <div className="mb-4 flex items-center gap-2">
              <h3 className="text-[10px] uppercase tracking-[0.2em] text-zinc-400 dark:text-zinc-500">
                {category.title}
              </h3>
              {/* Accent line */}
              <div
                data-accent-line
                className="h-px flex-1 bg-gradient-to-r from-rose-200 dark:from-rose-800 to-transparent"
                style={{ transform: "scaleX(0)", transformOrigin: "left" }}
              />
            </div>

            <div className="flex flex-wrap gap-1.5">
              {category.items.map((item) => {
                const Icon = monoIcons[item.icon] ?? TbDatabase;
                return (
                  <span
                    key={item.name}
                    data-tech-chip
                    className={`inline-flex items-center gap-1.5
                               px-2.5 py-1 rounded-lg cursor-default
                               border border-zinc-100 dark:border-zinc-800
                               bg-rose-50 dark:bg-[#2d0c12]/50
                               text-[11px] text-zinc-600 dark:text-zinc-400
                               hover:border-rose-200 dark:hover:border-rose-800
                               hover:bg-rose-100 dark:hover:bg-[#2d0c12]
                               transition-[border-color,background-color] duration-200`}
                  >
                    <Icon className={`h-2.5 w-2.5 shrink-0 text-zinc-400 dark:text-zinc-500 group-hover:${categoryAccentIcons[i] ?? "text-rose-400"} transition-colors duration-300`} />
                    {item.name}
                  </span>
                );
              })}
            </div>
          </article>
        ))}
      </div>
    </SectionBorder>
  );
}
