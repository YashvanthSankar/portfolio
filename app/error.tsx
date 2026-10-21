"use client";

import { useEffect } from "react";
import Link from "next/link";

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
    <main id="main-content" className="col pt-16 sm:pt-24">
      <h1 className="h-page">Something broke.</h1>
      <p className="mt-4 text-muted">An unexpected error occurred while loading this page.</p>
      {error.digest && <p className="small mt-2 text-muted">Digest: {error.digest}</p>}
      <p className="mt-8 flex flex-wrap items-center gap-5">
        <button onClick={reset} className="btn">
          Try again
        </button>
        <Link href="/" className="link small">
          Go home
        </Link>
      </p>
    </main>
  );
}
