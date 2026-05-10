"use client";

import { useEffect } from "react";
import Link from "next/link";
import { RefreshCw, Home } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen bg-brutal-grid flex items-center justify-center px-6 py-16">
      <div className="relative max-w-lg w-full bg-[var(--surface)] border-[2.5px] border-[var(--ink)] p-8 sm:p-12 shadow-[10px_10px_0_0_var(--ink)]">
        <div className="absolute -top-4 -left-4 inline-flex items-center gap-2 px-3 py-1 bg-[var(--ink)] text-[var(--paper)] border-[2.5px] border-[var(--ink)] shadow-[3px_3px_0_0_var(--ink)] font-mono font-bold text-[11px] tracking-[0.22em] uppercase -rotate-sticker-2">
          <span className="w-1.5 h-1.5 bg-[var(--paper)]" />
          Error 500
        </div>

        <h1 className="font-display text-4xl sm:text-5xl font-bold tracking-[-0.04em] text-[var(--ink)] mb-4">
          Something broke.
        </h1>
        <p className="text-sm text-[var(--muted)] mb-8 leading-relaxed">
          An unexpected error occurred. The page failed to render correctly.
          {error.digest && (
            <span className="block mt-2 font-mono text-xs">digest: {error.digest}</span>
          )}
        </p>

        <div className="flex flex-col sm:flex-row gap-3">
          <button onClick={reset} className="brutal-btn">
            <RefreshCw className="w-4 h-4" />
            Try again
          </button>
          <Link href="/" className="brutal-btn brutal-btn-secondary">
            <Home className="w-4 h-4" />
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}
