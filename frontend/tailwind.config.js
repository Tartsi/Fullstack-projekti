/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      screens: {
        xs: "475px",
      },
      fontFamily: {
        cottage: ["SuperCottage-woAZ2", "cursive"],
        body: ["Arial", "sans-serif"],
      },
      colors: {
        "brand-dark": "#7A5C58",
        "brand-dark-300": "#a08b87",
        "brand-purple": "#8D80AD",
        "brand-blue": "#99B2DD",
        "brand-neon": "#9DFFF9",
        "brand-green": "#56d87b",
        "brand-lightgrey": "#EDECEB",
      },
    },
  },
  plugins: [],
};
