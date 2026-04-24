"use client";

import * as React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

/* ── BrutalCard ────────────────────────────────────────────────────── */

type BrutalCardProps = React.HTMLAttributes<HTMLDivElement> & {
  as?: "div" | "article" | "section";
  hover?: boolean;
  accent?: "surface" | "accent" | "highlight" | "secondary";
};

export const BrutalCard = React.forwardRef<HTMLDivElement, BrutalCardProps>(
  function BrutalCard({ className, as = "div", hover = true, accent = "surface", children, ...props }, ref) {
    const Comp = as as React.ElementType;
    const bg =
      accent === "accent"
        ? "bg-[var(--accent)] text-[var(--accent-ink)]"
        : accent === "highlight"
        ? "bg-[var(--highlight)] text-[var(--ink)]"
        : accent === "secondary"
        ? "bg-[var(--secondary)] text-[var(--ink)]"
        : "bg-[var(--surface)] text-[var(--ink)]";

    return (
      <Comp
        ref={ref}
        className={cn(
          "relative border-[2.5px] border-[var(--border-ink)] shadow-brutal",
          bg,
          hover && "brutal-card-hover",
          className
        )}
        {...props}
      >
        {children}
      </Comp>
    );
  }
);

/* ── BrutalButton ──────────────────────────────────────────────────── */

type BrutalButtonBaseProps = {
  variant?: "primary" | "secondary" | "ghost" | "ink";
  size?: "sm" | "md" | "lg";
  className?: string;
  children: React.ReactNode;
};

type BrutalButtonProps =
  | (BrutalButtonBaseProps & React.ButtonHTMLAttributes<HTMLButtonElement> & { as?: "button" })
  | (BrutalButtonBaseProps & React.AnchorHTMLAttributes<HTMLAnchorElement> & { as: "a"; href: string })
  | (BrutalButtonBaseProps & { as: "link"; href: string; download?: boolean | string; target?: string; rel?: string; onClick?: () => void });

export function BrutalButton(props: BrutalButtonProps) {
  const { variant = "primary", size = "md", className, children } = props;

  const variantClass =
    variant === "secondary"
      ? "bg-[var(--surface)] text-[var(--ink)]"
      : variant === "ghost"
      ? "bg-[var(--highlight)] text-[var(--highlight-ink)]"
      : variant === "ink"
      ? "bg-[var(--ink)] text-[var(--paper)]"
      : "bg-[var(--accent)] text-[var(--accent-ink)]";

  const sizeClass =
    size === "sm"
      ? "px-3 py-1.5 text-xs"
      : size === "lg"
      ? "px-6 py-3.5 text-base"
      : "px-5 py-2.5 text-sm";

  const shadowClass =
    size === "sm"
      ? cn(
          "shadow-[3px_3px_0_0_var(--border-ink)]",
          "hover:-translate-x-[1px] hover:-translate-y-[1px] hover:shadow-[4px_4px_0_0_var(--border-ink)]",
          "active:translate-x-[1px] active:translate-y-[1px] active:shadow-[1px_1px_0_0_var(--border-ink)]"
        )
      : cn(
          "shadow-brutal",
          "hover:-translate-x-[2px] hover:-translate-y-[2px] hover:shadow-[8px_8px_0_0_var(--border-ink)]",
          "active:translate-x-[3px] active:translate-y-[3px] active:shadow-[2px_2px_0_0_var(--border-ink)]"
        );

  const base = cn(
    "inline-flex items-center justify-center gap-2 border-[2.5px] border-[var(--border-ink)] font-display font-bold tracking-wide",
    "transition-transform transition-shadow duration-150",
    shadowClass,
    "focus-visible:outline-3 focus-visible:outline-[var(--accent)] focus-visible:outline-offset-2",
    variantClass,
    sizeClass,
    className
  );

  if (props.as === "link") {
    const { href, download, target, rel, onClick } = props;
    return (
      <Link href={href} download={download} target={target} rel={rel} onClick={onClick} className={base}>
        {children}
      </Link>
    );
  }
  if (props.as === "a") {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { variant: _v, size: _s, className: _c, children: _ch, as: _a, ...rest } = props;
    return (
      <a {...rest} className={base}>
        {children}
      </a>
    );
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { variant: _v, size: _s, className: _c, children: _ch, as: _a, ...rest } = props;
  return (
    <button {...(rest as React.ButtonHTMLAttributes<HTMLButtonElement>)} className={base}>
      {children}
    </button>
  );
}

/* ── BrutalTag ─────────────────────────────────────────────────────── */

type BrutalTagProps = React.HTMLAttributes<HTMLSpanElement> & {
  variant?: "surface" | "accent" | "highlight" | "secondary" | "ink";
};

export function BrutalTag({ className, variant = "surface", children, ...props }: BrutalTagProps) {
  const bg =
    variant === "accent"
      ? "bg-[var(--accent)] text-[var(--accent-ink)]"
      : variant === "highlight"
      ? "bg-[var(--highlight)] text-[var(--ink)]"
      : variant === "secondary"
      ? "bg-[var(--secondary)] text-[var(--ink)]"
      : variant === "ink"
      ? "bg-[var(--ink)] text-[var(--paper)]"
      : "bg-[var(--surface)] text-[var(--ink)]";

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-1",
        "border-2 border-[var(--border-ink)]",
        "text-[11px] font-semibold font-mono tracking-wide",
        "shadow-[2px_2px_0_0_var(--border-ink)]",
        "transition-transform duration-150",
        "hover:-translate-x-[1px] hover:-translate-y-[1px] hover:shadow-[3px_3px_0_0_var(--border-ink)]",
        bg,
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}

/* ── BrutalBadge — small pill-ish marker ──────────────────────────── */

export function BrutalBadge({
  className,
  children,
  variant = "highlight",
}: {
  className?: string;
  children: React.ReactNode;
  variant?: "highlight" | "accent" | "secondary" | "ink";
}) {
  const bg =
    variant === "accent"
      ? "bg-[var(--accent)] text-[var(--accent-ink)]"
      : variant === "secondary"
      ? "bg-[var(--secondary)] text-[var(--ink)]"
      : variant === "ink"
      ? "bg-[var(--ink)] text-[var(--paper)]"
      : "bg-[var(--highlight)] text-[var(--ink)]";
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 px-3 py-1",
        "border-2 border-[var(--border-ink)] shadow-[3px_3px_0_0_var(--border-ink)]",
        "font-display font-bold text-[11px] tracking-widest uppercase",
        bg,
        className
      )}
    >
      {children}
    </span>
  );
}
