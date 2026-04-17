"use client";

import Link from "next/link";
import { ArrowLeft, Home } from "lucide-react";
import { BrutalButton } from "@/components/ui/brutal";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-brutal-grid flex items-center justify-center px-6 py-24">
      <div className="relative max-w-xl w-full text-center">
        {/* 404 block */}
        <div className="relative inline-block mb-8">
          <span className="font-display font-bold text-[120px] sm:text-[180px] leading-none text-[var(--ink)] block">
            404
          </span>
          <span className="absolute -top-6 -right-8 px-3 py-1 bg-[var(--accent)] text-[var(--accent-ink)] border-[2.5px] border-[var(--border-ink)] shadow-[4px_4px_0_0_var(--border-ink)] font-display font-bold text-sm tracking-widest uppercase rotate-12">
            Oops
          </span>
        </div>

        <h1 className="font-display text-3xl sm:text-4xl font-bold mb-4">
          Page not <span className="bg-[var(--highlight)] border-[2.5px] border-[var(--border-ink)] px-2 shadow-[4px_4px_0_0_var(--border-ink)] -rotate-sticker-1 inline-block">found</span>
        </h1>
        <p className="text-[var(--muted)] mb-10 leading-relaxed max-w-sm mx-auto">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <BrutalButton as="link" href="/" variant="primary" size="lg">
            <Home className="w-4 h-4" />
            Go home
          </BrutalButton>
          <Link
            href="/work"
            className="inline-flex items-center gap-2 px-5 py-3 border-[2.5px] border-[var(--border-ink)] bg-[var(--surface)] text-[var(--ink)] font-display font-bold shadow-brutal hover:-translate-x-[2px] hover:-translate-y-[2px] hover:shadow-[8px_8px_0_0_var(--border-ink)] transition-transform duration-150"
          >
            <ArrowLeft className="w-4 h-4" />
            Browse work
          </Link>
        </div>
      </div>
    </div>
  );
}
