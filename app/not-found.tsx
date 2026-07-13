import Link from "next/link";
import { ArrowLeft, ArrowUpRight } from "lucide-react";

export default function NotFound() {
  return (
    <main id="main-content" className="site-container flex min-h-screen items-center py-20">
      <div className="max-w-3xl">
        <span className="eyebrow">404 · Not found</span>
        <h1 className="mt-7 text-[clamp(3.5rem,9vw,8rem)] font-medium leading-[0.92] tracking-[-0.07em]">Nothing lives here.</h1>
        <p className="mt-6 max-w-lg text-base leading-7 text-[var(--muted)]">
          The page may have moved, or the link may be incomplete. The rest of the portfolio is still where you left it.
        </p>
        <div className="mt-9 flex flex-wrap gap-3">
          <Link href="/" className="button-primary"><ArrowLeft className="h-4 w-4" />Go home</Link>
          <Link href="/work" className="button-secondary">Browse work<ArrowUpRight className="h-4 w-4" /></Link>
        </div>
      </div>
    </main>
  );
}
