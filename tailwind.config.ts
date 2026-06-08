import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{js,ts,jsx,tsx,mdx}", "./components/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        navy: "#0F1F4B",
        blue: "#1A4FD4",
        graphite: "#475569",
        ink: "#101827",
        mist: "#F0F4FF",
        line: "#E2E8F0",
        steel: "#64748B",
        accent: "#059669",
        amber: "#D97706",
        cyan: "#06B6D4"
      },
      boxShadow: {
        panel: "0 18px 50px rgba(15, 31, 75, 0.10)"
      }
    }
  },
  plugins: []
};

export default config;
