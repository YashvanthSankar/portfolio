"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Spotlight } from "@/components/ui/spotlight";
import { TextGenerateEffect } from "@/components/ui/text-generate-effect";
import { FlipWords } from "@/components/ui/flip-words";
import { Button } from "@/components/ui/moving-border";
import { Boxes } from "@/components/ui/background-boxes";
import { shouldAnimate } from "@/lib/utils";

export function SpotlightHero() {
  const animate = shouldAnimate();

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-zinc-950 pt-20 md:pt-24"
    >
      {/* Aceternity Spotlight Effect */}
      <Spotlight
        className="-top-40 left-0 md:left-60 md:-top-20"
        fill="white"
      />

      {/* Aceternity Background Boxes - Interactive */}
      <div className="absolute inset-0 w-full h-full overflow-hidden z-[5] opacity-60">
        <Boxes />
      </div>

      {/* Gradient Orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-violet-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 text-center pointer-events-none">
        {/* Profile Picture - Professional circular frame with glow */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="mb-6 flex justify-center"
        >
            <div className="relative">
              {/* Subtle glow behind photo */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-500/20 to-violet-500/20 blur-xl scale-110" />
              
              {/* Photo container */}
              <div className="relative w-24 h-24 sm:w-32 sm:h-32 md:w-36 md:h-36 rounded-full overflow-hidden border-2 border-zinc-700/50 shadow-2xl shadow-black/50">
                <Image
                  src="/yashvanths.jpeg"
                  alt="Yashvanth S"
                  fill
                  className="object-cover object-center"
                  priority
                  quality={85}
                  placeholder="blur"
                  blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R+IRjWjBqO6O2mhP//Z"
                  sizes="(max-width: 640px) 96px, (max-width: 768px) 128px, 144px"
                />
              </div>
              
              {/* Online indicator */}
              <div className="absolute bottom-1 right-1 w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-emerald-500 border-4 border-zinc-950" />
            </div>
          </motion.div>

        {/* Badge */}
        {/* <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 mb-6 rounded-full bg-zinc-900/80 border border-zinc-800 backdrop-blur-sm"
        >
          <span className="text-xs sm:text-sm text-zinc-400">Available for freelance & full-time opportunities</span>
        </motion.div> */}

        {/* Headline with FlipWords */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
          className="mb-6"
        >
            <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight text-white">
              <span className="block">I build</span>
              <span className="block h-[1.2em] overflow-hidden">
                <FlipWords 
                  words={["stunning websites", "web apps", "AI solutions", "digital products"]} 
                  duration={2500}
                  className="text-white bg-clip-text backdrop-blur-sm mix-blend-screen drop-shadow-[0_8px_32px_rgba(255,255,255,0.10)]"
                />
              </span>
              <span className="block text-zinc-400">
                that make an impact
              </span>
            </h1>
          </motion.div>

        {/* Subtext with Text Generate Effect */}
        <div className="max-w-2xl mx-auto mb-8 sm:mb-10 px-2">
          <TextGenerateEffect
            words="I'm Yashvanth, a full-stack developer crafting high-performance web applications and AI-powered solutions. Currently studying at IIITDM Kancheepuram."
            className="text-base sm:text-lg md:text-xl text-zinc-400 leading-relaxed font-normal"
            duration={0.3}
          />
        </div>

        {/* CTAs with Moving Border */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.4 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 pointer-events-auto px-2"
        >
            <Link href="/work">
              <Button
                borderRadius="9999px"
                containerClassName="h-12 sm:h-14 w-40 sm:w-44"
                borderClassName="bg-[radial-gradient(#3b82f6_40%,transparent_60%)]"
                className="bg-zinc-950 border-zinc-800 hover:bg-zinc-900 transition-colors text-sm sm:text-base"
                duration={3000}
              >
                <span className="flex items-center gap-2">
                  View My Work
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </span>
              </Button>
            </Link>

            <a
              href="#contact"
              className="px-6 sm:px-8 py-3 sm:py-4 rounded-full font-medium text-sm sm:text-base text-zinc-400 border border-zinc-800 hover:bg-zinc-900 hover:text-white transition-colors"
            >
              Get in Touch
            </a>
          </motion.div>
      </div>
    </section>
  );
}