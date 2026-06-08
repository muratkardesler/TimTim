/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          bg: '#FAF7F2',
          red: '#D62828',
          'red-hover': '#B31E1E',
          dark: '#1A1A1A',
          muted: '#6B6B6B',
          line: '#E8E2D8',
          card: '#FFFFFF',
        },
        // Geri uyumluluk için (admin panelde kullan\u0131l\u0131yor olabilir)
        pizza: {
          red: '#D62828',
          yellow: '#FBBF24',
          dark: '#1A1A1A',
        }
      },
      fontFamily: {
        display: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['Poppins', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        logo: ['Fredoka', 'Poppins', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 1px 3px rgba(0,0,0,0.05), 0 1px 2px rgba(0,0,0,0.03)',
        'card': '0 4px 16px -2px rgba(26,26,26,0.06), 0 2px 6px -1px rgba(26,26,26,0.04)',
        'card-hover': '0 12px 32px -4px rgba(26,26,26,0.12), 0 4px 12px -2px rgba(26,26,26,0.06)',
        'sheet': '0 -10px 40px -5px rgba(26,26,26,0.15)',
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-out',
        'smoke': 'smoke 3s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        smoke: {
          '0%, 100%': { transform: 'translate(0, 0) scale(1)', opacity: '0.15' },
          '50%': { transform: 'translate(10px, -8px) scale(1.05)', opacity: '0.25' },
        },
      },
    },
  },
  plugins: [],
}
