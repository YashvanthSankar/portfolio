"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ExternalLink, Star, GitFork, Calendar, Code, ArrowLeft, Github, Menu, X } from "lucide-react";
import { CardSpotlight } from "@/components/ui/card-spotlight";
import { GlowingEffect } from "@/components/ui/glowing-effect";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Footer } from "@/components/sections/footer";
import { throttle } from "@/lib/utils";
import Link from "next/link";
import { cn } from "@/lib/utils";

const workNavItems = [
  { id: "back", label: "Back to Main", icon: ArrowLeft, action: "back" },
  { id: "github", label: "GitHub Profile", icon: Github, action: "github" },
];

function WorkNavbar() {
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = throttle(() => {
      setScrolled(window.scrollY > 20);
    }, 16);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleNavClick = (action: string) => {
    setMenuOpen(false);
    if (action === "back") {
      router.push("/");
    } else if (action === "github") {
      window.open("https://github.com/YashvanthSankar", "_blank");
    }
  };

  return (
    <>
      {/* ================= HEADER ================= */}
      <motion.header
        initial={false}
        animate={{ y: 0 }}
        transition={{ duration: 0.2 }}
        className="fixed inset-x-0 top-0 z-50"
      >
        <nav className="mx-auto max-w-screen-lg px-6 py-4">
          <motion.div
            animate={{
              backgroundColor: scrolled ? "rgba(0, 0, 0, 0.4)" : "rgba(0, 0, 0, 0)",
              backdropFilter: scrolled ? "blur(20px)" : "blur(0px)",
            }}
            transition={{ duration: 0.3 }}
            className={cn(
              "flex items-center justify-between rounded-full transition-all duration-300",
              scrolled
                ? "border border-white/10 px-6 py-3 shadow-2xl shadow-black/50"
                : "px-3 py-2"
            )}
          >
            {/* Logo with hover effect */}
            <button
              onClick={() => {
                const mainDomain = process.env.NEXT_PUBLIC_MAIN_DOMAIN || '/';
                window.location.href = mainDomain;
              }}
              className="relative h-12 w-12 rounded-full overflow-hidden ring-2 ring-white/20 hover:ring-white/50 transition-all hover:scale-110 hover:rotate-[5deg] active:scale-95"
            >
              <Image 
                src="/ys.png" 
                alt="YS" 
                fill 
                className="object-cover"
                quality={85}
                placeholder="blur"
                blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg=="
              />
              <div className="absolute inset-0 bg-gradient-to-br from-white/0 to-white/10" />
            </button>

            {/* Desktop Nav with enhanced styling */}
            <div className="hidden md:flex items-center gap-2 relative">
              {workNavItems.map((item) => {
                if (item.id === "back") {
                  const mainDomain = process.env.NEXT_PUBLIC_MAIN_DOMAIN || '/';
                  return (
                    <Link key={item.id} href={mainDomain}>
                      <div
                        className={cn(
                          "relative px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 overflow-hidden hover:scale-105 active:scale-95",
                          "text-zinc-400 hover:text-white"
                        )}
                      >
                        <span className="relative z-10 flex items-center gap-2">
                          <item.icon className="w-4 h-4" />
                          {item.label}
                        </span>
                      </div>
                    </Link>
                  );
                } else {
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleNavClick(item.action)}
                      className={cn(
                        "relative px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 overflow-hidden hover:scale-105 active:scale-95",
                        "text-zinc-400 hover:text-white"
                      )}
                    >
                      <span className="relative z-10 flex items-center gap-2">
                        <item.icon className="w-4 h-4" />
                        {item.label}
                      </span>
                    </button>
                  );
                }
              })}
            </div>

            {/* Mobile Toggle with animation */}
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => setMenuOpen((p) => !p)}
              className="md:hidden text-white p-2 rounded-full hover:bg-white/10 transition"
              aria-label="Toggle menu"
            >
              <AnimatePresence mode="wait">
                {menuOpen ? (
                  <motion.div
                    key="close"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <X />
                  </motion.div>
                ) : (
                  <motion.div
                    key="menu"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Menu />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          </motion.div>
        </nav>
      </motion.header>

      {/* ================= MOBILE MENU ================= */}
      <AnimatePresence>
        {menuOpen && (
          <>
            {/* Enhanced Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMenuOpen(false)}
              className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm"
            />

            {/* Enhanced Bottom Sheet */}
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              drag="y"
              dragConstraints={{ top: 0 }}
              onDragEnd={(_, { offset, velocity }) => {
                if (offset.y > 100 || velocity.y > 500) {
                  setMenuOpen(false);
                }
              }}
              className="fixed bottom-0 left-0 right-0 z-50 bg-zinc-950 border-t border-white/10 rounded-t-3xl overflow-hidden"
            >
              <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/50 to-transparent" />

              {/* CONTENT */}
              <div className="relative z-10 p-6 pt-8 text-white flex flex-col h-full">
                {/* Enhanced Drag Handle */}
                <div className="mx-auto mb-8 h-1.5 w-16 rounded-full bg-white/40 shadow-lg shadow-white/20" />

                {/* Enhanced Menu Items */}
                <div className="space-y-2 flex-1 overflow-y-auto">
                  {workNavItems.map((item, index) => {
                    if (item.id === "back") {
                      const mainDomain = process.env.NEXT_PUBLIC_MAIN_DOMAIN || '/';
                      return (
                        <Link key={item.id} href={mainDomain}>
                          <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className={cn(
                              "w-full flex items-center gap-4 px-6 py-4 rounded-2xl text-left transition-all group",
                              "hover:bg-white/10 text-zinc-300"
                            )}
                          >
                            <div className="p-2 rounded-xl bg-white/10 group-hover:bg-white/20 transition-colors">
                              <item.icon className="w-5 h-5" />
                            </div>
                            <span className="font-medium">{item.label}</span>
                          </motion.div>
                        </Link>
                      );
                    } else {
                      return (
                        <motion.button
                          key={item.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                          onClick={() => handleNavClick(item.action)}
                          className={cn(
                            "w-full flex items-center gap-4 px-6 py-4 rounded-2xl text-left transition-all group",
                            "hover:bg-white/10 text-zinc-300"
                          )}
                        >
                          <div className="p-2 rounded-xl bg-white/10 group-hover:bg-white/20 transition-colors">
                            <item.icon className="w-5 h-5" />
                          </div>
                          <span className="font-medium">{item.label}</span>
                        </motion.button>
                      );
                    }
                  })}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

interface Repo {
  name: string;
  description: string | null;
  url: string;
  language: string | null;
  stars: number;
  forks: number;
  topics: string[];
  created_at: string;
  updated_at: string;
}

function RepoCard({ repo, index }: { repo: Repo; index: number }) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.05 }}
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
        radius={250}
        color="#1f1f1f"
      >
        <div className="relative z-20">
          {/* Header */}
          <div className="flex items-start justify-between mb-3">
            <h3 className="text-lg font-bold text-white line-clamp-1">
              {repo.name}
            </h3>
            <a
              href={repo.url}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 transition-colors shrink-0"
            >
              <ExternalLink className="w-4 h-4 text-zinc-400" />
            </a>
          </div>

          {/* Description */}
          <p className="text-zinc-400 text-sm leading-relaxed mb-4 line-clamp-3">
            {repo.description || "No description available"}
          </p>

          {/* Language & Stats */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              {repo.language && (
                <div className="flex items-center gap-1">
                  <Code className="w-3 h-3 text-zinc-500" />
                  <span className="text-xs text-zinc-500">{repo.language}</span>
                </div>
              )}
              <div className="flex items-center gap-1">
                <Star className="w-3 h-3 text-zinc-500" />
                <span className="text-xs text-zinc-500">{repo.stars}</span>
              </div>
              <div className="flex items-center gap-1">
                <GitFork className="w-3 h-3 text-zinc-500" />
                <span className="text-xs text-zinc-500">{repo.forks}</span>
              </div>
            </div>
          </div>

          {/* Topics */}
          {repo.topics.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {repo.topics.slice(0, 3).map((topic) => (
                <span
                  key={topic}
                  className="px-2 py-1 text-xs rounded-full bg-zinc-800/50 text-zinc-400 border border-zinc-700/50"
                >
                  {topic}
                </span>
              ))}
            </div>
          )}

          {/* Dates */}
          <div className="flex items-center justify-between text-xs text-zinc-600">
            <div className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              <span>Created {formatDate(repo.created_at)}</span>
            </div>
            <div className="text-zinc-600">
              Updated {formatDate(repo.updated_at)}
            </div>
          </div>
        </div>
      </CardSpotlight>
    </motion.div>
  );
}

export default function WorkPage() {
  const [repos, setRepos] = useState<Repo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRepos = async () => {
      try {
        const response = await fetch('/repos.json');
        if (!response.ok) {
          throw new Error('Failed to load repositories');
        }
        const data = await response.json();
        // Sort by stars (descending) and then by updated date (descending)
        const sortedRepos = data.sort((a: Repo, b: Repo) => {
          if (a.stars !== b.stars) {
            return b.stars - a.stars;
          }
          return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime();
        });
        setRepos(sortedRepos);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchRepos();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="text-white">Loading repositories...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="text-red-400">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950">
      <WorkNavbar />

      <div className="pt-24">
        <div className="max-w-6xl mx-auto px-6 py-0">
          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-16"
          >
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              My Work
            </h1>
            <p className="text-zinc-400 text-lg max-w-2xl">
              A comprehensive collection of my GitHub repositories, showcasing projects
              across various technologies and domains.
            </p>
            <div className="mt-4 text-zinc-500">
              Total repositories: {repos.length}
            </div>
          </motion.div>

          {/* Repositories Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {repos.map((repo, index) => (
              <RepoCard key={repo.name} repo={repo} index={index} />
            ))}
          </div>

          {/* GitHub Link */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-16 mb-16 text-center"
          >
            <a
              href="https://github.com/YashvanthSankar"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-zinc-400 hover:text-white transition-colors group"
            >
              <span>View all on GitHub</span>
              <ExternalLink className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </a>
          </motion.div>
        </div>
      </div>

      <Footer />
    </div>
  );
}