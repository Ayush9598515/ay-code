/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
      'color-empty': '#ffffff',        // white = no submission
      'color-submitted': '#3b82f6',    // blue = submitted
    }

    },
  },
  plugins: [],
};
