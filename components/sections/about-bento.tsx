"use client";

import { motion } from "framer-motion";
import { MapPin, Mail, Check, Copy } from "lucide-react";
import { useState } from "react";
import Image from "next/image";
import { GlowingEffect } from "@/components/ui/glowing-effect";
import { CardSpotlight } from "@/components/ui/card-spotlight";

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleCopy}
      className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors"
    >
      {copied ? (
        <>
          <Check className="w-4 h-4 text-emerald-500" />
          <span className="text-emerald-500">Copied!</span>
        </>
      ) : (
        <>
          <Copy className="w-4 h-4" />
          <span>Copy Email</span>
        </>
      )}
    </button>
  );
}

const stats = [
  { label: "Projects Completed", value: "15+" },
  { label: "Technologies", value: "20+" },
  { label: "Current GPA", value: "9.27" },
  { label: "Years Coding", value: "4+" },
];

export function AboutBento() {
  return (
    <section id="about" className="py-24 bg-zinc-950 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-1/4 w-72 h-72 bg-blue-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-violet-500/5 rounded-full blur-3xl" />
        {/* Subtle grid */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px]" />
      </div>
      <div className="relative z-10 max-w-6xl mx-auto px-6">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            About Me
          </h2>
          <p className="text-zinc-400 max-w-xl">
            A passionate developer focused on creating impactful digital experiences.
          </p>
        </motion.div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Main Bio Card - Large */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="md:col-span-2 relative rounded-2xl"
          >
            <GlowingEffect
              spread={40}
              glow={true}
              disabled={false}
              proximity={64}
              inactiveZone={0.01}
              borderWidth={2}
            />
            <CardSpotlight
              className="h-full p-8 bg-zinc-950 border-zinc-800 rounded-2xl"
              radius={790}
              color="#3a3a3a"
            >
              <div className="relative z-30 flex flex-col md:flex-row gap-6">
                {/* Avatar (replace initials with your photo at /public/profile.jpg) */}
                <div className="relative w-24 h-24 rounded-2xl overflow-hidden shrink-0 flex items-center justify-center mx-auto md:mx-0 ring-1 ring-white/5 shadow-sm">
                  <Image
                    src="/yashvanths.jpeg"
                    alt="Yashvanth S"
                    width={96}
                    height={96}
                    className="object-cover w-full h-full"
                    priority
                    quality={85}
                    placeholder="blur"
                    blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R+IRjWjBqO6O2mhP//Z"
                  />
                </div>

                <div>
                  <h3 className="text-2xl font-bold text-white mb-2">
                    Yashvanth S
                  </h3>
                  <p className="text-zinc-400 leading-relaxed">
                    I&apos;m a Computer Science student at IIITDM Kancheepuram pursuing 
                    an integrated BTech + MTech degree. I specialize in building 
                    full-stack web applications and AI-powered solutions that solve 
                    real-world problems. When I&apos;m not coding, you&apos;ll find me 
                    exploring new technologies and contributing to open-source projects.
                  </p>
                </div>
              </div>
            </CardSpotlight>
          </motion.div>

          {/* Location Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="relative rounded-2xl"
          >
            <GlowingEffect
              spread={40}
              glow={true}
              disabled={false}
              proximity={64}
              inactiveZone={0.01}
              borderWidth={2}
            />
            <CardSpotlight
              className="h-full p-6 bg-zinc-950 border-zinc-800 rounded-2xl"
              radius={280}
              color="#3a3a3a"
            >
              <div className="relative z-30 flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg bg-zinc-800">
                  <MapPin className="w-5 h-5 text-zinc-400" />
                </div>
                <span className="text-sm text-zinc-500 uppercase tracking-wide">
                  Location
                </span>
              </div>
              <p className="text-xl font-semibold text-white relative z-30">Chennai, India</p>
              <p className="text-zinc-500 text-sm mt-1 relative z-30">IIITDM Kancheepuram</p>
            </CardSpotlight>
          </motion.div>

          {/* Email Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="relative rounded-2xl"
          >
            <GlowingEffect
              spread={40}
              glow={true}
              disabled={false}
              proximity={64}
              inactiveZone={0.01}
              borderWidth={2}
            />
            <CardSpotlight
              className="h-full p-6 bg-zinc-950 border-zinc-800 rounded-2xl"
              radius={400}
              color="#3a3a3a"
            >
              <div className="relative z-30 flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg bg-zinc-800">
                  <Mail className="w-5 h-5 text-zinc-400" />
                </div>
                <span className="text-sm text-zinc-500 uppercase tracking-wide">
                  Contact
                </span>
              </div>
              <p className="text-white font-medium mb-2 relative z-30">yashvanthsankar@gmail.com</p>
              <div className="relative z-30">
                <CopyButton text="yashvanthsankar@gmail.com" />
              </div>
            </CardSpotlight>
          </motion.div>

          {/* Stats Card - Wide */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="md:col-span-2 relative rounded-2xl"
          >
            <GlowingEffect
              spread={40}
              glow={true}
              disabled={false}
              proximity={64}
              inactiveZone={0.01}
              borderWidth={2}
            />
            <CardSpotlight
              className="h-full p-6 bg-zinc-950 border-zinc-800 rounded-2xl"
              radius={650}
              color="#3a3a3a"
            >
              <div className="relative z-30 grid grid-cols-2 md:grid-cols-4 gap-6">
                {stats.map((stat) => (
                  <div key={stat.label} className="text-center">
                    <div className="text-3xl font-bold text-white mb-1">
                      {stat.value}
                    </div>
                    <div className="text-sm text-zinc-500">{stat.label}</div>
                  </div>
                ))}
              </div>
            </CardSpotlight>
          </motion.div>
        </div>
      </div>
    </section>
  );
}