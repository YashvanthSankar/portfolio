import Link from "next/link";
import { ArrowLeft, ArrowUpRight } from "lucide-react";

export default function NotFound() {
  return (
    <div className="relative flex min-h-screen items-center overflow-hidden bg-[var(--bg-0)] px-[var(--gutter)]">
      {/* Ambient field */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(55% 60% at 70% 35%, rgba(200,240,75,0.07), transparent 60%)",
        }}
      />

      <div className="relative mx-auto w-full max-w-[var(--container)]">
        <div className="mb-8 flex items-center gap-3">
          <span className="meta text-[var(--accent)]">404</span>
          <span className="h-px w-8 bg-[var(--line-2)]" />
          <span className="meta">page not found</span>
        </div>

        <h1 className="display-xl mb-7 max-w-3xl">
          This page doesn&apos;t <span className="serif-accent">exist</span>.
        </h1>

        <p className="lead mb-10 max-w-md">
          The link is broken, or the page moved. Everything else is still where you
          left it.
        </p>

        <div className="flex flex-wrap items-center gap-3">
          <Link href="/" className="btn btn-primary">
            <ArrowLeft className="h-4 w-4" />
            Back home
          </Link>
          <Link href="/work" className="btn btn-outline">
            Browse work
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
