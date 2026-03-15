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

const cardAngles = [
  "rotate-[-0.8deg]",
  "rotate-[0.7deg]",
  "rotate-[-0.5deg]",
  "rotate-[0.6deg]",
  "rotate-[-0.4deg]",
];

export function TechMarquee() {
  return (
    <SectionBorder id="technologies" innerClassName="px-4 sm:px-6 py-12 md:py-20">
      <div className="relative overflow-hidden rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/60 dark:bg-zinc-900/35 px-4 py-5 sm:px-6 sm:py-6">
        <div className="pointer-events-none absolute inset-0 [background:radial-gradient(circle_at_0%_0%,rgba(0,0,0,0.07),transparent_30%),radial-gradient(circle_at_100%_100%,rgba(0,0,0,0.06),transparent_34%)] dark:[background:radial-gradient(circle_at_0%_0%,rgba(255,255,255,0.07),transparent_30%),radial-gradient(circle_at_100%_100%,rgba(255,255,255,0.06),transparent_34%)]" />

        <div className="relative">
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45 }}
            className="text-center text-xs uppercase tracking-[0.28em] text-zinc-500 dark:text-zinc-400"
          >
            {"// technologies i use"}
          </motion.p>

          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.06 }}
            className="mt-4 text-center text-2xl sm:text-3xl font-bold tracking-tight text-zinc-900 dark:text-white"
          >
            Engineering <span className="text-violet-600 dark:text-violet-400">Toolkit</span>
          </motion.h2>
        </div>

        <div className="relative mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {technologyCategories.map((category, categoryIndex) => (
            <motion.article
              key={category.title}
              initial={{ opacity: 0, y: 26 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.45, delay: categoryIndex * 0.07 }}
              className={`group relative overflow-hidden rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5 shadow-[0_10px_24px_rgba(0,0,0,0.06)] dark:shadow-[0_10px_24px_rgba(0,0,0,0.3)] transition-transform duration-300 hover:-translate-y-1 ${cardAngles[categoryIndex % cardAngles.length]}`}
            >
              <div className="pointer-events-none absolute inset-0 opacity-30 [background-image:linear-gradient(rgba(0,0,0,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.1)_1px,transparent_1px)] [background-size:18px_18px] dark:[background-image:linear-gradient(rgba(255,255,255,0.07)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.07)_1px,transparent_1px)]" />

              <div className="relative mb-4 flex items-center justify-between">
                <h3 className="text-[11px] uppercase tracking-[0.18em] text-zinc-700 dark:text-zinc-300">
                  {category.title}
                </h3>
                <span className="font-mono text-[11px] text-zinc-500 dark:text-zinc-400">
                  {String(categoryIndex + 1).padStart(2, "0")}
                </span>
              </div>

              <div className="relative flex flex-wrap gap-2.5">
                {category.items.map((item) => {
                  const Icon = monoIcons[item.icon] ?? TbDatabase;

                  return (
                    <div
                      key={item.name}
                      className="inline-flex items-center gap-2 rounded-full border border-zinc-200 dark:border-zinc-700 bg-zinc-100/80 dark:bg-zinc-800/70 px-3 py-1.5 text-zinc-700 dark:text-zinc-200 transition-colors group-hover:border-zinc-300 dark:group-hover:border-zinc-600"
                    >
                      <Icon className="h-3.5 w-3.5 shrink-0" />
                      <span className="text-xs whitespace-nowrap">{item.name}</span>
                    </div>
                  );
                })}
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </SectionBorder>
  );
}
