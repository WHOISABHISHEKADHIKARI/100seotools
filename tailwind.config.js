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
          // Accessible brand palette (AA compliant on light/dark backgrounds)
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
          950: '#082f49',
        },
        // Darker gray steps for small text contrast (>=4.5:1)
        accessibleGray: {
          400: '#52525b',
          500: '#3f3f46',
          600: '#27272a',
          700: '#18181b',
          800: '#020617',
        }
      }
    }
  },
  plugins: [
    // Lightweight utilities for GPU-optimized hover effects
    function({ addUtilities }) {
      addUtilities({
        '.transition-gpu': {
          transitionProperty: 'transform, opacity',
          transitionTimingFunction: 'cubic-bezier(0.2, 0, 0, 1)',
          transitionDuration: '200ms'
        },
        '.will-change-transform-opacity': {
          willChange: 'transform, opacity'
        },
        '.tap-target': {
          minHeight: '48px',
          paddingTop: '0.5rem',
          paddingBottom: '0.5rem',
          paddingLeft: '0.75rem',
          paddingRight: '0.75rem',
          display: 'inline-flex',
          alignItems: 'center'
        }
      });
    }
  ]
};