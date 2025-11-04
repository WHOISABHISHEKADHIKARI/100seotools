/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './app/**/*.{js,jsx,ts,tsx}',
    './components/**/*.{js,jsx,ts,tsx}',
    './pages/**/*.{js,jsx,ts,tsx}',
    './tools/**/*.{js,jsx,ts,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f5f9ff',
          100: '#eaf2ff',
          200: '#d6e6ff',
          300: '#b3d1ff',
          400: '#80b3ff',
          500: '#4a93ff',
          600: '#1e57b0',
          700: '#225db4',
          800: '#1c4b8f',
          900: '#193f75'
        }
      }
    }
  },
  plugins: []
};