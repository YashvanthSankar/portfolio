import { hands, HANDS_CARET, HANDS_CELL_RATIO, HANDS_COLS, HANDS_ROWS } from "@/data/hands";
import { HandsFx } from "@/components/hands-fx";

/* One character cell in SVG units. The glyphs are drawn at 10px and Geist
   Mono advances exactly 0.6em, so a character is 6 wide and a row lands on
   the grid by itself. (No textLength: a browser that re-measures a row
   after hands-fx.tsx rewrites it can stretch that row across the page.)
   The height keeps the cell proportions of the wallpaper. */
const CW = 6;
const CH = CW * HANDS_CELL_RATIO;

/* The art splits into two hands at the caret's column. */
const SPLIT = HANDS_CARET.col;

/* How far, in columns, each hand travels toward the other as the page
   scrolls. Rows that run off the picture's edge are extended by the same
   amount (a mirror of their last characters), so an arm never ends in mid
   air when its hand moves in. */
const REACH = 20;

/* Rows appear one after another on load, top to bottom. */
const ROW_DELAY_MS = 8;

const mirror = (s: string) => [...s].reverse().join("");

function Row({ text, col, row }: { text: string; col: number; row: number }) {
  const trimmed = text.trimEnd();
  const lead = trimmed.length - trimmed.trimStart().length;
  if (!trimmed.trim()) return null;
  return (
    <text
      data-r={row}
      data-c={col + lead}
      x={(col + lead) * CW}
      y={(row + 0.78) * CH}
      style={{ animationDelay: `${row * ROW_DELAY_MS}ms` }}
    >
      {trimmed.slice(lead).replaceAll(" ", " ")}
    </text>
  );
}

/**
 * The hero's background: the two hands from The Creation of Adam, as text —
 * the same characters as the wallpaper it came from, one for one. Each row
 * of data/hands.ts becomes a <text> per hand. An SVG rather than a <pre>
 * because it scales with the viewport and can crop itself on narrow
 * screens.
 *
 * The markup is static; components/hands-fx.tsx adds the pointer scramble
 * and moves the hands together on scroll.
 */
export function Hands() {
  const width = HANDS_COLS * CW;
  const height = Math.round(HANDS_ROWS * CH);

  return (
    <svg
      className="hands"
      viewBox={`0 0 ${width} ${height}`}
      style={{ aspectRatio: `${width} / ${height}`, "--reach": `${REACH * CW}px` } as React.CSSProperties}
      preserveAspectRatio="xMidYMid slice"
      role="img"
      aria-label="Two hands reaching toward each other, drawn in ASCII characters, with a text cursor between the fingertips."
    >
      <g className="hand-l">
        {hands.map((row, i) => {
          const extend = row[0] !== " ";
          const text = (extend ? mirror(row.slice(0, REACH)) : "") + row.slice(0, SPLIT);
          return <Row key={i} text={text} col={extend ? -REACH : 0} row={i} />;
        })}
      </g>
      <g className="hand-r">
        {hands.map((row, i) => {
          const extend = row[HANDS_COLS - 1] !== " ";
          const text = row.slice(SPLIT) + (extend ? mirror(row.slice(-REACH)) : "");
          return <Row key={i} text={text} col={SPLIT} row={i} />;
        })}
      </g>
      {/* Two cells wide and tall: at this density one cell would vanish. */}
      <rect
        className="caret"
        x={(HANDS_CARET.col - 0.5) * CW}
        y={(HANDS_CARET.row - 0.5) * CH}
        width={CW * 2}
        height={CH * 2}
      />
      <HandsFx cw={CW} ch={CH} reach={REACH * CW} />
    </svg>
  );
}
