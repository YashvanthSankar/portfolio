"use client";

import Image from "next/image";
import { useMemo, useRef, useState, type RefObject } from "react";
import type { Project } from "@/data/types";
import { COVER_H, COVER_W, coverGeometry, coverGlowX, drawCoverTexture } from "@/lib/cover-art";
import { useGlSurface } from "@/lib/gl/use-gl-surface";
import { useMediaQuery } from "@/lib/use-media-query";
import { createCoverScene } from "@/components/gl/cover-scene";

/** The sheet only where it earns its keep: a pointer to ripple under, and room to see it. */
const SHEET_QUERY =
  "(min-width: 768px) and (pointer: fine) and (prefers-reduced-motion: no-preference)";

/**
 * The WebGL sheet over a cover. It draws the same picture as the DOM
 * beneath it — rasterised from the shared geometry, or the screenshot
 * itself — and distorts it under the pointer and with scroll. The DOM
 * stays in the markup: it is what the server renders, what no-JS and
 * touch readers get, and what shows again if the context is lost. It is
 * hidden only once the sheet has drawn its first real frame.
 */
function CoverSheet({
  project,
  index,
  artRef,
  imageRef,
}: {
  project: Project;
  index: number;
  artRef: RefObject<HTMLDivElement | null>;
  imageRef: RefObject<HTMLImageElement | null>;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useGlSurface(canvasRef, {
    renderScale: 0.75,
    dprCap: [1.5, 1],
    near: "50% 0px",
    far: "150% 0px",
    /* The ghost numeral is set in Geist. */
    awaitFonts: true,
    create: (gl, canvas) => {
      const host = canvas.parentElement;
      if (!host) return null;
      const source = imageRef.current ?? drawCoverTexture(project.title, index);
      return createCoverScene(gl, canvas, { source, host });
    },
    onFirstFrame: () => {
      if (canvasRef.current) canvasRef.current.style.opacity = "1";
      if (artRef.current) artRef.current.style.opacity = "0";
    },
    onRelease: () => {
      if (canvasRef.current) canvasRef.current.style.opacity = "0";
      if (artRef.current) artRef.current.style.opacity = "";
    },
  });

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="absolute inset-0 h-full w-full transition-opacity duration-500"
      style={{ opacity: 0 }}
    />
  );
}

/**
 * Generative cover art — a signal trace plotted across a measurement
 * grid, unique per project and deterministic across renders. Stands in
 * for a screenshot deliberately: an abstract read of "something running"
 * rather than a fake product shot.
 */
