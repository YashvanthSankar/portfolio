import { hands, HANDS_CARET, HANDS_CELL_RATIO, HANDS_COLS, HANDS_ROWS } from "@/data/hands";

/* One character cell in SVG units. The glyphs are drawn at 10px, so a 6-wide
   cell matches a monospace advance of 0.6em; the height keeps the cell
   proportions of the wallpaper the art was read from. */
const CW = 6;
const CH = CW * HANDS_CELL_RATIO;

/**
 * The hero's background: the two hands from The Creation of Adam, as text —
 * the same characters as the wallpaper it came from, one for one. Each row
 * of data/hands.ts is one <text>, pinned to the grid with textLength so the
 * picture holds whatever monospace font loads. An SVG rather than a <pre>
 * because it scales with the viewport and can crop itself on narrow screens.
 */
export function Hands() {
  const width = HANDS_COLS * CW;
  const height = Math.round(HANDS_ROWS * CH);

  return (
    <svg
      className="hands"
      viewBox={`0 0 ${width} ${height}`}
      style={{ aspectRatio: `${width} / ${height}` }}
      preserveAspectRatio="xMidYMid slice"
      role="img"
      aria-label="Two hands reaching toward each other, drawn in ASCII characters, with a text cursor between the fingertips."
    >
      {hands.map((row, i) => {
        const text = row.trimEnd();
        const start = text.length - text.trimStart().length;
        if (!text.trim()) return null;
        return (
          <text
            key={i}
            x={start * CW}
            y={(i + 0.78) * CH}
            textLength={(text.length - start) * CW}
            lengthAdjust="spacing"
          >
            {text.slice(start).replaceAll(" ", "\u00a0")}
          </text>
        );
      })}
      {/* Two cells wide and tall: at this density one cell would vanish. */}
      <rect
        className="caret"
        x={(HANDS_CARET.col - 0.5) * CW}
        y={(HANDS_CARET.row - 0.5) * CH}
        width={CW * 2}
        height={CH * 2}
      />
    </svg>
  );
}
