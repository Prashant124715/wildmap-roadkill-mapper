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
          green: '#0a190f', // Deep dark green background
          orange: '#ff5c00', // Neon orange highlights
          lightGreen: '#3b8b54',
          dark: '#050a06', // Black/darker shade
        }
      },
      screens: {
        'xs': '480px',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        hero: ['Outfit', 'sans-serif'], // For large headings
        cinematic: ['Cinzel', 'serif'], // Premium cinematic display
        'serif-elegant': ['Playfair Display', 'serif'], // Elegant serif
      },
      backgroundImage: {
        'grid-pattern': "linear-gradient(to right, rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.05) 1px, transparent 1px)",
      }
    },
  },
  plugins: [],
}
