"use client";

import { useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, RotateCcw } from "lucide-react";

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => console.error(error), [error]);

  return (
    <main id="main-content" className="site-container flex min-h-screen items-center py-20">
      <div className="max-w-2xl">
        <span className="eyebrow">Something went wrong</span>
        <h1 className="mt-7 text-[clamp(3rem,8vw,6rem)] font-medium leading-[0.94] tracking-[-0.065em]">A temporary interruption.</h1>
        <p className="mt-6 max-w-lg text-base leading-7 text-[var(--muted)]">
          The page could not finish loading. Try once more, or return home.
        </p>
        <div className="mt-9 flex flex-wrap gap-3">
          <button type="button" onClick={reset} className="button-primary"><RotateCcw className="h-4 w-4" />Try again</button>
          <Link href="/" className="button-secondary"><ArrowLeft className="h-4 w-4" />Go home</Link>
        </div>
      </div>
    </main>
  );
}
