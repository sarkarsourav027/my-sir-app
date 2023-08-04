/** @type {import('tailwindcss').Config} */
const plugin = require("tailwindcss/plugin");

module.exports = {
  mode: "jit",
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    height: ({ theme }) => ({
      auto: "auto",
      ...theme("spacing"),
      full: "100%",
      sidenav: "calc(100vh - 130px)",
      screen: "100vh",
    }),
  },
  plugins: [
    require('tailwind-scrollbar'),
  ],
}