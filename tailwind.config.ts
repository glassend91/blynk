import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        primary: "#401B60",
        grayText: "#6F6C90",
        neutral800: "#170F49"
      },
      boxShadow: {
        card: "0 1px 2px rgba(0,0,0,0.06), 0 10px 15px rgba(0,0,0,0.05)"
      },
      borderRadius: {
        xl2: "1rem"
      },
      backgroundImage: {
        "hero-pattern": "linear-gradient(180deg, rgba(255,255,255,0.60) 0%, #FFF 94.25%), url('https://api.builder.io/api/v1/image/assets/TEMP/90b585f87de9ec9cb6b0d0be1efcf895bfdeb69d?width=3840')",
        "plans-overlay": "linear-gradient(180deg, rgba(64, 27, 96, 0.70) 0%, rgba(25, 10, 47, 0.95) 100%)"
      }
    }
  },
  plugins: []
};
export default config;
