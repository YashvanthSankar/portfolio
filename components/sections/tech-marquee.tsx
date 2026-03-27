"use client";

import { motion } from "framer-motion";
import type { IconType } from "react-icons";
import { FaAws, FaMobileAlt, FaSearch, FaShieldAlt } from "react-icons/fa";
import { TbApi, TbDatabase } from "react-icons/tb";
import {
  SiC,
  SiCplusplus,
  SiCss,
  SiDocker,
  SiExpress,
  SiFastapi,
  SiFigma,
  SiFirebase,
  SiGit,
  SiGithub,
  SiHtml5,
  SiJavascript,
  SiLinux,
  SiMongodb,
  SiMysql,
  SiNetlify,
  SiNextdotjs,
  SiNodedotjs,
  SiPostgresql,
  SiPostman,
  SiPrisma,
  SiPython,
  SiReact,
  SiRedis,
  SiShadcnui,
  SiSupabase,
  SiTailwindcss,
  SiTypescript,
  SiVercel,
} from "react-icons/si";
import { technologyCategories } from "@/data/technologies";
import { SectionBorder } from "@/components/ui/section-border";

const monoIcons: Record<string, IconType> = {
  javascript: SiJavascript,
  typescript: SiTypescript,
  python: SiPython,
  c: SiC,
  cplusplus: SiCplusplus,
  sql: TbDatabase,
  html5: SiHtml5,
  css3: SiCss,
  react: SiReact,
  nextdotjs: SiNextdotjs,
  tailwindcss: SiTailwindcss,
  shadcnui: SiShadcnui,
  responsive: FaMobileAlt,
  seo: FaSearch,
  nodedotjs: SiNodedotjs,
  express: SiExpress,
  fastapi: SiFastapi,
  api: TbApi,
  prisma: SiPrisma,
  auth: FaShieldAlt,
  postgresql: SiPostgresql,
  mongodb: SiMongodb,
  mysql: SiMysql,
  firebase: SiFirebase,
  supabase: SiSupabase,
  convex: TbDatabase,
  git: SiGit,
  github: SiGithub,
  docker: SiDocker,
  awslambda: FaAws,
  redis: SiRedis,
  vercel: SiVercel,
  netlify: SiNetlify,
  postman: SiPostman,
  figma: SiFigma,
  linux: SiLinux,
};


export function TechMarquee() {
  return (
    <SectionBorder id="technologies" innerClassName="px-6 sm:px-10 py-16 md:py-24">
      {/* Section heading */}
      <motion.p
        initial={{ opacity: 0, y: 8 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.45 }}
        className="text-xs uppercase tracking-[0.28em] text-zinc-400 dark:text-zinc-500 mb-3"
      >
        {"// technologies i use"}
      </motion.p>

      <motion.h2
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.06 }}
        className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-900 dark:text-white mb-10"
      >
        Engineering <span className="text-violet-600 dark:text-violet-400">Toolkit</span>
      </motion.h2>

      {/* Category cards */}
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {technologyCategories.map((category, categoryIndex) => (
          <motion.article
            key={category.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.45, delay: categoryIndex * 0.07 }}
            className="group rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white/70 dark:bg-zinc-900/50 backdrop-blur-sm p-5 transition-colors duration-200 hover:border-zinc-300 dark:hover:border-zinc-700"
          >
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-[11px] uppercase tracking-[0.18em] text-zinc-500 dark:text-zinc-400">
                {category.title}
              </h3>
              <span className="font-mono text-[11px] text-zinc-300 dark:text-zinc-700">
                {String(categoryIndex + 1).padStart(2, "0")}
              </span>
            </div>

            <div className="flex flex-wrap gap-2">
              {category.items.map((item) => {
                const Icon = monoIcons[item.icon] ?? TbDatabase;

                return (
                  <div
                    key={item.name}
                    className="inline-flex items-center gap-1.5 rounded-full border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/60 px-3 py-1.5 text-zinc-600 dark:text-zinc-300 transition-colors duration-150 group-hover:border-zinc-300 dark:group-hover:border-zinc-700"
                  >
                    <Icon className="h-3 w-3 shrink-0 text-zinc-400 dark:text-zinc-500" />
                    <span className="text-[11.5px] whitespace-nowrap">{item.name}</span>
                  </div>
                );
              })}
            </div>
          </motion.article>
        ))}
      </div>
    </SectionBorder>
  );
}
