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
        // Non-AI professional palette - matte, sophisticated, print-media inspired
        brand: {
          // Accessible palette (AA compliant on light/dark backgrounds)
          50: '#fafafa',
          100: '#f5f5f5',
          200: '#e5e5e5',
          300: '#d4d4d4',
          400: '#a3a3a3',
          500: '#737373',
          600: '#525252',
          700: '#404040',
          800: '#262626',
          900: '#151515',
          950: '#0a0a0a',
        },
        // Warm earth accent for highlights (not neon/cyberpunk)
        earth: {
          50: '#fff7ec',
          100: '#ffede8',
          200: '#fcd3c7',
          300: '#fbbfbc',
          400: '#f8a9a5',
          500: '#f59e0b',
          600: '#d97706',
          700: '#b45309',
          800: '#92400e',
          900: '#78350f',
        },
        // Subtle sky blue (muted, not electric)
        sky: {
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
