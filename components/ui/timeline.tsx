"use client";

import React, { useEffect, useRef, useState } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { shouldAnimate } from "@/lib/utils";
import { SectionHeader } from "@/components/ui/section-header";

interface TimelineEntry {
  title: string;
  content: React.ReactNode;
}

export const Timeline = React.memo(function Timeline({ data }: { data: TimelineEntry[] }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const fillRef = useRef<HTMLDivElement>(null);
  const [lineTop, setLineTop] = useState(52);
  const [trackH, setTrackH] = useState(0);
  const animate = shouldAnimate();

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

  useEffect(() => {
    if (!animate || !trackRef.current) return;
    const cards = trackRef.current.querySelectorAll<HTMLElement>("[data-timeline-card]");
    if (!cards.length) return;
    const ctx = gsap.context(() => {
      ScrollTrigger.batch(cards, {
        start: "top 88%",
        onEnter(batch) {
          gsap.fromTo(
            batch,
            { opacity: 0, y: 32 },
            { opacity: 1, y: 0, duration: 0.55, stagger: 0.12, ease: "power3.out" }
          );
        },
        once: true,
      });
    }, trackRef);
    return () => ctx.revert();
  }, [animate, data]);

  const effectiveHeight = Math.max(0, trackH - lineTop);

  return (
    <div className="w-full">
      <div className="max-w-6xl mx-auto py-12 md:py-16 px-6 sm:px-10">
        <SectionHeader
          label="my journey"
          title={
            <>
              Experience &<br />
              <span className="inline-block bg-[var(--highlight)] border-[2.5px] border-[var(--border-ink)] px-3 shadow-[4px_4px_0_0_var(--border-ink)] -rotate-sticker-1">
                Education
              </span>
            </>
          }
          description="From academic milestones to real engineering work."
        />
      </div>

      <div ref={trackRef} className="relative max-w-6xl mx-auto px-6 sm:px-10 pb-20">
        {data.map((item, index) => (
          <div key={index} className="flex justify-start pt-8 md:pt-16 md:gap-10">
            <div className="sticky flex flex-col md:flex-row z-40 items-center top-28 self-start max-w-xs lg:max-w-sm md:w-full">
              <div
                data-timeline-dot
                className="h-12 w-12 absolute left-2 md:left-2
                           bg-[var(--highlight)] border-[2.5px] border-[var(--border-ink)]
                           shadow-[4px_4px_0_0_var(--border-ink)]
                           flex items-center justify-center"
              >
                <div className="h-3 w-3 bg-[var(--ink)]" />
              </div>
              <h3 className="hidden md:block font-display text-xl md:pl-24 md:text-4xl font-bold text-[var(--ink)]">
                {item.title}
              </h3>
            </div>

            <div
              data-timeline-card
              className="relative pl-16 pr-2 sm:pl-24 sm:pr-4 md:pl-4 md:pr-0 w-full"
              style={{ opacity: animate ? 0 : 1 }}
            >
              <h3 className="md:hidden block font-display text-2xl mb-4 text-left font-bold text-[var(--ink)]">
                {item.title}
              </h3>
              {item.content}
            </div>
          </div>
        ))}

        {/* Track — thick black rail */}
        <div
          style={{ height: effectiveHeight + "px", top: lineTop + "px" }}
          className="absolute md:left-[30px] left-[30px] w-[3px] bg-[var(--border-ink)] opacity-25"
          aria-hidden="true"
        >
          <div
            ref={fillRef}
            className="absolute inset-x-0 top-0 w-[3px] bg-[var(--accent)]"
            style={{ height: animate ? 0 : effectiveHeight + "px", opacity: animate ? 0 : 1 }}
          />
        </div>
      </div>
    </div>
  );
});
