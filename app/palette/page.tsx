import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Palette Visualizer — Yashvanth S",
  description: "Preview the full rose color system used across the portfolio — light and dark mode.",
};

/* ── token type ─────────────────────────────────────────────────────────── */
// css  → actual CSS value used in style prop (can be hex or oklch())
// display → text shown on the swatch (hex or raw function)
interface Token {
  name: string;
  css: string;
  display: string;
  label: string;
}

/* ── light mode tokens  (:root in globals.css) ──────────────────────────── */
const lightGroups: { group: string; tokens: Token[] }[] = [
  {
    group: "Base",
    tokens: [
      { name: "background",  css: "#FFF1F2", display: "#FFF1F2", label: "Page background" },
      { name: "foreground",  css: "#1f0208", display: "#1f0208", label: "Primary text"    },
    ],
  },
  {
    group: "Card",
    tokens: [
      { name: "card",             css: "#FFE4E6", display: "#FFE4E6", label: "Card surface"       },
      { name: "card-foreground",  css: "#1f0208", display: "#1f0208", label: "Card text"           },
    ],
  },
  {
    group: "Popover",
    tokens: [
      { name: "popover",             css: "#FFF1F2", display: "#FFF1F2", label: "Popover surface" },
      { name: "popover-foreground",  css: "#1f0208", display: "#1f0208", label: "Popover text"    },
    ],
  },
  {
    group: "Primary",
    tokens: [
      { name: "primary",             css: "#1f0208", display: "#1f0208", label: "Primary fill"       },
      { name: "primary-foreground",  css: "#FFF1F2", display: "#FFF1F2", label: "Primary text on fill" },
    ],
  },
  {
    group: "Secondary",
    tokens: [
      { name: "secondary",             css: "#FECDD3", display: "#FECDD3", label: "Secondary fill" },
      { name: "secondary-foreground",  css: "#1f0208", display: "#1f0208", label: "Text on secondary" },
    ],
  },
  {
    group: "Muted",
    tokens: [
      { name: "muted",             css: "#FFE4E6", display: "#FFE4E6", label: "Muted background" },
      { name: "muted-foreground",  css: "#9f3a52", display: "#9f3a52", label: "Muted text"       },
    ],
  },
  {
    group: "Accent",
    tokens: [
      { name: "accent",             css: "#FECDD3", display: "#FECDD3", label: "Accent fill"       },
      { name: "accent-foreground",  css: "#09090b", display: "#09090b", label: "Text on accent"    },
    ],
  },
  {
    group: "Destructive",
    tokens: [
      {
        name: "destructive",
        css: "oklch(0.577 0.245 27.325)",
        display: "oklch(0.577 0.245 27.325)",
        label: "Destructive / error",
      },
    ],
  },
  {
    group: "Form",
    tokens: [
      { name: "border",  css: "#FECDD3", display: "#FECDD3", label: "Borders / dividers" },
      { name: "input",   css: "#FFE4E6", display: "#FFE4E6", label: "Input background"   },
      { name: "ring",    css: "#FDA4AF", display: "#FDA4AF", label: "Focus rings"         },
    ],
  },
  {
    group: "Sidebar",
    tokens: [
      { name: "sidebar",                    css: "#FFE4E6", display: "#FFE4E6", label: "Sidebar surface"         },
      { name: "sidebar-foreground",         css: "#09090b", display: "#09090b", label: "Sidebar text"            },
      { name: "sidebar-primary",            css: "#E11D48", display: "#E11D48", label: "Sidebar primary fill"    },
      { name: "sidebar-primary-foreground", css: "#FFF1F2", display: "#FFF1F2", label: "Text on sidebar primary" },
      { name: "sidebar-accent",             css: "#FECDD3", display: "#FECDD3", label: "Sidebar accent fill"     },
      { name: "sidebar-accent-foreground",  css: "#09090b", display: "#09090b", label: "Text on sidebar accent"  },
      { name: "sidebar-border",             css: "#FECDD3", display: "#FECDD3", label: "Sidebar border"          },
      { name: "sidebar-ring",               css: "#FDA4AF", display: "#FDA4AF", label: "Sidebar focus ring"      },
    ],
  },
];

