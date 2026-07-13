"use client";

import { ArrowLeft, Home } from "lucide-react";
import { Button } from "@/components/ui/primitives";

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center px-6 py-24">
      <div className="w-full max-w-md text-center">
        <p className="font-mono text-[13px] tracking-[0.2em] text-faint">404</p>
        <h1 className="mt-4 text-3xl font-semibold tracking-tight text-ink md:text-4xl">
          Page not found.
        </h1>
        <p className="mx-auto mt-4 max-w-sm text-[15px] leading-relaxed text-muted">
          The page you&apos;re looking for doesn&apos;t exist, or it moved
          while you weren&apos;t looking.
        </p>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
          <Button as="link" href="/" size="lg">
            <Home className="h-4 w-4" />
            Take me home
          </Button>
          <Button as="link" href="/work" variant="secondary" size="lg">
            <ArrowLeft className="h-4 w-4" />
            Browse work
          </Button>
        </div>
      </div>
    </div>
  );
}
