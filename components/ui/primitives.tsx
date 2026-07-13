"use client";

import * as React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

/* ── Button ────────────────────────────────────────────────────────── */

type ButtonBaseProps = {
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md" | "lg";
  className?: string;
  children: React.ReactNode;
};

type ButtonProps =
  | (ButtonBaseProps & React.ButtonHTMLAttributes<HTMLButtonElement> & { as?: "button" })
  | (ButtonBaseProps & React.AnchorHTMLAttributes<HTMLAnchorElement> & { as: "a"; href: string })
  | (ButtonBaseProps & {
      as: "link";
      href: string;
      download?: boolean | string;
      target?: string;
      rel?: string;
      onClick?: () => void;
    });

export function Button(props: ButtonProps) {
  const { variant = "primary", size = "md", className, children } = props;

  const variantClass =
    variant === "secondary"
      ? "border border-line bg-surface text-ink hover:border-line-strong hover:bg-surface-hover"
      : variant === "ghost"
      ? "text-muted hover:text-ink hover:bg-surface-hover"
      : "bg-ink text-paper hover:bg-ink/85";

  const sizeClass =
    size === "sm"
      ? "h-8 px-3.5 text-[13px]"
      : size === "lg"
      ? "h-11 px-5 text-sm"
      : "h-10 px-4 text-sm";

  const base = cn(
    "inline-flex items-center justify-center gap-2 rounded-full font-medium whitespace-nowrap select-none",
    "transition-[background-color,border-color,color,transform] duration-200",
    "active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50",
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

/* ── Tag — quiet chip for tech / topics ────────────────────────────── */

export function Tag({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full bg-surface-hover px-2.5 py-1",
        "text-[11px] font-medium text-muted",
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}

/* ── Dot — tiny status indicator with a soft pulse ─────────────────── */

export function Dot({ className }: { className?: string }) {
  return (
    <span className={cn("relative flex h-1.5 w-1.5", className)} aria-hidden="true">
      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-current opacity-50" />
      <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-current" />
    </span>
  );
}
