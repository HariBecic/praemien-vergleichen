import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: { DEFAULT: "#0f4c5c", light: "#1a6b7a" },
        accent: { DEFAULT: "#e36414", light: "#fb8b24" },
      },
    },
  },
  plugins: [],
};
export default config;
