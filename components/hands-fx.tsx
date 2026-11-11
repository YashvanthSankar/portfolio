"use client";

import { useEffect } from "react";

const GLYPHS = ".:-=+*#%@";
const NBSP = " ";

/* Scramble radius around the pointer, in SVG units (a cell is 6 wide). */
const RADIUS = 44;

interface Segment {
  el: SVGTextElement;
  /** Column of the first character, in the hand's own coordinates. */
  col: number;
  /** +1 for the left hand (moves right on scroll), -1 for the right. */
  dir: 1 | -1;
  orig: string;
  cur: string[];
  /** Character index → frames left before it settles back. */
  hot: Map<number, number>;
}

/**
 * The hands' two behaviours, attached to the static SVG that
 * components/hands.tsx renders:
 *
 * - characters near the pointer scramble, then settle back;
 * - the hands drift toward each other as the page scrolls (`--close` on
 *   the SVG, 0 → 1, read by `.hand-l` / `.hand-r` in globals.css).
 *
 * Renders nothing. Does nothing under prefers-reduced-motion.
 */
export function HandsFx({ cw, ch, reach }: { cw: number; ch: number; reach: number }) {
  useEffect(() => {
    const svg = document.querySelector<SVGSVGElement>("svg.hands");
    if (!svg || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const rows = new Map<number, Segment[]>();
    svg.querySelectorAll<SVGTextElement>("text[data-r]").forEach((el) => {
      const orig = el.textContent ?? "";
      const seg: Segment = {
        el,
        col: Number(el.dataset.c),
        dir: el.parentElement?.classList.contains("hand-l") ? 1 : -1,
        orig,
        cur: [...orig],
        hot: new Map(),
      };
      const r = Number(el.dataset.r);
      rows.set(r, [...(rows.get(r) ?? []), seg]);
    });

    /* ── Scroll: bring the hands together ── */
    let close = 0;
    const onScroll = () => {
      const h = svg.getBoundingClientRect().height || 1;
      close = Math.min(1, Math.max(0, window.scrollY / (h * 0.9)));
      svg.style.setProperty("--close", close.toFixed(3));
    };

    /* ── Pointer: scramble ── */
    const active = new Set<Segment>();
    let raf = 0;
    let frame = 0;

    const tick = () => {
      frame++;
      const reroll = frame % 3 === 0;
      for (const seg of active) {
        for (const [i, ttl] of seg.hot) {
          if (ttl <= 0) {
            seg.cur[i] = seg.orig[i];
            seg.hot.delete(i);
          } else {
            if (reroll) seg.cur[i] = GLYPHS[(Math.random() * GLYPHS.length) | 0];
            seg.hot.set(i, ttl - 1);
          }
        }
        seg.el.textContent = seg.cur.join("");
        if (!seg.hot.size) active.delete(seg);
      }
      raf = active.size ? requestAnimationFrame(tick) : 0;
    };

    const onMove = (e: PointerEvent) => {
      const ctm = svg.getScreenCTM();
      if (!ctm) return;
      const p = new DOMPoint(e.clientX, e.clientY).matrixTransform(ctm.inverse());
      const box = svg.viewBox.baseVal;
      if (p.y < -RADIUS || p.y > box.height + RADIUS) return;

      const r0 = Math.floor((p.y - RADIUS) / ch);
      const r1 = Math.floor((p.y + RADIUS) / ch);
      for (let r = r0; r <= r1; r++) {
        const dy = (r + 0.5) * ch - p.y;
        for (const seg of rows.get(r) ?? []) {
          /* Undo the hand's scroll offset to get back to its own columns. */
          const x = p.x - seg.dir * close * reach;
          const i0 = Math.max(0, Math.floor((x - RADIUS) / cw) - seg.col);
          const i1 = Math.min(seg.orig.length - 1, Math.floor((x + RADIUS) / cw) - seg.col);
          for (let i = i0; i <= i1; i++) {
            if (seg.orig[i] === NBSP) continue;
            const dx = (seg.col + i + 0.5) * cw - x;
            if (dx * dx + dy * dy > RADIUS * RADIUS) continue;
            seg.hot.set(i, 8 + ((Math.random() * 16) | 0));
            active.add(seg);
          }
        }
      }
      if (active.size && !raf) raf = requestAnimationFrame(tick);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(raf);
    };
  }, [cw, ch, reach]);

  return null;
}
