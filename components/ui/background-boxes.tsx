"use client";
import React, { useMemo } from "react";
import { motion } from "motion/react";
import { cn, shouldAnimate } from "@/lib/utils";

export const BoxesCore = ({ className, ...rest }: { className?: string }) => {
  const animate = shouldAnimate();
  // Reduced from 150×100 (15,000 nodes) to 25×15 (375 nodes) for dramatically better performance
  const rows = useMemo(() => new Array(25).fill(1), []);
  const cols = useMemo(() => new Array(15).fill(1), []);

  return (
    <div
      style={{
        transform: `translate(-40%,-60%) skewX(-48deg) skewY(14deg) scale(0.675) rotate(0deg) translateZ(0)`,
      }}
      className={cn(
        "absolute -top-1/4 left-1/4 z-0 flex h-full w-full -translate-x-1/2 -translate-y-1/2 p-4",
        className,
      )}
      {...rest}
    >
      {rows.map((_, i) => (
        animate ? (
          <motion.div
            key={`row` + i}
            className="relative h-8 w-16 border-l border-slate-700"
          >
            {cols.map((_, j) => (
              <motion.div
                whileHover={{
                  backgroundColor: "#ffffff",
                  transition: { duration: 0 },
                }}
                animate={{
                  transition: { duration: 2 },
                }}
                key={`col` + j}
                className="relative h-8 w-16 border-t border-r border-slate-700"
              >
                {j % 2 === 0 && i % 2 === 0 ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="pointer-events-none absolute -top-[14px] -left-[22px] h-6 w-10 stroke-[1px] text-slate-700"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 6v12m6-6H6"
                    />
                  </svg>
                ) : null}
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <div
            key={`row` + i}
            className="relative h-8 w-16 border-l border-slate-700"
          >
            {cols.map((_, j) => (
              <div
                key={`col` + j}
                className="relative h-8 w-16 border-t border-r border-slate-700"
              >
                {j % 2 === 0 && i % 2 === 0 ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="pointer-events-none absolute -top-[14px] -left-[22px] h-6 w-10 stroke-[1px] text-slate-700"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 6v12m6-6H6"
                    />
                  </svg>
                ) : null}
              </div>
            ))}
          </div>
        )
      ))}
    </div>
  );
};

export const Boxes = React.memo(BoxesCore);
