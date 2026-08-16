/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "secondary-container": "#00a2e6",
        "on-background": "#d3e4fe",
        "primary-fixed-dim": "#4ae176",
        "on-primary-fixed": "#002109",
        "surface-bright": "#2a3a4f",
        "tertiary-container": "#ef9900",
        "on-tertiary-fixed-variant": "#653e00",
        "on-secondary": "#00344d",
        "on-secondary-fixed": "#001e2f",
        "on-primary-container": "#004b1e",
        "tertiary-fixed-dim": "#ffb95f",
        "on-secondary-container": "#00344e",
        "on-primary-fixed-variant": "#005321",
        "secondary-fixed-dim": "#89ceff",
        "on-tertiary-fixed": "#2a1700",
        "surface-container-highest": "#26364a",
        "tertiary": "#ffba61",
        "on-surface": "#d3e4fe",
        "surface": "#031427",
        "outline": "#869585",
        "on-secondary-fixed-variant": "#004c6e",
        "primary": "#4be277",
        "on-tertiary": "#472a00",
        "secondary-fixed": "#c9e6ff",
        "error": "#ffb4ab",
        "tertiary-fixed": "#ffddb8",
        "outline-variant": "#3d4a3d",
        "secondary": "#89ceff",
        "error-container": "#93000a",
        "primary-container": "#22c55e",
        "on-error": "#690005",
        "surface-container-high": "#1b2b3f",
        "on-primary": "#003915",
        "primary-fixed": "#6bff8f",
        "on-tertiary-container": "#5c3800",
        "background": "#031427",
        "on-error-container": "#ffdad6",
        "surface-container": "#102034",
        "surface-dim": "#031427",
        "inverse-primary": "#006e2f",
        "surface-variant": "#26364a",
        "surface-container-low": "#0b1c30",
        "inverse-on-surface": "#213145",
        "surface-tint": "#4ae176",
        "on-surface-variant": "#bccbb9"
      },
      borderRadius: {
        "DEFAULT": "0.125rem",
        "lg": "0.25rem",
        "xl": "0.5rem",
        "full": "0.75rem"
      },
      spacing: {
        "xs": "4px",
        "header-height": "64px",
        "base": "4px",
        "sidebar-width": "280px",
        "md": "16px",
        "lg": "24px",
        "sm": "8px",
        "xl": "40px"
      },
      fontFamily: {
        "headline-lg": ["Inter", "sans-serif"],
        "headline-md": ["Inter", "sans-serif"],
        "label-md": ["Inter", "sans-serif"],
        "label-sm": ["Inter", "sans-serif"],
        "display-lg": ["Inter", "sans-serif"],
        "body-lg": ["Inter", "sans-serif"],
        "mono-data": ["JetBrains Mono", "monospace"],
        "body-md": ["Inter", "sans-serif"]
      },
      animation: {
        "radar-sweep": "radarSweep 4s linear infinite",
        "pulse-glow": "pulseGlow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite"
      },
      keyframes: {
        radarSweep: {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" }
        },
        pulseGlow: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: ".5" }
        }
      }
    },
  },
  plugins: [],
}