/* ── dark mode tokens  (.dark in globals.css) ───────────────────────────── */
const darkGroups: { group: string; tokens: Token[] }[] = [
  {
    group: "Base",
    tokens: [
      { name: "background",  css: "#0d0307", display: "#0d0307", label: "Page background" },
      { name: "foreground",  css: "#fdf0f2", display: "#fdf0f2", label: "Primary text"    },
    ],
  },
  {
    group: "Card",
    tokens: [
      { name: "card",             css: "#1a0509", display: "#1a0509", label: "Card surface" },
      { name: "card-foreground",  css: "#fafafa",  display: "#fafafa",  label: "Card text"   },
    ],
  },
  {
    group: "Popover",
    tokens: [
      { name: "popover",             css: "#1a0509", display: "#1a0509", label: "Popover surface" },
      { name: "popover-foreground",  css: "#fafafa",  display: "#fafafa",  label: "Popover text"  },
    ],
  },
  {
    group: "Primary",
    tokens: [
      { name: "primary",             css: "#fafafa",  display: "#fafafa",  label: "Primary fill"         },
      { name: "primary-foreground",  css: "#0d0307", display: "#0d0307", label: "Text on primary fill" },
    ],
  },
  {
    group: "Secondary",
    tokens: [
      { name: "secondary",             css: "#2d0c12", display: "#2d0c12", label: "Secondary fill"   },
      { name: "secondary-foreground",  css: "#fafafa",  display: "#fafafa",  label: "Text on secondary" },
    ],
  },
  {
    group: "Muted",
    tokens: [
      { name: "muted",             css: "#2d0c12", display: "#2d0c12", label: "Muted background" },
      { name: "muted-foreground",  css: "#c4849a", display: "#c4849a", label: "Muted text"       },
    ],
  },
  {
    group: "Accent",
    tokens: [
      { name: "accent",             css: "#2d0c12", display: "#2d0c12", label: "Accent fill"    },
      { name: "accent-foreground",  css: "#fafafa",  display: "#fafafa",  label: "Text on accent" },
    ],
  },
  {
    group: "Destructive",
    tokens: [
      {
        name: "destructive",
        css: "oklch(0.704 0.191 22.216)",
        display: "oklch(0.704 0.191 22.216)",
        label: "Destructive / error",
      },
    ],
  },
  {
    group: "Form",
    tokens: [
      { name: "border",  css: "#3b0f18", display: "#3b0f18", label: "Borders / dividers" },
      { name: "input",   css: "#2d0c12", display: "#2d0c12", label: "Input background"   },
      { name: "ring",    css: "#6b1528", display: "#6b1528", label: "Focus rings"         },
    ],
  },
  {
    group: "Sidebar",
    tokens: [
      { name: "sidebar",                    css: "#1a0509", display: "#1a0509", label: "Sidebar surface"         },
      { name: "sidebar-foreground",         css: "#fafafa",  display: "#fafafa",  label: "Sidebar text"          },
      { name: "sidebar-primary",            css: "#FB7185", display: "#FB7185", label: "Sidebar primary fill"    },
      { name: "sidebar-primary-foreground", css: "#0d0307", display: "#0d0307", label: "Text on sidebar primary" },
      { name: "sidebar-accent",             css: "#2d0c12", display: "#2d0c12", label: "Sidebar accent fill"     },
      { name: "sidebar-accent-foreground",  css: "#fafafa",  display: "#fafafa",  label: "Text on sidebar accent" },
      { name: "sidebar-border",             css: "#3b0f18", display: "#3b0f18", label: "Sidebar border"          },
      { name: "sidebar-ring",               css: "#6b1528", display: "#6b1528", label: "Sidebar focus ring"      },
    ],
  },
];

