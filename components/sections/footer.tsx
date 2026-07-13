import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { socials } from "@/data/socials";

export function Footer() {
  return (
    <footer className="border-t border-[var(--border-ink)] py-8">
      <div className="site-container flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold tracking-[-0.02em]">Yashvanth Sankar</p>
          <p className="mt-1 text-xs text-[var(--muted)]">Full-stack developer &amp; AI engineer · Chennai</p>
        </div>
        <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
          {socials.slice(0, 3).map((social) => (
            <a key={social.name} href={social.href} {...(!social.noBlank && { target: "_blank", rel: "noopener noreferrer" })} className="text-xs text-[var(--muted)] transition-colors hover:text-[var(--ink)]">
              {social.name}
            </a>
          ))}
          <Link href="/#contact" className="text-link text-xs">Start a project <ArrowUpRight className="arrow-nudge h-3.5 w-3.5" /></Link>
        </div>
        <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-[var(--muted)]">© {new Date().getFullYear()}</p>
      </div>
    </footer>
  );
}
