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
          50: '#eef5ff',
          100: '#d9e9ff',
          200: '#b7d4ff',
          300: '#86b6ff',
          400: '#4f94ff',
          500: '#1f6fff',
          600: '#1e40af', // passes 4.5:1 vs white for text links
          700: '#1e3a8a', // strong contrast for buttons/borders
          800: '#173174',
          900: '#13274f'
        },
        // Darker gray steps for small text contrast (>=4.5:1)
        accessibleGray: {
          400: '#64748b',
          500: '#475569',
          600: '#374151',
          700: '#1f2937'
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