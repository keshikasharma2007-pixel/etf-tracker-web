/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      // Custom color palette — dark navy finance terminal
      colors: {
        bg: {
          base:    "#07090f",   // near-black navy — page background
          surface: "#0d1321",   // slightly lighter — card backgrounds
          raised:  "#131c2e",   // even lighter — nested cards, table rows
          border:  "#1c2b42",   // subtle border color
        },
        ink: {
          primary:   "#dce8f5", // main text
          secondary: "#7a8fa8", // muted text, labels
          muted:     "#3d5166", // very muted — dividers, placeholders
        },
        gold: {
          DEFAULT: "#c9972a",
          light:   "#e8b84b",
          dim:     "#7a5a18",
        },
        bull:  "#22c55e",  // green — above 20 DMA
        bear:  "#ef4444",  // red — below 20 DMA (buy signal in this strategy)
        signal: "#f59e0b", // amber — top 3 buy signal highlight
      },
      fontFamily: {
        // Display font for headings — Syne is geometric, distinctive, not Inter
        display: ["Syne", "sans-serif"],
        // Body font — DM Sans is clean but has character
        body: ["DM Sans", "sans-serif"],
        // Mono font for all financial numbers — IBM Plex Mono feels like a terminal
        mono: ["IBM Plex Mono", "monospace"],
      },
      // Custom animation for the market status pulse dot
      animation: {
        "pulse-slow": "pulse 2.5s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "fade-in":    "fadeIn 0.4s ease forwards",
        "slide-up":   "slideUp 0.5s ease forwards",
      },
      keyframes: {
        fadeIn: {
          from: { opacity: "0" },
          to:   { opacity: "1" },
        },
        slideUp: {
          from: { opacity: "0", transform: "translateY(16px)" },
          to:   { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
};
