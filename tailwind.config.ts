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
      },
      fontFamily: {
        mono: ["var(--font-mono)", "monospace"],
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
      },
      animation: {
        "glitch": "glitch 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94) infinite",
        "flicker": "flicker 0.15s infinite",
        "scan": "scan 8s linear infinite",
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
      },
    },
  },
  plugins: [],
};

export default config;