"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Download, ArrowUpRight } from "lucide-react";

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1, delayChildren: 0.1 } },
};

const reveal = {
  hidden: { opacity: 0, y: 20, filter: "blur(4px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
  },
};

export function SpotlightHero() {
  return (
    <section
      id="home"
      className="relative min-h-[100dvh] flex items-center overflow-hidden border-b border-zinc-200 dark:border-zinc-800"
    >
      {/* Grain texture */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.02] dark:opacity-[0.035]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundSize: "180px 180px",
        }}
      />

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="relative z-10 w-full max-w-6xl mx-auto px-6 sm:px-10 pt-28 pb-24"
      >
        {/* Availability badge */}
        <motion.div variants={reveal} className="mb-10">
          <span className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full border border-zinc-200 dark:border-zinc-800 bg-white/70 dark:bg-zinc-950/70 text-[10px] tracking-[0.18em] uppercase text-zinc-500 dark:text-zinc-400">
            <span className="relative flex h-1.5 w-1.5 shrink-0">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
            </span>
            open to opportunities
          </span>
        </motion.div>

        {/* Name */}
        <motion.h1
          variants={reveal}
          className="font-bold tracking-[-0.04em] leading-[0.9] select-none mb-7"
          style={{ fontSize: "clamp(3.5rem, 9vw, 7.5rem)" }}
        >
          <span
            className="bg-gradient-to-b from-zinc-900 via-zinc-800 to-zinc-500
              dark:from-white dark:via-zinc-100 dark:to-zinc-500
              bg-clip-text text-transparent"
          >
            Yashvanth
          </span>
          {" "}
          <span
            className="text-transparent"
            style={{ WebkitTextStroke: "2px #a1a1aa" }}
          >
            S
          </span>
        </motion.h1>

        {/* Role + description */}
        <motion.div variants={reveal} className="mb-10 max-w-xl">
          <p className="font-mono text-[11px] tracking-[0.24em] uppercase text-zinc-500 dark:text-zinc-400 mb-4">
            Full-Stack Developer & AI Engineer
          </p>
          <p className="font-mono text-base sm:text-lg text-zinc-700 dark:text-zinc-300 leading-[1.75]">
            Building fast, impactful products for the modern web and AI-first workflows.{" "}
            <span className="text-zinc-500 dark:text-zinc-400">
              CS student at IIITDM Kancheepuram.
            </span>
          </p>
        </motion.div>

        {/* CTAs */}
        <motion.div variants={reveal} className="flex flex-wrap items-center gap-3">
          <Link
            href="/work"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl
                       bg-zinc-900 dark:bg-white text-white dark:text-zinc-900
                       text-sm font-semibold
                       hover:bg-zinc-700 dark:hover:bg-zinc-100
                       transition-colors duration-200"
          >
            view my work
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>

          <a
            href="#contact"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl
                       border border-zinc-200 dark:border-zinc-800
                       text-zinc-600 dark:text-zinc-300 text-sm font-medium
                       hover:border-zinc-300 dark:hover:border-zinc-700
                       hover:text-zinc-900 dark:hover:text-white
                       transition-all duration-200"
          >
            get in touch
          </a>

          <a
            href="/YashvanthS_Resume.pdf"
            download
            className="inline-flex items-center gap-1.5 px-4 py-3
                       text-[10.5px] tracking-[0.18em] uppercase
                       text-zinc-400 dark:text-zinc-600
                       hover:text-zinc-600 dark:hover:text-zinc-400
                       transition-colors duration-150"
          >
            <Download className="w-3 h-3" />
            resume
          </a>
        </motion.div>

        {/* Stats */}
        <motion.div variants={reveal} className="mt-16 flex items-center gap-8 sm:gap-12">
          {[
            { value: "15+", label: "projects shipped" },
            { value: "4+",  label: "years building"   },
            { value: "IIITDM", label: "Kancheepuram"  },
          ].map(({ value, label }) => (
            <div key={label} className="flex flex-col gap-0.5">
              <span className="text-lg sm:text-xl font-bold tracking-tight text-zinc-800 dark:text-zinc-200">
                {value}
              </span>
              <span className="text-[10px] tracking-[0.16em] uppercase text-zinc-400 dark:text-zinc-600">
                {label}
              </span>
            </div>
          ))}
        </motion.div>
      </motion.div>

      {/* Scroll cue */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.6, duration: 0.9 }}
        className="absolute bottom-7 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 5, 0] }}
          transition={{ repeat: Infinity, duration: 2.4, ease: "easeInOut" }}
          className="flex flex-col items-center gap-1"
        >
          <span className="text-[9px] tracking-[0.25em] uppercase text-zinc-400 dark:text-zinc-600">scroll</span>
          <div className="w-px h-6 bg-gradient-to-b from-zinc-400 to-transparent dark:from-zinc-600" />
        </motion.div>
      </motion.div>
    </section>
  );
}
