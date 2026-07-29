import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./data/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        porcelain: "#F5F0E8",
        ink: "#173F35",
        gold: "#C49A55",
        evergreen: "#102F28",
        terracotta: "#B85C3F",
        "terracotta-dark": "#984832",
        mist: "#DED5C8",
        ivory: "#FBF8F2",
      },
      fontFamily: {
        serif: ["var(--font-playfair)", "Georgia", "serif"],
        sans: ["var(--font-manrope)", "Arial", "sans-serif"],
      },
      boxShadow: {
        soft: "0 24px 80px rgba(38, 49, 45, 0.08)",
      },
      keyframes: {
        reveal: {
          "0%": { opacity: "0", transform: "translateY(22px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
      },
      animation: {
        reveal: "reveal 800ms ease both",
        float: "float 6s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
