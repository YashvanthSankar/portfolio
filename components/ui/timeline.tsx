"use client";

import React, { useEffect, useRef, useState } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { shouldAnimate } from "@/lib/utils";
import { SectionHeader } from "@/components/ui/section-header";

interface TimelineEntry {
  title: string;
  content: React.ReactNode;
}

export const Timeline = React.memo(({ data }: { data: TimelineEntry[] }) => {
  const containerRef  = useRef<HTMLDivElement>(null);
  const trackRef      = useRef<HTMLDivElement>(null);
  const fillRef       = useRef<HTMLDivElement>(null);
  const [lineTop, setLineTop]   = useState(52);
  const [trackH,  setTrackH]    = useState(0);
  const animate = shouldAnimate();

  /* Measure track height & dot offset */
  useEffect(() => {
    const measure = () => {
      if (!trackRef.current) return;
      const h = trackRef.current.getBoundingClientRect().height;
      setTrackH(h);
      const dot = trackRef.current.querySelector<HTMLElement>("[data-timeline-dot]");
      if (dot) {
        const dRect = dot.getBoundingClientRect();
        const cRect = trackRef.current.getBoundingClientRect();
        setLineTop(dRect.top - cRect.top + dRect.height / 2);
      }
    };
    measure();
    const ro = new ResizeObserver(measure);
    if (trackRef.current) ro.observe(trackRef.current);
    return () => ro.disconnect();
  }, []);

  /* GSAP ScrollTrigger — scrub fill line */
  useEffect(() => {
    if (!animate || !fillRef.current || !trackRef.current || trackH === 0) return;

    const effectiveH = Math.max(0, trackH - lineTop);

    const st = ScrollTrigger.create({
      trigger: trackRef.current,
      start: "top 10%",
      end: "bottom 85%",
      scrub: 0.6,
      onUpdate(self) {
        if (!fillRef.current) return;
        gsap.set(fillRef.current, {
          height: effectiveH * self.progress,
          opacity: Math.min(1, self.progress * 20),
        });
      },
    });

    return () => st.kill();
  }, [animate, trackH, lineTop]);

  /* Cards stagger in on scroll */
  useEffect(() => {
    if (!animate || !trackRef.current) return;
    const cards = trackRef.current.querySelectorAll<HTMLElement>("[data-timeline-card]");
    if (!cards.length) return;

    const ctx = gsap.context(() => {
      ScrollTrigger.batch(cards, {
        start: "top 88%",
        onEnter(batch) {
          gsap.fromTo(batch,
            { opacity: 0, y: 24, filter: "blur(4px)" },
            { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.55, stagger: 0.1, ease: "power3.out" }
          );
        },
        once: true,
      });
    }, trackRef);

    return () => ctx.revert();
  }, [animate, data]);

  const effectiveHeight = Math.max(0, trackH - lineTop);

  return (
    <div className="w-full" ref={containerRef}>
      <div className="max-w-6xl mx-auto py-10 md:py-12 px-6 sm:px-10">
        <SectionHeader
          label="my journey"
          title={<>experience &amp; <span className="text-rose-600 dark:text-rose-400">education</span></>}
          description="From academic pursuits to professional experiences."
        />
      </div>

      <div ref={trackRef} className="relative max-w-6xl mx-auto px-6 sm:px-10 pb-16">
        {data.map((item, index) => (
          <div key={index} className="flex justify-start pt-8 md:pt-16 md:gap-10">
            <div className="sticky flex flex-col md:flex-row z-40 items-center top-28 self-start max-w-xs lg:max-w-sm md:w-full">
              <div
                data-timeline-dot
                className="h-10 absolute left-3 md:left-3 w-10 rounded-full
                           bg-rose-100 dark:bg-[#2d0c12]
                           border border-rose-200 dark:border-rose-900/40
                           flex items-center justify-center"
              >
                <div className="h-3 w-3 rounded-full bg-rose-500" />
              </div>
              <h3 className="hidden md:block text-xl md:pl-20 md:text-4xl font-bold text-zinc-400 dark:text-zinc-500">
                {item.title}
              </h3>
            </div>

            <div
              data-timeline-card
              className="relative pl-14 pr-2 sm:pl-20 sm:pr-4 md:pl-4 md:pr-0 w-full"
              style={{ opacity: animate ? 0 : 1 }}
            >
              <h3 className="md:hidden block text-lg mb-3 text-left font-bold text-zinc-400 dark:text-zinc-500">
                {item.title}
              </h3>
              {item.content}
            </div>
          </div>
        ))}

        {/* Track background */}
        <div
          style={{ height: effectiveHeight + "px", top: lineTop + "px" }}
          className="absolute md:left-8 left-8 overflow-hidden w-[2px]
            bg-[linear-gradient(to_bottom,var(--tw-gradient-stops))]
            from-transparent from-[0%] via-zinc-200 dark:via-zinc-800 to-transparent to-[99%]
            [mask-image:linear-gradient(to_bottom,transparent_0%,black_6%,black_94%,transparent_100%)]"
        >
          {/* GSAP-controlled fill */}
          <div
            ref={fillRef}
            className="absolute inset-x-0 top-0 w-[2px] bg-gradient-to-b from-rose-500 via-rose-400 to-transparent rounded-full"
            style={{ height: animate ? 0 : effectiveHeight + "px", opacity: animate ? 0 : 1 }}
          />
        </div>
      </div>
    </div>
  );
});

Timeline.displayName = "Timeline";
