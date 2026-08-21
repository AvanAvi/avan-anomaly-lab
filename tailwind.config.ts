import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Retro CRT Terminal Colors
        terminal: {
          green: "#00ff41",
          amber: "#ffb000",
          cyan: "#00ffff",
          red: "#ff0040",
        },
        // Dark background shades
        dark: {
          900: "#0a0e27",
          800: "#0f1419",
          700: "#1a1f2e",
        },
        // Neon accent colors
        neon: {
          blue: "#00d9ff",
          pink: "#ff006e",
          purple: "#8338ec",
          cyan: "#00ffff",
        },
        // Instrument design system: restrained, single-signal palette.
        // Used by redesigned sections; legacy sections keep the tokens above
        // until they are migrated.
        ink: {
          950: "#07090a",
          900: "#0c0f11",
          800: "#12161a",
          700: "#1b2126",
        },
        line: {
          DEFAULT: "#1e2529",
          strong: "#2c363c",
        },
        signal: {
          DEFAULT: "#6ee7c0",
          dim: "#3a7d6b",
          bright: "#9ffbdd",
        },
      },
      fontFamily: {
        mono: ["var(--font-mono)", "monospace"],
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "Georgia", "serif"],
      },
      animation: {
        "glitch": "glitch 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94) infinite",
        "flicker": "flicker 0.15s infinite",
        "scan": "scan 8s linear infinite",
        "drift": "drift 18s ease-in-out infinite",
      },
      keyframes: {
        glitch: {
          "0%, 100%": { transform: "translate(0)" },
          "20%": { transform: "translate(-2px, 2px)" },
          "40%": { transform: "translate(-2px, -2px)" },
          "60%": { transform: "translate(2px, 2px)" },
          "80%": { transform: "translate(2px, -2px)" },
        },
        flicker: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.8" },
        },
        scan: {
          "0%": { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(100vh)" },
        },
        drift: {
          "0%, 100%": { transform: "translate(0, 0)" },
          "50%": { transform: "translate(var(--drift-x, 6px), var(--drift-y, -8px))" },
        },
      },
      transitionTimingFunction: {
        // Settling motion: fast approach, gentle arrival. No overshoot.
        instrument: "cubic-bezier(0.16, 1, 0.3, 1)",
      },
    },
  },
  plugins: [],
};

export default config;