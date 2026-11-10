/**
 * Rebuilds data/hands.ts — the hero's ASCII hands — from the wallpaper.
 *
 *   node scripts/ascii-hands.mjs path/to/hands-ascii.jpg [debug-dir]
 *
 * The source image is itself ASCII art, so this does not re-sample it: it
 * reads it back. It finds the character grid (pitch and phase of the glyph
 * columns and rows), cuts the image into cells, clusters the cells by shape
 * into glyphs, and writes the recovered characters out
 * one for one. Rows above and below the hands are dropped.
 *
 * With a debug dir it also writes templates.png: the cluster averages from
 * least to most ink. LABELS below names them in that order; if the source
 * image changes, look at templates.png and update LABELS to match.
 */
import { writeFile } from "node:fs/promises";
import sharp from "sharp";

/* One character per cluster, in order of ink. Read off templates.png: more
   clusters than glyphs, so a glyph that lands in two still gets one name. */
const LABELS = ".-:+=*##%%@@@@";
const PW = 10; // patch size every cell is resampled to
const PH = 18;
const MARGIN_ROWS = 2;

const [src, debugDir] = process.argv.slice(2);
if (!src) {
  console.error("usage: node scripts/ascii-hands.mjs <image> [debug-dir]");
  process.exit(1);
}

const { data, info } = await sharp(src).greyscale().raw().toBuffer({ resolveWithObject: true });
const W = info.width;
const H = info.height;

/* ── 1. The grid ─────────────────────────────────────────────────────────
   Glyphs repeat at a fixed pitch, so the brightness profile along each axis
   has one dominant frequency. Scan pitches for the strongest Fourier
   component; its phase says where the glyph centres fall. */
function findGrid(profile, lo, hi, step) {
  const n = profile.length;
  const mean = profile.reduce((a, b) => a + b, 0) / n;
  let best = { mag: -1 };
  for (let p = lo; p <= hi; p += step) {
    let re = 0;
    let im = 0;
    for (let i = 0; i < n; i++) {
      const a = (2 * Math.PI * i) / p;
      re += (profile[i] - mean) * Math.cos(a);
      im += (profile[i] - mean) * Math.sin(a);
    }
    const mag = Math.hypot(re, im);
    if (mag > best.mag) best = { mag, pitch: p, centre: (((Math.atan2(im, re) / (2 * Math.PI)) * p) % p + p) % p };
  }
  return best;
}

const colProfile = new Float64Array(W);
const rowProfile = new Float64Array(H);
for (let y = 0; y < H; y++)
  for (let x = 0; x < W; x++) {
    const v = data[y * W + x];
    colProfile[x] += v;
    rowProfile[y] += v;
  }

const gx = findGrid(colProfile, W / 420, W / 380, 0.001);
const gy = findGrid(rowProfile, H / 130, H / 116, 0.001);
const COLS = Math.round(W / gx.pitch);
const ROWS = Math.round(H / gy.pitch);
const x0 = gx.centre - gx.pitch / 2; // left edge of a cell
const y0 = gy.centre - gy.pitch / 2;
console.error(`grid ${COLS} × ${ROWS}, cell ${gx.pitch.toFixed(3)} × ${gy.pitch.toFixed(3)} px, origin ${x0.toFixed(2)}, ${y0.toFixed(2)}`);

/* ── 2. Cells ────────────────────────────────────────────────────────────
   Bilinear-sample every cell to a PW × PH patch. */
const at = (x, y) => {
  const xi = Math.min(W - 1, Math.max(0, x));
  const yi = Math.min(H - 1, Math.max(0, y));
  const xa = Math.floor(xi);
  const ya = Math.floor(yi);
  const xb = Math.min(W - 1, xa + 1);
  const yb = Math.min(H - 1, ya + 1);
  const fx = xi - xa;
  const fy = yi - ya;
  return (
    data[ya * W + xa] * (1 - fx) * (1 - fy) +
    data[ya * W + xb] * fx * (1 - fy) +
    data[yb * W + xa] * (1 - fx) * fy +
    data[yb * W + xb] * fx * fy
  );
};

const N = PW * PH;
const cells = [];
for (let r = 0; r < ROWS; r++)
  for (let c = 0; c < COLS; c++) {
    const patch = new Float32Array(N);
    let sum = 0;
    for (let j = 0; j < PH; j++)
      for (let i = 0; i < PW; i++) {
        const v = at(x0 + (c + (i + 0.5) / PW) * gx.pitch - 0.5, y0 + (r + (j + 0.5) / PH) * gy.pitch - 0.5);
        patch[j * PW + i] = v;
        sum += v;
      }
    cells.push({ r, c, patch, mean: sum / N, k: -1 });
  }

/* ── 3. Glyphs ───────────────────────────────────────────────────────────
   Blank cells drop out by brightness. The rest are k-means clustered on
   the patch itself. */
