"use client";

import { useEffect, useRef, useState } from "react";
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
import type { TechItem } from "@/data/types";
import { chapterNumber } from "@/data/sections";
import { SectionHeader } from "@/components/ui/section-header";
import { TextScramble } from "@/components/ui/text-scramble";
import { fadeUp } from "@/lib/split-reveal";
import { useRepel } from "@/lib/use-repel";
import { useHydrated } from "@/lib/use-hydrated";

const icons: Record<string, IconType> = {
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

/**
 * One chip. The brand icon is decorative and costs ~1.5 KB of SVG each,
 * so it is drawn only after hydration — the server ships the name alone,
 * which is the part that carries meaning. The name scrambles briefly on
 * hover; the accessible text underneath never changes.
 */
function Chip({ item, hydrated }: { item: TechItem; hydrated: boolean }) {
  const Icon = icons[item.icon] ?? TbDatabase;
  const [hovers, setHovers] = useState(0);

  return (
    <li
      data-stack-chip
      onPointerEnter={() => setHovers((n) => n + 1)}
      className="group inline-flex items-center gap-2 rounded-[var(--radius)] border border-[var(--line-1)] px-3 py-2 transition-[border-color,background-color,box-shadow] duration-300 hover:border-[var(--line-2)] hover:bg-[var(--bg-1)]"
      style={{ opacity: 0 }}
    >
      {hydrated ? (
        <Icon
          className="h-3.5 w-3.5 text-[var(--text-3)] transition-colors duration-300 group-hover:text-[var(--accent)]"
          aria-hidden="true"
        />
      ) : (
        <span className="h-3.5 w-3.5" aria-hidden="true" />
      )}
      <TextScramble
        text={item.name}
        triggerOn="manual"
        trigger={hovers}
        duration={380}
        className="font-mono text-[12px] text-[var(--text-2)] transition-colors duration-300 group-hover:text-[var(--text-1)]"
      />
    </li>
  );
}

export function Stack() {
  const gridRef = useRef<HTMLDivElement>(null);
  const hydrated = useHydrated();

  useEffect(() => {
    const cleanup = fadeUp("[data-stack-chip]", {
      trigger: gridRef.current,
      start: "top 85%",
      stagger: 0.012,
      duration: 0.6,
      y: 14,
    });
    return cleanup;
  }, []);

  /* The chips get out of the pointer's way and spring back. */
  useRepel(gridRef, { selector: "[data-stack-chip]", radius: 170, strength: 30 });

  return (
    <section
      id="technologies"
      className="relative z-10 border-t border-[var(--line-1)] bg-[var(--bg-0)]"
    >
      <div className="mx-auto max-w-[var(--container)] px-[var(--gutter)] py-[var(--section-pad)]">
        <SectionHeader
          index={chapterNumber("technologies")}
          label="stack"
          title={
            <>
              Tools I reach for, <span className="serif-accent">by default</span>.
            </>
          }
          description="Opinionated about a few, comfortable with most, always picking up the next one."
        />

        <div ref={gridRef} className="space-y-12">
          {technologyCategories.map((category, i) => (
            <div
              key={category.title}
              className="grid gap-5 border-t border-[var(--line-1)] pt-6 md:grid-cols-12 md:gap-8"
            >
              <h3 className="meta md:col-span-3">
                <span className="text-[var(--accent)]">{String(i + 1).padStart(2, "0")}</span>
                {" · "}
                {category.title}
              </h3>
              <ul className="flex flex-wrap gap-2 md:col-span-9">
                {category.items.map((item) => (
                  <Chip key={item.name} item={item} hydrated={hydrated} />
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
