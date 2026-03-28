"use client";
import { useScroll, useTransform, motion } from "motion/react";
import React, { useEffect, useRef, useState } from "react";
import { shouldAnimate } from "@/lib/utils";
import { SectionHeader } from "@/components/ui/section-header";

interface TimelineEntry {
  title: string;
  content: React.ReactNode;
}

export const Timeline = React.memo(({ data }: { data: TimelineEntry[] }) => {
  const ref = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(0);
  const [lineTop, setLineTop] = useState(52);
  const animate = shouldAnimate();

  useEffect(() => {
    if (!ref.current) return;

    const measure = () => {
      if (!ref.current) return;
      setHeight(ref.current.getBoundingClientRect().height);

      // Align line start to the vertical center of the first dot
      const firstDot = ref.current.querySelector<HTMLElement>("[data-timeline-dot]");
      if (firstDot) {
        const dotRect = firstDot.getBoundingClientRect();
        const containerRect = ref.current.getBoundingClientRect();
        setLineTop(dotRect.top - containerRect.top + dotRect.height / 2);
      }
    };

    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(ref.current);
    return () => ro.disconnect();
  }, []);

  const effectiveHeight = Math.max(0, height - lineTop);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 10%", "end 85%"],
  });

  const heightTransform = useTransform(scrollYProgress, [0, 1], [0, effectiveHeight]);
  const opacityTransform = useTransform(scrollYProgress, [0, 0.04], [0, 1]);

  return (
    <div className="w-full" ref={containerRef}>
      <div className="max-w-6xl mx-auto py-10 md:py-12 px-6 sm:px-10">
        <SectionHeader
          label="my journey"
          title={<>experience &amp; <span className="text-red-600 dark:text-red-400">education</span></>}
          description="From academic pursuits to professional experiences."
        />
      </div>

      <div ref={ref} className="relative max-w-6xl mx-auto px-6 sm:px-10 pb-16">
        {data.map((item, index) => (
          <div key={index} className="flex justify-start pt-8 md:pt-16 md:gap-10">
            <div className="sticky flex flex-col md:flex-row z-40 items-center top-28 self-start max-w-xs lg:max-w-sm md:w-full">
              <div
                data-timeline-dot
                className="h-10 absolute left-3 md:left-3 w-10 rounded-full bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 flex items-center justify-center"
              >
                <div className="h-3 w-3 rounded-full bg-red-500" />
              </div>
              <h3 className="hidden md:block text-xl md:pl-20 md:text-4xl font-bold text-zinc-400 dark:text-zinc-500">
                {item.title}
              </h3>
            </div>

            <div className="relative pl-14 pr-2 sm:pl-20 sm:pr-4 md:pl-4 md:pr-0 w-full">
              <h3 className="md:hidden block text-lg mb-3 text-left font-bold text-zinc-400 dark:text-zinc-500">
                {item.title}
              </h3>
              {item.content}
            </div>
          </div>
        ))}

        {/* Track — background zinc line */}
        <div
          style={{ height: effectiveHeight + "px", top: lineTop + "px" }}
          className="absolute md:left-8 left-8 overflow-hidden w-[2px]
            bg-[linear-gradient(to_bottom,var(--tw-gradient-stops))]
            from-transparent from-[0%] via-zinc-200 dark:via-zinc-800 to-transparent to-[99%]
            [mask-image:linear-gradient(to_bottom,transparent_0%,black_6%,black_94%,transparent_100%)]"
        >
          {/* Animated red fill — grows top-to-bottom as user scrolls */}
          {animate ? (
            <motion.div
              style={{ height: heightTransform, opacity: opacityTransform }}
              className="absolute inset-x-0 top-0 w-[2px] bg-gradient-to-b from-red-500 via-red-400 to-transparent rounded-full"
            />
          ) : (
            <div
              style={{ height: effectiveHeight + "px", opacity: 1 }}
              className="absolute inset-x-0 top-0 w-[2px] bg-gradient-to-b from-red-500 via-red-400 to-transparent rounded-full"
            />
          )}
        </div>
      </div>
    </div>
  );
});

Timeline.displayName = "Timeline";
