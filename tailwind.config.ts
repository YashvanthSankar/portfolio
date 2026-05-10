import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-display)", "Geist", "ui-sans-serif", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "Geist", "ui-sans-serif", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "Geist Mono", "ui-monospace", "monospace"],
      },
      colors: {
        ink: "var(--ink)",
        paper: "var(--paper)",
        surface: "var(--surface)",
        "surface-alt": "var(--surface-alt)",
        accent: "var(--accent)",
        "accent-ink": "var(--accent-ink)",
        highlight: "var(--highlight)",
        muted: "var(--muted)",
      },
      boxShadow: {
        "brutal-sm": "var(--shadow-brutal-sm)",
        brutal: "var(--shadow-brutal)",
        "brutal-lg": "var(--shadow-brutal-lg)",
      },
      borderWidth: {
        brutal: "2.5px",
      },
      keyframes: {
        marquee: {
          from: { transform: "translateX(0)" },
          to: { transform: "translateX(calc(-100% - var(--gap, 1rem)))" },
        },
      },
      animation: {
        marquee: "marquee var(--duration, 30s) linear infinite",
      },
    },
  },
  plugins: [],
};

export default config;
