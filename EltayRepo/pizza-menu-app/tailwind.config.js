/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        pizza: {
          red: '#DC2626',
          yellow: '#FBBF24',
          dark: '#1F2937',
        }
      }
    },
  },
  plugins: [],
}

