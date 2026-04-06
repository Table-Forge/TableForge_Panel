/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        background: "#0A0A1B",
        primary: "#1A1A2E",
        secondary: "#7E87E2",
        tertiary: "#FB4501",
        danger: "#FF4D4D",
        white: "#F8F8F8",
        black: "#000000",
        grays: {
          50: "#F1F1F1",
          100: "#D1D1D1",
          200: "#A1A1A1",
          300: "#717171",
          400: "#4A4A4A",
          500: "#2D2D2D",
          600: "#1E1E1E",
        },
      },
      fontFamily: {
        hud: ["Inter", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
