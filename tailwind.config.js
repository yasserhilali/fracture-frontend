/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        'brand-blue-100': '#e6f0ff',
        'brand-blue-500': '#2563eb',
        'brand-blue-700': '#1e40af'
      },
      backgroundImage: {
        'hero-gradient': 'linear-gradient(135deg,#e6f0ff 0%, #cfe3ff 50%, #eaf4ff 100%)'
      }
    },
  },
  plugins: [],
};