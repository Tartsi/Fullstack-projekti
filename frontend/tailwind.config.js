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
        "brand-dark": "#2c2c2c",
        "brand-purple": "#8b5cf6",
      },
    },
  },
  plugins: [],
};
