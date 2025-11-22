/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'newspaper-blue': '#1E40AF',
        'newspaper-red': '#B91C1C',
      },
      fontFamily: {
        'kannada': ['Noto Sans Kannada', 'sans-serif'],
      }
    },
  },
  plugins: [],
}