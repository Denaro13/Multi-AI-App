import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}", // Next.js /app directory support
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};

export default config;
