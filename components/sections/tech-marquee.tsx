"use client";

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
import { Section } from "@/components/ui/section";
import { SectionHeader } from "@/components/ui/section-header";
import { Reveal } from "@/components/ui/reveal";

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

function TechChip({ item }: { item: Tech }) {
  const Icon = monoIcons[item.icon] ?? TbDatabase;
  return (
    <span className="inline-flex shrink-0 items-center gap-2 rounded-full border border-line bg-surface px-3.5 py-1.5 text-[13px] text-muted transition-colors duration-200 hover:border-line-strong hover:text-ink">
      <Icon className="h-3.5 w-3.5 text-faint" aria-hidden="true" />
      <span className="whitespace-nowrap">{item.name}</span>
    </span>
  );
}

function MarqueeRow({
  items,
  reverse = false,
  duration = 55,
}: {
  items: Tech[];
  reverse?: boolean;
  duration?: number;
}) {
  const track = (hidden: boolean) => (
    <div className="marquee-track" aria-hidden={hidden || undefined}>
      {items.map((item) => (
        <TechChip key={item.name} item={item} />
      ))}
    </div>
  );

  return (
    <div
      className={`marquee py-1 ${reverse ? "marquee-reverse" : ""}`}
      style={{ "--duration": `${duration}s` } as React.CSSProperties}
    >
      {track(false)}
      {track(true)}
    </div>
  );
}

export function TechMarquee() {
  return (
    <Section id="technologies" innerClassName="px-0 sm:px-0 max-w-none">
      <div className="mx-auto max-w-5xl px-6">
        <SectionHeader
          label="Stack"
          title="Tools I reach for."
          description="Opinionated about a few, comfortable with most — always picking up the next one."
        />
      </div>

      <Reveal className="space-y-3">
        <MarqueeRow items={rowA} duration={60} />
        <MarqueeRow items={rowB} reverse duration={50} />
      </Reveal>

      <div className="mx-auto max-w-5xl px-6">
        <p className="mt-10 font-mono text-[11px] tracking-wide text-faint">
          Hover to pause
        </p>
      </div>
    </Section>
  );
}
