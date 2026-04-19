import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Manrope", "Aptos", "Segoe UI", "sans-serif"],
      },
      colors: {
        earth: {
          50: "#f6f5ef",
          100: "#ece8d5",
          200: "#d9d1aa",
          300: "#c2b87f",
          400: "#b3a363",
          500: "#98874a",
          600: "#756433",
          700: "#564925",
          800: "#3b321a",
          900: "#241f12",
        },
      },
      boxShadow: {
        soft: "0 20px 45px rgba(18, 36, 21, 0.1)",
      },
      backgroundImage: {
        "hero-glow": "radial-gradient(circle at 15% 20%, rgba(133, 170, 108, 0.22), transparent 38%), radial-gradient(circle at 85% 10%, rgba(224, 166, 84, 0.24), transparent 35%), linear-gradient(180deg, #f9f6ee, #f2ecdf)",
        "planet-night": "radial-gradient(circle at 16% 12%, rgba(56, 189, 248, 0.24), transparent 34%), radial-gradient(circle at 84% 9%, rgba(16, 185, 129, 0.26), transparent 36%), radial-gradient(circle at 40% 88%, rgba(180, 83, 9, 0.22), transparent 32%), linear-gradient(180deg, #07141c, #102527 48%, #1a2a2e)",
        "planet-day": "radial-gradient(circle at 16% 12%, rgba(56, 189, 248, 0.1), transparent 34%), radial-gradient(circle at 84% 9%, rgba(16, 185, 129, 0.09), transparent 36%), radial-gradient(circle at 40% 88%, rgba(180, 83, 9, 0.08), transparent 32%), linear-gradient(180deg, #dce5e6, #d2ddd6 48%, #d8d2c8)",
      },
    },
  },
  plugins: [],
};

export default config;