/* ── helpers ────────────────────────────────────────────────────────────── */
function isHex(v: string) { return v.startsWith("#"); }

function isDark(hex: string) {
  if (!isHex(hex)) return true; // oklch — assume dark for label contrast
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return (r * 299 + g * 587 + b * 114) / 1000 < 140;
}

/* ── swatch card ────────────────────────────────────────────────────────── */
function Swatch({ name, css, display, label }: Token) {
  const dark = isDark(css);
  const isLong = display.startsWith("oklch");
  return (
    <div className="rounded-xl overflow-hidden border border-rose-200 dark:border-rose-900/40">
      {/* color preview */}
      <div
        className="h-20 w-full flex items-end p-2.5"
        style={{ backgroundColor: css }}
      >
        <span
          className="font-mono text-[9px] tracking-wide px-1.5 py-0.5 rounded leading-snug break-all"
          style={{
            color: dark ? "rgba(255,255,255,0.85)" : "rgba(0,0,0,0.55)",
            backgroundColor: dark ? "rgba(0,0,0,0.28)" : "rgba(255,255,255,0.5)",
          }}
        >
          {isLong ? display.replace("oklch(", "").replace(")", "") : display.toUpperCase()}
        </span>
      </div>
      {/* meta */}
      <div className="px-3 py-2.5 bg-rose-50 dark:bg-[#1a0509]">
        <p className="text-[11px] font-semibold text-zinc-800 dark:text-zinc-200 truncate font-mono">
          --{name}
        </p>
        <p className="text-[10px] text-zinc-400 dark:text-zinc-600 mt-0.5 truncate">
          {label}
        </p>
      </div>
    </div>
  );
}

/* ── token group ────────────────────────────────────────────────────────── */
function TokenGroup({ group, tokens }: { group: string; tokens: Token[] }) {
  return (
    <div>
      <p className="font-mono text-[10px] tracking-[0.2em] uppercase text-rose-400 dark:text-rose-700 mb-3">
        {group}
      </p>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
        {tokens.map((t) => (
          <Swatch key={t.name} {...t} />
        ))}
      </div>
    </div>
  );
}

