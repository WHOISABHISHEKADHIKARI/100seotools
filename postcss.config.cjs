module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
    // Enable cssnano in production for minification
    ...(process.env.NODE_ENV === 'production' ? { cssnano: { preset: 'default' } } : {}),
    // Optional: Enable PurgeCSS when explicitly turned on to deeply remove unused custom CSS
    ...(process.env.ENABLE_PURGECSS === 'true'
      ? {
          '@fullhuman/postcss-purgecss': {
            content: [
              './app/**/*.{js,jsx,ts,tsx}',
              './components/**/*.{js,jsx,ts,tsx}',
              './pages/**/*.{js,jsx,ts,tsx}',
              './tools/**/*.{js,jsx,ts,tsx}'
            ],
            defaultExtractor: (content) => content.match(/([A-Za-z0-9-_:/]+)/g) || [],
            safelist: [
              // Keep classes that are programmatically toggled or dynamic
              'dark',
              'card',
              'card-interactive',
              'tap-target',
              'btn',
              'btn-secondary',
              'font-loading-fallback',
              'calculator-container',
              'content-transition',
              // Removed unused: 'card-content', 'loading-skeleton', 'loading-reserve', 'tool-card-text'
            ]
          }
        }
      : {})
  }
};
