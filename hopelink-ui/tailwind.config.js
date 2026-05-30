/** @type {import('tailwindcss').Config} */
export default {
  // Enable class-based dark mode so we can toggle it with a class on <html>
  darkMode: 'class',
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        // Primary brand — indigo/violet
        brand: {
          50:  '#faf5ff',
          100: '#f3e8ff',
          200: '#e9d5ff',
          300: '#d8b4fe',
          400: '#c084fc',
          500: '#a855f7',
          600: '#9333ea',
          700: '#7e22ce',
          800: '#6b21a8',
          900: '#581c87',
        },
      },
      animation: {
        'fade-in':      'fadeIn 0.35s ease-out both',
        'slide-up':     'slideUp 0.4s ease-out both',
        'pulse-slow':   'pulse 2.5s cubic-bezier(0.4,0,0.6,1) infinite',
        'spin-smooth':  'spin 0.8s linear infinite',
      },
      keyframes: {
        fadeIn:  { '0%': { opacity: 0 },                  '100%': { opacity: 1 } },
        slideUp: { '0%': { opacity: 0, transform: 'translateY(16px)' }, '100%': { opacity: 1, transform: 'translateY(0)' } },
      },
      backdropBlur: { xs: '2px' },
    },
  },
  plugins: [],
};
