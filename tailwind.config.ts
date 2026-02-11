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
        // Blanc + bleu : beaucoup de blanc, bleu en accent
        surface: {
          DEFAULT: "#ffffff",
          light: "#f8fafc",
          dark: "#f1f5f9",
          darker: "#e2e8f0",
        },
        accent: {
          DEFAULT: "#2563eb",
          light: "#3b82f6",
          dark: "#1d4ed8",
        },
        // Léger mix beige / gris chaud (watermark, à propos, textes doux)
        warm: {
          50: "#fdfcfb",
          100: "#f9f7f4",
          200: "#f3efe8",
          300: "#e8e2d8",
          400: "#d4ccbe",
        },
        primary: {
          50: "#fef3e2",
          100: "#fde4b8",
          200: "#fbc97a",
          300: "#f9a83c",
          400: "#f78b1f",
          500: "#e6730a",
          600: "#c45a05",
          700: "#9d4508",
          800: "#7e360e",
          900: "#682e0f",
        },
        // Couleurs Cameroun (rouge, vert, jaune)
        cameroon: {
          red: "#CE1126",
          yellow: "#FCD116",
          green: "#007A5E",
        },
        // Couleurs Sénégal (vert, jaune, rouge)
        senegal: {
          green: "#00853F",
          yellow: "#FCD116",
          red: "#CE1126",
        },
        // Couleurs Congo (bleu, jaune, rouge)
        congo: {
          blue: "#009739",
          yellow: "#FBDE4A",
          red: "#DC143C",
        },
      },
      animation: {
        "fade-in": "fadeIn 0.5s ease-in-out",
        "slide-up": "slideUp 0.5s ease-out",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { transform: "translateY(20px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
