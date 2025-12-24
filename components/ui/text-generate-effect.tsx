"use client";
import React, { useEffect, useMemo } from "react";
import { motion, stagger, useAnimate } from "motion/react";
import { cn, shouldAnimate } from "@/lib/utils";

export const TextGenerateEffect = React.memo(({
  words,
  className,
  filter = true,
  duration = 0.5,
}: {
  words: string;
  className?: string;
  filter?: boolean;
  duration?: number;
}) => {
  const animateEnabled = shouldAnimate();
  const [scope, animate] = useAnimate();
  const wordsArray = useMemo(() => words.split(" "), [words]);

  useEffect(() => {
    if (!animateEnabled) return;
    animate(
      "span",
      {
        opacity: 1,
        filter: filter ? "blur(0px)" : "none",
      },
      {
        duration: duration ? duration : 1,
        delay: stagger(0.2),
      }
    );
  }, [animate, duration, filter, words, animateEnabled]);

  const renderWords = () => {
    return animateEnabled ? (
      <motion.div ref={scope}>
        {wordsArray.map((word, idx) => {
          return (
            <motion.span
              key={word + idx}
              className="text-zinc-400 opacity-0"
              style={{
                filter: filter ? "blur(10px)" : "none",
              }}
            >
              {word}{" "}
            </motion.span>
          );
        })}
      </motion.div>
    ) : (
      <div>
        {wordsArray.map((word, idx) => {
          return (
            <span
              key={word + idx}
              className="text-zinc-400"
            >
              {word}{" "}
            </span>
          );
        })}
      </div>
    );
  };

  return (
    <div className={cn("font-bold", className)}>
      <div className="mt-4">
        <div className="text-zinc-400 text-2xl leading-snug tracking-wide">
          {renderWords()}
        </div>
      </div>
    </div>
  );
});