const inked = cells.filter((c) => c.mean > 6);
const dist = (p, m) => {
  let d = 0;
  for (let i = 0; i < N; i++) {
    const e = p[i] - m[i];
    d += e * e;
  }
  return d;
};

/* Farthest-point seeding: start from the brightest cell, then keep taking
   the cell least like any seed so far. Deterministic, and it finds the
   rare glyphs that brightness quantiles would fold into their neighbours. */
const K = LABELS.length;
let centres = [inked.reduce((a, b) => (b.mean > a.mean ? b : a)).patch];
const nearest = inked.map((c) => dist(c.patch, centres[0]));
while (centres.length < K) {
  let far = 0;
  for (let i = 1; i < inked.length; i++) if (nearest[i] > nearest[far]) far = i;
  centres.push(inked[far].patch);
  inked.forEach((c, i) => (nearest[i] = Math.min(nearest[i], dist(c.patch, inked[far].patch))));
}

const counts = new Array(K).fill(0);
for (let iter = 0; iter < 60; iter++) {
  let moved = 0;
  for (const cell of inked) {
    let bestK = 0;
    let bestD = Infinity;
    for (let k = 0; k < K; k++) {
      const d = dist(cell.patch, centres[k]);
      if (d < bestD) {
        bestD = d;
        bestK = k;
      }
    }
    if (cell.k !== bestK) moved++;
    cell.k = bestK;
  }
  const sums = Array.from({ length: K }, () => new Float32Array(N));
  counts.fill(0);
  for (const cell of inked) {
    counts[cell.k]++;
    for (let i = 0; i < N; i++) sums[cell.k][i] += cell.patch[i];
  }
  centres = sums.map((s, k) => (counts[k] ? s.map((v) => v / counts[k]) : centres[k]));
  if (!moved) break;
}

/* Clusters sorted by ink, then named by LABELS (read off templates.png). */
const order = centres
  .map((m, k) => ({ k, ink: m.reduce((a, b) => a + b, 0) }))
  .sort((a, b) => a.ink - b.ink)
  .map((o) => o.k);
const charOf = new Array(K);
order.forEach((k, i) => (charOf[k] = LABELS[i]));
console.error("clusters by ink:", order.map((k, i) => `${LABELS[i]}×${counts[k]}`).join(" "));

if (debugDir) {
  const strip = Buffer.alloc(K * PW * PH);
  order.forEach((k, i) => {
    for (let j = 0; j < PH; j++)
      for (let x = 0; x < PW; x++) strip[j * K * PW + i * PW + x] = Math.min(255, centres[k][j * PW + x] * 1.6);
  });
  await sharp(strip, { raw: { width: K * PW, height: PH, channels: 1 } })
    .resize(K * PW * 8, PH * 8, { kernel: "nearest" })
    .png()
    .toFile(`${debugDir}/templates.png`);
}

/* ── 4. Rows ─────────────────────────────────────────────────────────── */
const grid = Array.from({ length: ROWS }, () => new Array(COLS).fill(" "));
for (const cell of inked) grid[cell.r][cell.c] = charOf[cell.k];
let rows = grid.map((r) => r.join(""));

const used = rows.map((r) => r.trim().length > 3);
const first = Math.max(0, used.indexOf(true) - MARGIN_ROWS);
const last = Math.min(ROWS - 1, used.lastIndexOf(true) + MARGIN_ROWS);
console.error(`rows ${first}–${last} of ${ROWS} kept`);
rows = rows.slice(first, last + 1);

/* The caret goes in the narrowest gap that crosses the centre line: the
   space between the two fingertips. */
let caret = { col: COLS >> 1, row: rows.length >> 1, width: Infinity };
rows.forEach((row, r) => {
  const mid = COLS >> 1;
  if (row[mid] !== " ") return;
  let l = mid;
  let rgt = mid;
  while (l >= 0 && row[l] === " ") l--;
  while (rgt < COLS && row[rgt] === " ") rgt++;
  if (l < 0 || rgt >= COLS) return;
  if (rgt - l < caret.width) caret = { col: (l + rgt) >> 1, row: r, width: rgt - l };
});
console.error(`caret at col ${caret.col}, row ${caret.row} (gap ${caret.width})`);

const out = `/* Generated by scripts/ascii-hands.mjs — do not edit by hand. */

export const HANDS_COLS = ${COLS};
export const HANDS_ROWS = ${rows.length};
/** Height of a character cell relative to its width, as in the source. */
export const HANDS_CELL_RATIO = ${(gy.pitch / gx.pitch).toFixed(4)};

/** The empty cell midway between the two fingertips. */
export const HANDS_CARET = { col: ${caret.col}, row: ${caret.row} };

export const hands: string[] = ${JSON.stringify(rows, null, 2)};
`;

await writeFile(new URL("../data/hands.ts", import.meta.url), out);
console.log(rows.map((r, i) => String(i).padStart(3) + " " + r).join("\n"));
