"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, type ReactNode } from "react";
import { gsap } from "@/lib/gsap";
import { shouldAnimate } from "@/lib/utils";
import { useScrollTo } from "@/components/providers/smooth-scroll";

/** Routes that get the wipe. Everything else (/lilmoney, external) is left alone. */
const ROUTES = new Set(["/", "/work"]);

/** Never hold a reader behind the curtain if a chunk is slow. */
const FAILSAFE_MS = 2500;

/**
 * A brief curtain between the portfolio's two routes: the page colour
 * wipes up over the old page, the route changes underneath, and it wipes
 * away off the top of the new one. Clicks on internal links are caught
 * at the document, so no link needs to know about it.
 *
 * Same-route hash links (`/#contact` while on `/`) are turned into a
 * smooth scroll instead of a navigation — one path for every anchor.
 *
 * The View Transitions API is still `unstable_` in this React, so this
 * is GSAP and a clip-path. Skipped under reduced motion, where a click
 * is just a navigation.
 */
export function PageTransition({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const scrollTo = useScrollTo();
  const curtainRef = useRef<HTMLDivElement>(null);
  /* The route we are wiping toward, if any. */
  const pendingRef = useRef<string | null>(null);
  const failsafeRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const onPortfolio = ROUTES.has(pathname);

  /* Reveal the new page once it has arrived. */
  useEffect(() => {
    if (!pendingRef.current) return;
    pendingRef.current = null;
    if (failsafeRef.current) clearTimeout(failsafeRef.current);
    const curtain = curtainRef.current;
    if (!curtain) return;
    gsap.to(curtain, {
      clipPath: "inset(0% 0% 100% 0%)",
      duration: 0.42,
      ease: "power4.inOut",
      delay: 0.05,
      onComplete() {
        gsap.set(curtain, { clipPath: "inset(100% 0% 0% 0%)" });
      },
    });
  }, [pathname]);

  useEffect(() => {
    if (!onPortfolio) return;

    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0) return;
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const anchor = (e.target as Element | null)?.closest?.("a[href]") as HTMLAnchorElement | null;
      if (!anchor || anchor.target === "_blank" || anchor.hasAttribute("download")) return;

      const url = new URL(anchor.href, window.location.href);
      if (url.origin !== window.location.origin) return;
      if (!ROUTES.has(url.pathname)) return;

      /* Same page, just a hash: scroll there, don't navigate. */
      if (url.pathname === window.location.pathname) {
        if (url.hash) {
          e.preventDefault();
          scrollTo(url.hash);
        }
        return;
      }

      e.preventDefault();
      const href = url.pathname + url.hash;
      const curtain = curtainRef.current;

      if (!shouldAnimate() || !curtain || pendingRef.current) {
        router.push(href);
        return;
      }

      pendingRef.current = href;
      gsap.fromTo(
        curtain,
        { clipPath: "inset(100% 0% 0% 0%)" },
        {
          clipPath: "inset(0% 0% 0% 0%)",
          duration: 0.38,
          ease: "power4.inOut",
          onComplete() {
            router.push(href);
          },
        }
      );
      failsafeRef.current = setTimeout(() => {
        if (!pendingRef.current) return;
        pendingRef.current = null;
        gsap.to(curtain, { clipPath: "inset(0% 0% 100% 0%)", duration: 0.3 });
      }, FAILSAFE_MS);
    };

    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, [onPortfolio, router, scrollTo]);

  useEffect(
    () => () => {
      if (failsafeRef.current) clearTimeout(failsafeRef.current);
    },
    []
  );

  return (
    <>
      {children}
      {onPortfolio && (
        <div
          ref={curtainRef}
          data-curtain
          aria-hidden="true"
          className="pointer-events-none fixed inset-0 z-[70] bg-[var(--bg-0)]"
          style={{ clipPath: "inset(100% 0% 0% 0%)" }}
        >
          {/* A hairline at the leading edge, so the wipe has a line to it. */}
          <div className="absolute inset-x-0 top-0 h-px bg-[var(--accent)]" />
        </div>
      )}
    </>
  );
}
