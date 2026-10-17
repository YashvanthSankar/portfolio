/**
 * The generative project cover's geometry — a signal trace plotted across
 * a measurement grid, unique per project and deterministic across renders.
 * Pure maths, shared by the SVG the server renders and the canvas texture
 * the WebGL layer distorts, so the two can never drift apart.
 */

export const COVER_W = 800;
export const COVER_H = 550;

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

export interface CoverGeometry {
  /** The sampled trace, in viewBox units. */
  points: Array<[number, number]>;
  /** SVG path of the trace. */
  path: string;
  /** The trace closed down to the bottom edge, for the fill. */
  area: string;
  /** A few marked readings along the trace. */
  nodes: Array<[number, number]>;
  /** Vertical tick rules. */
  ticks: number[];
}

export function coverGeometry(title: string): CoverGeometry {
  const rand = mulberry32(hash(title));

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
    const x = t * COVER_W;
    let y = COVER_H * 0.56;
    for (const w of waves) {
      y += Math.sin(t * Math.PI * 2 * w.freq + w.phase) * w.amp;
    }
    y -= t * COVER_H * drift * 0.42; // gentle upward climb
    points.push([x, y]);
  }

  /* Catmull-Rom → cubic bezier for a properly smooth trace. Whole units
     are plenty at this size and keep the markup a third lighter. */
  const n = (v: number) => Math.round(v);
  let d = `M ${n(points[0][0])} ${n(points[0][1])}`;
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i - 1] ?? points[i];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[i + 2] ?? p2;
    const c1x = p1[0] + (p2[0] - p0[0]) / 6;
    const c1y = p1[1] + (p2[1] - p0[1]) / 6;
    const c2x = p2[0] - (p3[0] - p1[0]) / 6;
    const c2y = p2[1] - (p3[1] - p1[1]) / 6;
    d += ` C ${n(c1x)} ${n(c1y)}, ${n(c2x)} ${n(c2y)}, ${n(p2[0])} ${n(p2[1])}`;
  }

  const nodeIdx = [0.16, 0.42, 0.71, 0.93].map((f) => Math.round(f * (points.length - 1)));

  return {
    points,
    path: d,
    area: `${d} L ${COVER_W} ${COVER_H} L 0 ${COVER_H} Z`,
    nodes: nodeIdx.map((i) => points[i]),
    ticks: Array.from({ length: 9 }, (_, i) => (i + 1) * (COVER_W / 10)),
  };
}

/** Where each cover's ambient lime field sits — drifts right with the index. */
export function coverGlowX(index: number) {
  return 28 + index * 22;
}

/**
 * Rasterises the cover to an offscreen canvas, for use as a texture. A
 * faithful copy of the SVG rendering in project-cover.tsx minus the text
 * plates, which stay in the DOM so they are never distorted.
 */
export function drawCoverTexture(
  title: string,
  index: number,
  width = 1024,
  height = 704
): HTMLCanvasElement {
  const c = document.createElement("canvas");
  c.width = width;
  c.height = height;
  const ctx = c.getContext("2d");
  if (!ctx) return c;

  const sx = width / COVER_W;
  const sy = height / COVER_H;

  /* Surface */
  ctx.fillStyle = "#101012";
  ctx.fillRect(0, 0, width, height);

  /* Ambient accent field */
  const gx = (coverGlowX(index) / 100) * width;
  const gy = 0.22 * height;
  const glow = ctx.createRadialGradient(gx, gy, 0, gx, gy, width * 0.62);
  glow.addColorStop(0, "rgba(200,240,75,0.13)");
  glow.addColorStop(1, "rgba(200,240,75,0)");
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, width, height);

  /* Measurement grid — 56 CSS px at the cover's typical on-screen size. */
  const cell = 56 * (width / 800);
  ctx.strokeStyle = "rgba(244,244,242,0.04)";
  ctx.lineWidth = 1;
  ctx.beginPath();
  for (let x = 0; x <= width; x += cell) {
    ctx.moveTo(x + 0.5, 0);
    ctx.lineTo(x + 0.5, height);
  }
  for (let y = 0; y <= height; y += cell) {
    ctx.moveTo(0, y + 0.5);
    ctx.lineTo(width, y + 0.5);
  }
  ctx.stroke();

  /* Ghost numeral */
  const family =
    getComputedStyle(document.body).getPropertyValue("font-family") ||
    "system-ui, sans-serif";
  ctx.font = `600 ${Math.round(height * 0.62)}px ${family}`;
  ctx.textAlign = "right";
  ctx.textBaseline = "alphabetic";
  ctx.fillStyle = "rgba(244,244,242,0.045)";
  ctx.letterSpacing = "-0.07em";
  ctx.fillText(String(index + 1).padStart(2, "0"), width * 1.01, height * 1.0);

  const g = coverGeometry(title);
  ctx.save();
  ctx.scale(sx, sy);

  /* Tick rules */
  ctx.strokeStyle = "rgba(244,244,242,0.05)";
  ctx.lineWidth = 1 / sx;
  ctx.beginPath();
  for (const x of g.ticks) {
    ctx.moveTo(x, 0);
    ctx.lineTo(x, COVER_H);
  }
  ctx.stroke();

  /* Area fill */
  const fill = ctx.createLinearGradient(0, 0, 0, COVER_H);
  fill.addColorStop(0, "rgba(200,240,75,0.16)");
  fill.addColorStop(1, "rgba(200,240,75,0)");
  ctx.fillStyle = fill;
  ctx.fill(new Path2D(g.area));

  /* Trace */
  const stroke = ctx.createLinearGradient(0, 0, COVER_W, 0);
  stroke.addColorStop(0, "rgba(200,240,75,0.25)");
  stroke.addColorStop(0.45, "rgba(200,240,75,1)");
  stroke.addColorStop(1, "rgba(200,240,75,0.35)");
  ctx.strokeStyle = stroke;
  ctx.lineWidth = 2 / sx;
  ctx.lineJoin = "round";
  ctx.stroke(new Path2D(g.path));

  /* Readings */
  g.nodes.forEach(([x, y], i) => {
    ctx.strokeStyle = "rgba(200,240,75,0.18)";
    ctx.lineWidth = 1 / sx;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x, COVER_H);
    ctx.stroke();
    ctx.fillStyle = "#0A0A0B";
    ctx.beginPath();
    ctx.ellipse(x, y, 7 / sx, 7 / sy, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = `rgba(200,240,75,${0.55 + i * 0.15})`;
    ctx.beginPath();
    ctx.ellipse(x, y, 3.5 / sx, 3.5 / sy, 0, 0, Math.PI * 2);
    ctx.fill();
  });

  ctx.restore();
  return c;
}
