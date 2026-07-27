"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import type { Project } from "@/data/types";

const W = 800;
const H = 550;

/** Seeded PRNG — same title always yields the same artwork. */
function mulberry32(a: number) {
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function hash(str: string) {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

/**
 * Generative cover art — a signal trace plotted across a measurement
 * grid, unique per project and deterministic across renders. Stands in
 * for a screenshot deliberately: an abstract read of "something running"
 * rather than a fake product shot.
 */
function GenerativeArt({ project, index }: { project: Project; index: number }) {
  const { path, area, nodes, ticks } = useMemo(() => {
    const rand = mulberry32(hash(project.title));

    /* Three summed sine waves with seeded phase/frequency — smooth, organic,
       and never the same twice across projects. */
    const waves = Array.from({ length: 3 }, () => ({
      amp: 26 + rand() * 52,
      freq: 0.6 + rand() * 2.1,
      phase: rand() * Math.PI * 2,
    }));
    const drift = 0.22 + rand() * 0.5;

    const points: Array<[number, number]> = [];
    const steps = 68;
    for (let i = 0; i <= steps; i++) {
      const t = i / steps;
      const x = t * W;
      let y = H * 0.56;
      for (const w of waves) {
        y += Math.sin(t * Math.PI * 2 * w.freq + w.phase) * w.amp;
      }
      y -= t * H * drift * 0.42; // gentle upward climb
      points.push([x, y]);
    }

    /* Catmull-Rom → cubic bezier for a properly smooth trace. */
    let d = `M ${points[0][0].toFixed(1)} ${points[0][1].toFixed(1)}`;
    for (let i = 0; i < points.length - 1; i++) {
      const p0 = points[i - 1] ?? points[i];
      const p1 = points[i];
      const p2 = points[i + 1];
      const p3 = points[i + 2] ?? p2;
      const c1x = p1[0] + (p2[0] - p0[0]) / 6;
      const c1y = p1[1] + (p2[1] - p0[1]) / 6;
      const c2x = p2[0] - (p3[0] - p1[0]) / 6;
      const c2y = p2[1] - (p3[1] - p1[1]) / 6;
      d += ` C ${c1x.toFixed(1)} ${c1y.toFixed(1)}, ${c2x.toFixed(1)} ${c2y.toFixed(1)}, ${p2[0].toFixed(1)} ${p2[1].toFixed(1)}`;
    }

    /* A few marked readings along the trace. */
    const nodeIdx = [0.16, 0.42, 0.71, 0.93].map((f) =>
      Math.round(f * (points.length - 1))
    );

    return {
      path: d,
      area: `${d} L ${W} ${H} L 0 ${H} Z`,
      nodes: nodeIdx.map((i) => points[i]),
      ticks: Array.from({ length: 9 }, (_, i) => (i + 1) * (W / 10)),
    };
  }, [project.title]);

  const gid = `pc-${index}`;

  return (
    <div className="absolute inset-0 bg-[var(--bg-1)]">
      {/* Ambient accent field */}
      <div
        className="absolute inset-0 transition-transform duration-[1.4s] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.04]"
        style={{
          background: `radial-gradient(70% 80% at ${28 + index * 22}% 22%, rgba(200,240,75,0.13), transparent 62%)`,
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
        viewBox={`0 0 ${W} ${H}`}
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
            y2={H}
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
              y2={H}
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

      {/* Corner plates */}
      <div className="absolute inset-x-0 top-0 flex items-start justify-between p-6">
        <span className="meta text-[var(--accent)]">
          {project.kind ?? project.tags[0]}
        </span>
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
    </div>
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

  if (project.image && imgOk) {
    return (
      <div className="absolute inset-0 overflow-hidden bg-[var(--bg-1)]">
        <Image
          src={project.image}
          alt={`${project.title} interface`}
          fill
          sizes="(max-width: 1024px) 100vw, 55vw"
          className="object-cover transition-transform duration-[1.2s] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.03]"
          onError={() => setImgOk(false)}
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[var(--bg-0)]/50 to-transparent" />
      </div>
    );
  }

  return <GenerativeArt project={project} index={index} />;
}
