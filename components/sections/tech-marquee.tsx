"use client";

import { motion } from "framer-motion";

import { technologies } from "@/data/technologies";

export function TechMarquee() {
  const duplicatedTech = [...technologies, ...technologies];

  return (
    <section className="py-16 bg-zinc-950 border-y border-zinc-900 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-40 bg-zinc-800/30 rounded-full blur-3xl" />
      </div>
      <div className="max-w-6xl mx-auto px-6 mb-10">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center text-sm uppercase tracking-widest text-zinc-500 font-medium"
        >
          Technologies I Work With
        </motion.h2>
      </div>

      {/* Marquee Container */}
      <div className="relative overflow-hidden">
        {/* Fade edges */}
        <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-zinc-950 to-transparent z-10" />
        <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-zinc-950 to-transparent z-10" />

        {/* Marquee Track */}
        <motion.div
          className="flex gap-8 py-4"
          animate={{ x: ["0%", "-50%"] }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear",
          }}
        >
          {duplicatedTech.map((tech, index) => (
            <div
              key={`${tech.name}-${index}`}
              className="flex items-center gap-3 shrink-0 px-5 py-3 rounded-full bg-zinc-900/50 border border-zinc-800 hover:border-zinc-700 transition-colors"
            >
              <div className="w-8 h-8 rounded-lg bg-zinc-800 flex items-center justify-center text-xs font-bold text-zinc-400">
                {tech.abbr}
              </div>
              <span className="text-zinc-300 font-medium whitespace-nowrap">
                {tech.name}
              </span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
