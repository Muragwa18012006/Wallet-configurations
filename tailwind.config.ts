import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        pi: {
          purple: "#8B5CF6",
          dark: "#1a1a2e",
          light: "#f3f4f6",
        },
      },
    },
  },
  plugins: [],
};

export default config;
