"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { shouldAnimate } from "@/lib/utils";

const INTERACTIVE = "a, button, input, textarea, select, summary, [data-cursor]";

/** `data-cursor` values the ring can speak. Anything else is shown verbatim. */
const LABELS: Record<string, string> = {
  view: "View",
  copy: "Copy",
  drag: "Drag",
  open: "Open",
};

type Mode = "idle" | "hover" | "label" | "snap";

/** Ring diameters per mode; `snap` takes its size from the button instead. */
const RING = { idle: 34, hover: 52, label: 72 } as const;

/**
 * Desktop-only custom cursor: a hard accent dot that tracks 1:1 and a
 * ring that lags behind it. The ring has four states — a thin circle at
 * rest, a wider lime one over anything interactive, a filled plate that
 * speaks a word ("View", "Copy") over elements tagged `data-cursor`, and
 * a rectangle that squares off and hugs any `.btn`. Size and position are
 * both eased in JS so a state change morphs instead of jumping.
 *
 * Never mounts on touch devices, under reduced motion, or on /lilmoney —
 * and the native cursor is only hidden once this is actually running.
 */
export function Cursor() {
  const pathname = usePathname();
  const nativeCursor = pathname.startsWith("/lilmoney");
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (nativeCursor || document.querySelector("[data-littlemoney]")) return;
    if (!shouldAnimate()) return;
    if (!window.matchMedia("(pointer: fine)").matches) return;

    const dot = dotRef.current;
    const ring = ringRef.current;
    const label = labelRef.current;
    if (!dot || !ring || !label) return;

    const root = document.documentElement;

    let targetX = window.innerWidth / 2;
    let targetY = window.innerHeight / 2;
    let ringX = targetX;
    let ringY = targetY;
    let ringW = RING.idle;
    let ringH = RING.idle;
    let visible = false;
    let pressed = false;
    let needsRead = false;
    let raf = 0;
    let mode: Mode = "idle";
    let snapEl: HTMLElement | null = null;

    const setMode = (next: Mode, text = "") => {
      if (next === mode && (next !== "label" || label.textContent === text)) return;
      mode = next;
      ring.dataset.mode = next;
      if (next === "label") label.textContent = text;
      /* The plate replaces the dot; everywhere else the dot stays. */
      dot.style.opacity = visible && next !== "label" ? "1" : "0";
    };

    /* Decide the state from whatever is under the pointer. */
    const read = (target: Element | null) => {
      const hit = target?.closest?.(INTERACTIVE) as HTMLElement | null;
      const btn = hit?.closest(".btn") as HTMLElement | null;
      const tagged = hit?.closest("[data-cursor]") as HTMLElement | null;
      if (btn) {
        snapEl = btn;
        setMode("snap");
      } else if (tagged?.dataset.cursor) {
        snapEl = null;
        const word = tagged.dataset.cursor;
        setMode("label", LABELS[word] ?? word);
      } else {
        snapEl = null;
        setMode(hit ? "hover" : "idle");
      }
    };

    const onMove = (e: PointerEvent) => {
      targetX = e.clientX;
      targetY = e.clientY;
      if (!visible) {
        visible = true;
        ringX = targetX;
        ringY = targetY;
        dot.style.opacity = "1";
        ring.style.opacity = "1";
        /* Only now is there something to replace the native cursor with.
           Hiding it on mount instead leaves the pointer invisible for as
           long as the reader doesn't move the mouse. */
        root.classList.add("custom-cursor");
      }
      dot.style.transform = `translate3d(${targetX - 3}px, ${targetY - 3}px, 0)`;
      read(e.target as Element | null);
    };

    const onLeave = () => {
      visible = false;
      dot.style.opacity = "0";
      ring.style.opacity = "0";
    };

    const onDown = () => {
      pressed = true;
    };
    const onUp = () => {
      pressed = false;
    };

    /* The page moves under a still pointer — Lenis, a keyboard jump — so
       what the ring is over changes without a pointer event. Re-read on
       the next frame rather than per frame: `elementFromPoint` flushes
       layout, and once per scroll event is plenty. */
    const onScroll = () => {
      needsRead = true;
    };

    const loop = () => {
      if (needsRead && visible) {
        needsRead = false;
        read(document.elementFromPoint(targetX, targetY));
      }

      let tx = targetX;
      let ty = targetY;
      let tw: number | undefined;
      let th: number | undefined;

      if (mode === "snap" && snapEl) {
        const r = snapEl.getBoundingClientRect();
        if (r.width === 0) {
          /* Unmounted or hidden under us — fall back to a plain hover. */
          snapEl = null;
          setMode("hover");
        } else {
          tx = r.left + r.width / 2;
          ty = r.top + r.height / 2;
          tw = r.width + 10;
          th = r.height + 10;
        }
      }

      const size = mode === "label" ? RING.label : mode === "hover" ? RING.hover : RING.idle;
      tw ??= size;
      th ??= size;

      /* Snapping follows faster, so the ring reads as "caught" by the button. */
      const k = mode === "snap" ? 0.22 : 0.16;
      ringX += (tx - ringX) * k;
      ringY += (ty - ringY) * k;
      ringW += (tw - ringW) * 0.2;
      ringH += (th - ringH) * 0.2;

      ring.style.width = `${ringW}px`;
      ring.style.height = `${ringH}px`;
      ring.style.transform = `translate3d(${ringX - ringW / 2}px, ${ringY - ringH / 2}px, 0) scale(${
        pressed ? 0.88 : 1
      })`;
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", onDown, { passive: true });
    window.addEventListener("pointerup", onUp, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    document.addEventListener("pointerleave", onLeave);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("pointerleave", onLeave);
      root.classList.remove("custom-cursor");
    };
  }, [nativeCursor]);

  if (nativeCursor) return null;
  return (
    <>
      <div ref={dotRef} className="cursor-dot" style={{ opacity: 0 }} aria-hidden="true" />
      <div ref={ringRef} className="cursor-ring" style={{ opacity: 0 }} aria-hidden="true">
        <span ref={labelRef} className="cursor-label" />
      </div>
    </>
  );
}
