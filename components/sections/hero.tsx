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
      {/* Subtle radial gradient background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[20%] -left-[10%] w-[55vw] h-[55vh] rounded-full bg-violet-500/[0.07] dark:bg-violet-500/[0.11] blur-[80px]" />
        <div className="absolute bottom-0 right-0 w-[35vw] h-[35vh] rounded-full bg-cyan-500/[0.05] dark:bg-cyan-500/[0.08] blur-[70px]" />
      </div>

      {/* Grain texture */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.025] dark:opacity-[0.04]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundSize: "180px 180px",
        }}
      />

      {/* Main content — left aligned */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="relative z-10 w-full max-w-6xl mx-auto px-6 sm:px-10 pt-28 pb-24"
      >
        {/* Availability badge */}
        <motion.div variants={reveal} className="mb-10">
          <span className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full border border-zinc-200/80 dark:border-zinc-800 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md text-[10px] tracking-[0.18em] uppercase text-zinc-500 dark:text-zinc-400 shadow-sm">
            <span className="relative flex h-1.5 w-1.5 shrink-0">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
            </span>
            open to work
          </span>
        </motion.div>

        {/* Name */}
        <motion.h1
          variants={reveal}
          className="font-bold tracking-[-0.04em] leading-[0.9] select-none mb-7
            bg-gradient-to-b from-zinc-900 via-zinc-800 to-zinc-500
            dark:from-white dark:via-zinc-100 dark:to-zinc-500
            bg-clip-text text-transparent"
          style={{ fontSize: "clamp(3.5rem, 9vw, 7.5rem)" }}
        >
          Yashvanth S
        </motion.h1>

        {/* Role + description row */}
        <motion.div variants={reveal} className="mb-10 max-w-xl">
          <p className="text-[11px] tracking-[0.24em] uppercase text-zinc-400 dark:text-zinc-500 mb-4">
            Full-Stack Developer
          </p>
          <p className="text-base sm:text-lg text-zinc-500 dark:text-zinc-400 leading-[1.75]">
            Building fast, impactful software for the modern web.{" "}
            <span className="text-zinc-400 dark:text-zinc-500">
              CS student at IIITDM Kancheepuram.
            </span>
          </p>
        </motion.div>

        {/* CTAs */}
        <motion.div
          variants={reveal}
          className="flex flex-wrap items-center gap-3"
        >
          <Link
            href="/work"
            className="group relative overflow-hidden inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 text-sm font-semibold transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] shadow-md shadow-zinc-900/10 dark:shadow-white/5"
          >
            <span
              aria-hidden
              className="absolute inset-0 -skew-x-[20deg] translate-x-[-120%] group-hover:translate-x-[120%] transition-transform duration-500 bg-gradient-to-r from-transparent via-white/[0.12] to-transparent"
            />
            <span className="relative">view my work</span>
            <ArrowUpRight className="relative w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>

          <a
            href="#contact"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-300 text-sm font-medium transition-all duration-200 hover:border-violet-300 dark:hover:border-violet-800/70 hover:text-violet-600 dark:hover:text-violet-400 hover:bg-violet-50/60 dark:hover:bg-violet-950/25 hover:scale-[1.02] active:scale-[0.98]"
          >
            get in touch
          </a>

          <a
            href="/YashvanthS_Resume.pdf"
            download
            className="inline-flex items-center gap-1.5 px-4 py-3 text-[10.5px] tracking-[0.18em] uppercase text-zinc-400 dark:text-zinc-600 hover:text-zinc-600 dark:hover:text-zinc-400 transition-colors duration-150"
          >
            <Download className="w-3 h-3" />
            resume
          </a>
        </motion.div>

        {/* Stats row */}
        <motion.div
          variants={reveal}
          className="mt-16 flex items-center gap-8 sm:gap-12"
        >
          {[
            { value: "15+", label: "projects shipped" },
            { value: "4+", label: "years building" },
            { value: "IIITDM", label: "Kancheepuram" },
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
        className="absolute bottom-7 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1"
      >
        <motion.div
          animate={{ y: [0, 5, 0] }}
          transition={{ repeat: Infinity, duration: 2.4, ease: "easeInOut" }}
          className="flex flex-col items-center gap-1"
        >
          <span className="text-[9px] tracking-[0.25em] uppercase text-zinc-300 dark:text-zinc-700">
            scroll
          </span>
          <div className="w-px h-6 bg-gradient-to-b from-zinc-300 to-transparent dark:from-zinc-700" />
        </motion.div>
      </motion.div>
    </section>
  );
}
