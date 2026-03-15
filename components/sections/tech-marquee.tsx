"use client";

import { motion } from "framer-motion";
import { technologies } from "@/data/technologies";

export function TechMarquee() {
  const duplicated = [...technologies, ...technologies];

  return (
    <section className="py-12 relative overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 mb-8">
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center text-xs uppercase tracking-widest text-zinc-400 dark:text-zinc-500"
        >
          {"// technologies i work with"}
        </motion.p>
      </div>

      <div className="relative overflow-hidden">
        <div className="absolute left-0 top-0 bottom-0 w-12 sm:w-20 bg-gradient-to-r from-white/90 dark:from-zinc-950/90 to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-12 sm:w-20 bg-gradient-to-l from-white/90 dark:from-zinc-950/90 to-transparent z-10 pointer-events-none" />

        <motion.div
          className="flex gap-3 py-2"
          animate={{ x: ["0%", "-50%"] }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
        >
          {duplicated.map((tech, i) => (
            <div
              key={`${tech.name}-${i}`}
              className="flex items-center gap-2 shrink-0 px-4 py-2 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 hover:border-violet-300 dark:hover:border-violet-700 transition-colors"
            >
              <span className="text-[10px] font-bold text-violet-600 dark:text-violet-400 w-6 text-center shrink-0">{tech.abbr}</span>
              <span className="text-xs text-zinc-600 dark:text-zinc-400 whitespace-nowrap">{tech.name}</span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
