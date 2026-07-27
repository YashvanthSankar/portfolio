"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Home, RefreshCw } from "lucide-react";

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
    <div className="flex min-h-screen items-center bg-[var(--bg-0)] px-[var(--gutter)]">
      <div className="mx-auto w-full max-w-[var(--container)]">
        <div className="mb-8 flex items-center gap-3">
          <span className="meta text-[var(--accent)]">500</span>
          <span className="h-px w-8 bg-[var(--line-2)]" />
          <span className="meta">something broke</span>
        </div>

        <h1 className="display-lg mb-6 max-w-2xl">
          That didn&apos;t <span className="serif-accent">render</span>.
        </h1>

        <p className="lead mb-3 max-w-md">
          An unexpected error occurred while loading this page.
        </p>
        {error.digest && (
          <p className="meta mb-10">digest: {error.digest}</p>
        )}

        <div className="mt-10 flex flex-wrap items-center gap-3">
          <button onClick={reset} className="btn btn-primary">
            <RefreshCw className="h-4 w-4" />
            Try again
          </button>
          <Link href="/" className="btn btn-outline">
            <Home className="h-4 w-4" />
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}
