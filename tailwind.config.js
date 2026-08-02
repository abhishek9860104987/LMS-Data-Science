/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',   // toggled via body.dark class
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      colors: {
        sidebar:    '#0B3558',
        primary:    '#2563EB',
        background: '#F8FAFC',
      },
      borderRadius: {
        '16': '16px',
        '2xl': '16px',
      },
      boxShadow: {
        'card':  '0 1px 3px 0 rgba(0,0,0,0.08), 0 1px 2px -1px rgba(0,0,0,0.06)',
        'card-md': '0 4px 6px -1px rgba(0,0,0,0.08), 0 2px 4px -2px rgba(0,0,0,0.06)',
      },
      animation: {
        'fade-in': 'fadeIn 0.35s ease forwards',
        'slide-in': 'slideInRight 0.3s ease forwards',
      },
    },
  },
  plugins: [],
};
