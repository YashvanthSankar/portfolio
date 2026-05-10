"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { shouldAnimate } from "@/lib/utils";

// Use layout effect on the client and a no-op on the server to silence the
// SSR warning while still running synchronously before paint on the client.
const useIsoLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

interface TextScrambleProps {
  text: string;
  className?: string;
  duration?: number;
  startDelay?: number;
  triggerOn?: "mount" | "hover" | "manual";
  trigger?: number;
  showCaret?: boolean;
  charset?: string;
}

const DEFAULT_CHARSET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&*";

/* Build a scrambled placeholder of the same length & shape as the target.
   Spaces stay as spaces; punctuation we hold (looks intentional). */
function makePlaceholder(text: string, charset: string) {
  return text
    .split("")
    .map((c) => {
      if (c === " ") return " ";
      if (/[.,!?:;'"]/.test(c)) return c;
      return charset[Math.floor(Math.random() * charset.length)];
    })
    .join("");
}

export function TextScramble({
  text,
  className,
  duration = 520,
  startDelay = 0,
  triggerOn = "mount",
  trigger = 0,
  showCaret = false,
  charset = DEFAULT_CHARSET,
}: TextScrambleProps) {
  // SSR-safe: server and first client render both produce the deterministic
  // `text`, so React hydrates with no mismatch. We then immediately swap to
  // a scrambled placeholder on the client (in the mount effect below) before
  // any paint, so the user still never sees the final word prematurely.
  const [output, setOutput] = useState(text);
  const [done, setDone] = useState(triggerOn !== "mount");
  const rafRef = useRef<number | null>(null);

  const run = () => {
    if (!shouldAnimate()) {
      setOutput(text);
      setDone(true);
      return;
    }

    const start = performance.now();
    const chars = text.split("");

    const tick = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const settled = Math.floor(progress * chars.length);

      const next = chars
        .map((c, i) => {
          if (i < settled) return c;
          if (c === " ") return " ";
          return charset[Math.floor(Math.random() * charset.length)];
        })
        .join("");

      setOutput(next);

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        setOutput(text);
        setDone(true);
      }
    };

    setDone(false);
    rafRef.current = requestAnimationFrame(tick);
  };

  // Synchronous pre-paint swap: replace the SSR-rendered final text with
  // a scrambled placeholder before the browser paints the first frame.
  useIsoLayoutEffect(() => {
    if (triggerOn !== "mount") return;
    if (!shouldAnimate()) return;
    setOutput(makePlaceholder(text, charset));
  }, []);

  useEffect(() => {
    if (triggerOn !== "mount") return;
    // While waiting for the startDelay, keep cycling the placeholder so
    // it visibly "shimmers" instead of being a frozen jumble.
    let shimmer: number | null = null;
    const startShimmer = () => {
      shimmer = window.setInterval(() => {
        setOutput(makePlaceholder(text, charset));
      }, 70);
    };
    startShimmer();

    const t = setTimeout(() => {
      if (shimmer !== null) clearInterval(shimmer);
      run();
    }, startDelay);

    return () => {
      clearTimeout(t);
      if (shimmer !== null) clearInterval(shimmer);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (triggerOn !== "manual") return;
    if (trigger === 0) return;
    run();
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trigger]);

  const handleEnter = () => {
    if (triggerOn === "hover") run();
  };

  return (
    <span
      className={className}
      onMouseEnter={handleEnter}
      onFocus={handleEnter}
      aria-label={text}
    >
      <span aria-hidden="true">{output}</span>
      {showCaret && done && <span className="scramble-caret" aria-hidden="true" />}
    </span>
  );
}