/* ── page ───────────────────────────────────────────────────────────────── */
export default function PalettePage() {
  return (
    <div className="min-h-screen bg-[#FFF1F2] dark:bg-[#0d0307]
      [background-image:linear-gradient(rgba(0,0,0,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.04)_1px,transparent_1px)]
      dark:[background-image:linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)]
      [background-size:48px_48px]">

      {/* ── navbar ──────────────────────────────────────────────────────── */}
      <div className="sticky top-0 z-40 border-b border-rose-200 dark:border-rose-900/40
                      bg-[#FFF1F2]/90 dark:bg-[#0d0307]/90 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto px-6 sm:px-10 h-14 flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-zinc-500 dark:text-zinc-400
                       hover:text-zinc-900 dark:hover:text-white transition-colors duration-150"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            back to portfolio
          </Link>
          <span className="font-mono text-[10px] tracking-[0.22em] uppercase text-zinc-400 dark:text-zinc-600">
            palette.visualizer
          </span>
        </div>
      </div>

      {/* ── hero card ───────────────────────────────────────────────────── */}
      <div className="max-w-6xl mx-auto px-6 sm:px-10 pt-14 pb-10">
        <div className="relative rounded-2xl overflow-hidden
                        bg-[#FFE4E6] dark:bg-[#1a0509]
                        border border-rose-200 dark:border-rose-900/40
                        p-10 sm:p-14">
          {/* grain */}
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.025]"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
              backgroundSize: "180px 180px",
            }}
          />
          <p className="font-mono text-[10px] tracking-[0.28em] uppercase
                        text-rose-400 dark:text-rose-700 mb-6">
            // palette.visualizer
          </p>
          <h1 className="text-[clamp(3rem,10vw,7rem)] font-extrabold leading-[0.92] tracking-tight
                         text-rose-700 dark:text-rose-300 mb-8">
            Palette<br />Visualizer
          </h1>
          <p className="max-w-sm text-sm sm:text-base text-rose-500 dark:text-rose-400/70 leading-relaxed mb-10">
            Preview your colors on real designs to see how they look in context
            before using them in your projects.
          </p>
          <a
            href="#swatches"
            className="inline-flex items-center gap-3
                       font-mono text-[11px] tracking-[0.2em] uppercase
                       text-rose-700 dark:text-rose-400
                       hover:gap-5 transition-all duration-200 group"
          >
            open the visualizer
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
          </a>
        </div>
      </div>

      {/* ── token grids ─────────────────────────────────────────────────── */}
      <div id="swatches" className="max-w-6xl mx-auto px-6 sm:px-10 pb-24 space-y-16">

        {/* light ── */}
        <div>
          <div className="flex items-center gap-4 mb-8">
            <div className="h-3 w-3 rounded-full bg-[#FFF1F2] border-2 border-rose-300" />
            <h2 className="font-mono text-xs tracking-[0.22em] uppercase text-zinc-500 dark:text-zinc-400">
              light mode
            </h2>
            <div className="flex-1 h-px bg-rose-200 dark:bg-rose-900/40" />
            <span className="font-mono text-[10px] text-zinc-400 dark:text-zinc-600">:root</span>
          </div>
          <div className="space-y-8">
            {lightGroups.map((g) => (
              <TokenGroup key={g.group + "-light"} {...g} />
            ))}
          </div>
        </div>

        {/* dark ── */}
        <div>
          <div className="flex items-center gap-4 mb-8">
            <div className="h-3 w-3 rounded-full bg-[#0d0307] border-2 border-rose-900/60" />
            <h2 className="font-mono text-xs tracking-[0.22em] uppercase text-zinc-500 dark:text-zinc-400">
              dark mode
            </h2>
            <div className="flex-1 h-px bg-rose-200 dark:bg-rose-900/40" />
            <span className="font-mono text-[10px] text-zinc-400 dark:text-zinc-600">.dark</span>
          </div>
          <div className="space-y-8">
            {darkGroups.map((g) => (
              <TokenGroup key={g.group + "-dark"} {...g} />
            ))}
          </div>
        </div>

        {/* rose scale strip ── */}
        <div>
          <div className="flex items-center gap-4 mb-6">
            <h2 className="font-mono text-xs tracking-[0.22em] uppercase text-zinc-500 dark:text-zinc-400">
              rose scale — full ramp
            </h2>
            <div className="flex-1 h-px bg-rose-200 dark:bg-rose-900/40" />
          </div>
          <div className="flex rounded-xl overflow-hidden border border-rose-200 dark:border-rose-900/40 h-16">
            {[
              { stop: "50",  hex: "#FFF1F2" },
              { stop: "100", hex: "#FFE4E6" },
              { stop: "200", hex: "#FECDD3" },
              { stop: "300", hex: "#FDA4AF" },
              { stop: "400", hex: "#FB7185" },
              { stop: "500", hex: "#F43F5E" },
              { stop: "600", hex: "#E11D48" },
              { stop: "700", hex: "#BE123C" },
              { stop: "800", hex: "#9F1239" },
              { stop: "900", hex: "#881337" },
              { stop: "950", hex: "#4C0519" },
            ].map(({ stop, hex }) => (
              <div
                key={stop}
                className="flex-1 flex items-end justify-center pb-1.5 group"
                style={{ backgroundColor: hex }}
                title={`rose-${stop}: ${hex}`}
              >
                <span
                  className="font-mono text-[8px] opacity-0 group-hover:opacity-100 transition-opacity duration-150 select-none"
                  style={{ color: isDark(hex) ? "rgba(255,255,255,0.8)" : "rgba(0,0,0,0.5)" }}
                >
                  {stop}
                </span>
              </div>
            ))}
          </div>
          <div className="flex mt-1.5">
            {["50","100","200","300","400","500","600","700","800","900","950"].map((s) => (
              <div key={s} className="flex-1 text-center font-mono text-[8px] text-zinc-400 dark:text-zinc-600">{s}</div>
            ))}
          </div>
        </div>

        {/* in-context examples ── */}
        <div>
          <div className="flex items-center gap-4 mb-6">
            <h2 className="font-mono text-xs tracking-[0.22em] uppercase text-zinc-500 dark:text-zinc-400">
              in context
            </h2>
            <div className="flex-1 h-px bg-rose-200 dark:bg-rose-900/40" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {/* card mockup */}
            <div className="rounded-xl border border-rose-200 dark:border-rose-900/40
                            bg-rose-50 dark:bg-[#1a0509] p-5 space-y-3">
              <div className="h-2 w-24 rounded-full bg-rose-200 dark:bg-[#2d0c12]" />
              <div className="h-2 w-full rounded-full bg-rose-100 dark:bg-[#2d0c12]/60" />
              <div className="h-2 w-4/5 rounded-full bg-rose-100 dark:bg-[#2d0c12]/60" />
              <div className="flex gap-2 pt-1">
                <div className="h-6 w-16 rounded-lg bg-[#1a0509] dark:bg-white" />
                <div className="h-6 w-16 rounded-lg border border-rose-200 dark:border-rose-900/40" />
              </div>
              <p className="font-mono text-[9px] tracking-widest uppercase text-zinc-400 dark:text-zinc-600">card surface</p>
            </div>

            {/* button variants */}
            <div className="rounded-xl border border-rose-200 dark:border-rose-900/40
                            bg-rose-50 dark:bg-[#1a0509] p-5 flex flex-col gap-3 justify-center">
              <button className="w-full py-2 rounded-lg bg-[#1a0509] dark:bg-white
                                 text-white dark:text-zinc-900 text-sm font-medium">
                primary action
              </button>
              <button className="w-full py-2 rounded-lg border border-rose-200 dark:border-rose-900/40
                                 text-zinc-600 dark:text-zinc-300 text-sm">
                secondary action
              </button>
              <button className="w-full py-2 rounded-lg bg-rose-100 dark:bg-[#2d0c12]
                                 text-rose-700 dark:text-rose-400 text-sm">
                accent action
              </button>
              <p className="font-mono text-[9px] tracking-widest uppercase text-zinc-400 dark:text-zinc-600">button variants</p>
            </div>

            {/* input + chips */}
            <div className="rounded-xl border border-rose-200 dark:border-rose-900/40
                            bg-rose-50 dark:bg-[#1a0509] p-5 flex flex-col gap-3 justify-center">
              <input
                readOnly
                defaultValue="yashvanthsankar@gmail.com"
                className="w-full px-3 py-2 text-sm rounded-lg
                           border border-rose-200 dark:border-rose-900/40
                           bg-[#FFE4E6] dark:bg-[#2d0c12]
                           text-zinc-800 dark:text-zinc-200
                           focus:outline-none"
              />
              <div className="flex gap-1.5 flex-wrap">
                {["#FFF1F2","#FFE4E6","#FECDD3","#FDA4AF","#FB7185","#E11D48"].map((c) => (
                  <div
                    key={c}
                    className="h-6 w-6 rounded-md border border-rose-200/60 dark:border-rose-900/30 shrink-0"
                    style={{ backgroundColor: c }}
                    title={c}
                  />
                ))}
              </div>
              <p className="font-mono text-[9px] tracking-widest uppercase text-zinc-400 dark:text-zinc-600">input + accent chips</p>
            </div>
          </div>
        </div>

        {/* back ── */}
        <div className="pt-4 border-t border-dashed border-rose-200 dark:border-rose-900/40">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-zinc-400 dark:text-zinc-600
                       hover:text-zinc-900 dark:hover:text-white transition-colors duration-150"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            back to portfolio
          </Link>
        </div>
      </div>
    </div>
  );
}