function GenerativeArt({ project, index }: { project: Project; index: number }) {
  const { path, area, nodes, ticks } = useMemo(
    () => coverGeometry(project.title),
    [project.title]
  );
  const gid = `pc-${index}`;

  return (
    <>
      {/* Ambient accent field */}
      <div
        className="absolute inset-0 transition-transform duration-[1.4s] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.04]"
        style={{
          background: `radial-gradient(70% 80% at ${coverGlowX(index)}% 22%, rgba(200,240,75,0.13), transparent 62%)`,
        }}
      />

      {/* Measurement grid */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(rgba(244,244,242,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(244,244,242,0.04) 1px, transparent 1px)",
          backgroundSize: "56px 56px",
        }}
      />

      {/* Ghost numeral */}
      <span
        className="absolute font-display font-semibold leading-none tracking-[-0.07em] text-[var(--text-1)] opacity-[0.045]"
        style={{
          fontSize: "clamp(11rem, 26vw, 22rem)",
          right: "-0.05em",
          bottom: "-0.22em",
        }}
      >
        {String(index + 1).padStart(2, "0")}
      </span>

      {/* Signal trace */}
      <svg
        viewBox={`0 0 ${COVER_W} ${COVER_H}`}
        preserveAspectRatio="none"
        className="absolute inset-0 h-full w-full"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id={`${gid}-fill`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#C8F04B" stopOpacity="0.16" />
            <stop offset="100%" stopColor="#C8F04B" stopOpacity="0" />
          </linearGradient>
          <linearGradient id={`${gid}-stroke`} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#C8F04B" stopOpacity="0.25" />
            <stop offset="45%" stopColor="#C8F04B" stopOpacity="1" />
            <stop offset="100%" stopColor="#C8F04B" stopOpacity="0.35" />
          </linearGradient>
        </defs>

        {/* Vertical tick rules */}
        {ticks.map((x) => (
          <line
            key={x}
            x1={x}
            y1="0"
            x2={x}
            y2={COVER_H}
            stroke="rgba(244,244,242,0.05)"
            strokeWidth="1"
          />
        ))}

        <path d={area} fill={`url(#${gid}-fill)`} />
        <path
          d={path}
          fill="none"
          stroke={`url(#${gid}-stroke)`}
          strokeWidth="2"
          vectorEffect="non-scaling-stroke"
          className="transition-[filter] duration-700 group-hover:[filter:drop-shadow(0_0_10px_rgba(200,240,75,0.55))]"
        />

        {/* Readings */}
        {nodes.map(([x, y], i) => (
          <g key={i}>
            <line
              x1={x}
              y1={y}
              x2={x}
              y2={COVER_H}
              stroke="rgba(200,240,75,0.18)"
              strokeWidth="1"
              vectorEffect="non-scaling-stroke"
            />
            <circle cx={x} cy={y} r="7" fill="#0A0A0B" />
            <circle
              cx={x}
              cy={y}
              r="3.5"
              fill="#C8F04B"
              className="transition-opacity duration-500"
              style={{ opacity: 0.55 + i * 0.15 }}
            />
          </g>
        ))}
      </svg>
    </>
  );
}

export function ProjectCover({
  project,
  index,
}: {
  project: Project;
  index: number;
}) {
  const [imgOk, setImgOk] = useState(Boolean(project.image));
  const sheet = useMediaQuery(SHEET_QUERY);
  const artRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const hasImage = Boolean(project.image) && imgOk;

  return (
    <div className="absolute inset-0 overflow-hidden bg-[var(--bg-1)]">
      {/* The picture the server renders; the sheet replaces it once drawn. */}
      <div ref={artRef} className="absolute inset-0 transition-opacity duration-500">
        {hasImage ? (
          <Image
            ref={imageRef}
            src={project.image!}
            alt={`${project.title} interface`}
            fill
            sizes="(max-width: 1024px) 100vw, 55vw"
            className="object-cover transition-transform duration-[1.2s] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.03]"
            onError={() => setImgOk(false)}
          />
        ) : (
          <GenerativeArt project={project} index={index} />
        )}
      </div>

      {sheet && (
        <CoverSheet project={project} index={index} artRef={artRef} imageRef={imageRef} />
      )}

      {hasImage ? (
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[var(--bg-0)]/50 to-transparent" />
      ) : (
        <>
          {/* Corner plates — DOM, above the sheet, never distorted */}
          <div className="absolute inset-x-0 top-0 flex items-start justify-between p-6">
            <span className="meta text-[var(--accent)]">{project.kind ?? project.tags[0]}</span>
            <span className="meta">{project.year}</span>
          </div>

          <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-6">
            <div className="flex flex-wrap gap-x-5 gap-y-1">
              {project.tags.slice(0, 3).map((tag) => (
                <span key={tag} className="meta text-[var(--text-2)]">
                  {tag}
                </span>
              ))}
            </div>
            <span className="meta flex shrink-0 items-center gap-2 text-[var(--text-2)]">
              <span
                className={`h-1.5 w-1.5 rounded-full ${
                  project.live ? "bg-[var(--accent)]" : "bg-[var(--text-3)]"
                }`}
              />
              {project.live ? "live" : "source"}
            </span>
          </div>
        </>
      )}
    </div>
  );
}
