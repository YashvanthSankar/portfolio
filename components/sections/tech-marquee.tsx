"use client";

import { motion } from "framer-motion";
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

export function TechMarquee() {
  return (
    <SectionBorder id="technologies" coord="(0)" innerClassName="px-6 sm:px-10 py-16 md:py-24">
      <SectionHeader
        label="technologies i use"
        title={<>Engineering <span className="text-red-600 dark:text-red-400">Toolkit</span></>}
        description="A curated stack of languages, frameworks, and tools I use to build modern applications."
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {technologyCategories.map((category, i) => (
          <motion.article
            key={category.title}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.4, delay: i * 0.06, ease: [0.22, 1, 0.36, 1] }}
            className="rounded-xl border border-zinc-200 dark:border-zinc-700/60 bg-white dark:bg-zinc-900 p-5
                       hover:border-zinc-300 dark:hover:border-zinc-600 transition-colors duration-200"
          >
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-[10px] uppercase tracking-[0.2em] text-zinc-400 dark:text-zinc-500">
                {category.title}
              </h3>
              <span className="font-mono text-[10px] text-zinc-300 dark:text-zinc-700">
                {String(i + 1).padStart(2, "0")}
              </span>
            </div>

            <div className="flex flex-wrap gap-1.5">
              {category.items.map((item) => {
                const Icon = monoIcons[item.icon] ?? TbDatabase;
                return (
                  <span
                    key={item.name}
                    className="inline-flex items-center gap-1.5
                               px-2.5 py-1 rounded-lg
                               border border-zinc-100 dark:border-zinc-800
                               bg-zinc-50 dark:bg-zinc-800/50
                               text-[11px] text-zinc-600 dark:text-zinc-400"
                  >
                    <Icon className="h-2.5 w-2.5 shrink-0 text-zinc-400 dark:text-zinc-500" />
                    {item.name}
                  </span>
                );
              })}
            </div>
          </motion.article>
        ))}
      </div>
    </SectionBorder>
  );
}
