import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ns: {
          brown: "#70412D",
          beige: "#E9D5BB",
          offwhite: "#F9F5E9",
          gold: "#C6A46A",
        },
      },
      fontFamily: {
        title: ["var(--font-playfair)"],
        body: ["var(--font-inter)"],
        highlight: ["var(--font-cormorant)"],
      },
    },
  },
  plugins: [],
};

export default config;