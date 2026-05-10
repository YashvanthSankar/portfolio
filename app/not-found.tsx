"use client";

import Link from "next/link";
import { ArrowLeft, Home, Compass } from "lucide-react";
import { BrutalButton } from "@/components/ui/brutal";

export default function NotFound() {
  return (
    <div className="relative min-h-screen bg-brutal-grid flex items-center justify-center px-6 py-24 overflow-hidden">
      {/* Giant 404 wordmark in the background */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 flex items-center justify-center select-none"
      >
        <span
          className="font-display font-bold leading-none tracking-[-0.05em] text-[var(--ink)] opacity-[0.04] dark:opacity-[0.06]"
          style={{ fontSize: "clamp(20rem, 60vw, 60rem)" }}
        >
          404
        </span>
      </div>

      <div className="relative max-w-xl w-full">
        {/* Sticker tag */}
        <div className="inline-flex items-center gap-2 px-3 py-1 mb-8 border-[2.5px] border-[var(--ink)] bg-[var(--ink)] text-[var(--paper)] shadow-[3px_3px_0_0_var(--ink)] font-mono font-bold text-[11px] tracking-[0.22em] uppercase -rotate-sticker-2">
          <Compass className="w-3 h-3" />
          Off the map
        </div>

        <h1
          className="font-display font-bold leading-[0.92] tracking-[-0.05em] text-[var(--ink)] mb-6"
          style={{ fontSize: "clamp(2.5rem, 7vw, 5rem)" }}
        >
          You wandered into{" "}
          <span className="inline-block bg-[var(--ink)] text-[var(--paper)] border-[3px] border-[var(--ink)] px-3 shadow-[8px_8px_0_0_var(--ink)] -rotate-1">
            empty space.
          </span>
        </h1>

        <p className="text-base text-[var(--muted)] mb-10 leading-relaxed max-w-md">
          The page you&apos;re looking for doesn&apos;t exist — or it moved while
          you weren&apos;t looking. The grid above doesn&apos;t mind. You can
          rejoin the rest of the site below.
        </p>

        {/* Coordinates strip — editorial brutalist detail */}
        <div className="grid grid-cols-3 gap-2 mb-10 max-w-sm">
          {[
            { k: "Status", v: "404" },
            { k: "Layer", v: "void" },
            { k: "Action", v: "rejoin" },
          ].map((c) => (
            <div
              key={c.k}
              className="border-[2.5px] border-[var(--ink)] bg-[var(--surface)] p-2 text-center shadow-[2px_2px_0_0_var(--ink)]"
            >
              <p className="font-mono text-[9px] font-bold tracking-[0.22em] uppercase text-[var(--muted)]">
                {c.k}
              </p>
              <p className="font-display font-bold text-sm text-[var(--ink)] mt-0.5 tabular-nums">
                {c.v}
              </p>
            </div>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row items-start gap-3">
          <BrutalButton as="link" href="/" variant="primary" size="lg">
            <Home className="w-4 h-4" />
            Take me home
          </BrutalButton>
          <Link
            href="/work"
            className="inline-flex items-center gap-2 px-5 py-3 border-[2.5px] border-[var(--ink)] bg-[var(--surface)] text-[var(--ink)] font-display font-bold shadow-[6px_6px_0_0_var(--ink)] transition-[transform,box-shadow] duration-200 ease-[cubic-bezier(0.32,0.72,0,1)] hover:-translate-x-[3px] hover:-translate-y-[3px] hover:shadow-[9px_9px_0_0_var(--ink)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[2px_2px_0_0_var(--ink)]"
          >
            <ArrowLeft className="w-4 h-4" />
            Browse work
          </Link>
        </div>
      </div>
    </div>
  );
}
