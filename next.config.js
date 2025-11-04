/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Emit production client-side source maps for better debugging and Lighthouse insights
  productionBrowserSourceMaps: true,
  
  // Performance optimizations
  swcMinify: true,
  compress: true,
  
  // Image optimization
  images: {
    formats: ['image/webp', 'image/avif'],
    minimumCacheTTL: 31536000,
  },
  
  // Experimental features kept minimal to avoid build conflicts
  experimental: {
    optimizePackageImports: ['react-icons'],
  },
  
  // Bundle optimization
  webpack: (config, { dev, isServer }) => {
    // Ensure source maps are generated for client builds in production
    if (!dev && !isServer) {
      config.devtool = 'source-map';
    }
    // Optimize bundle size in production
    if (!dev && !isServer) {
      config.optimization.splitChunks = {
        chunks: 'all',
        cacheGroups: {
          // Next.js framework modules - highest priority
          framework: {
            name: 'framework',
            test: /[/\\]node_modules[/\\](react|react-dom|next)[/\\]/,
            chunks: 'all',
            priority: 40,
            enforce: true,
          },
          // Next.js internal shared modules - prevent duplication
          nextShared: {
            name: 'next-shared',
            test: /[/\\]node_modules[/\\]next[/\\]dist[/\\]shared[/\\]/,
            chunks: 'all',
            priority: 30,
            enforce: true,
          },
          // Vendor libraries - exclude Next.js internals (already handled by higher priority groups)
          vendor: {
            test: /[/\\]node_modules[/\\](?!next[/\\])/,
            name: 'vendors',
            chunks: 'all',
            priority: 20,
          },
          // Common application code - lowest priority to avoid conflicts
          common: {
            name: 'common',
            minChunks: 2,
            chunks: 'all',
            priority: 10,
            reuseExistingChunk: true,
            enforce: false,
          },
        },
      };
    }

    // Remove invalid Critters injection: use Next.js defaults for CSS optimization
    return config;
  },
  
  async headers() {
    const isDev = process.env.NODE_ENV !== 'production';
    // More permissive CSP for development
    const csp = [
      "default-src 'self' 'unsafe-inline' 'unsafe-eval'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https:",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: https:",
      "connect-src 'self' https: ws: wss:",
      "font-src 'self' data: https:",
      "frame-ancestors 'none'",
      "base-uri 'self'",
      "form-action 'self'"
    ].filter(Boolean).join('; ');
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'Content-Security-Policy', value: csp },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()' },
          { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' }
        ]
      },
      // Signal non-index for error pages via X-Robots-Tag
      {
        source: '/(400|401|403|404|410|429|500|502)',
        headers: [
          { key: 'X-Robots-Tag', value: 'noindex, noarchive, nosnippet' }
        ]
      },
      // Optimize static asset caching
      {
        source: '/_next/static/:path*',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }
        ]
      },
      {
        source: '/:path*.(png|jpg|jpeg|gif|webp|svg|ico|woff|woff2)',
        headers: [
          { key: 'Cache-control', value: 'public, max-age=31536000, immutable' }
        ]
      },
      // Preload critical resources
      // Removed invalid preload for globals.css; Next.js bundles CSS under _next/static.
      // Preloading a non-existent /globals.css caused 404s during development.
    ];
  }
};
// Conditionally enable bundle analyzer without requiring it in normal dev/build
let exportedConfig = nextConfig;
if (process.env.ANALYZE === 'true') {
  try {
    const withBundleAnalyzer = require('@next/bundle-analyzer')({ enabled: true });
    exportedConfig = withBundleAnalyzer(nextConfig);
  } catch (e) {
    // analyzer not installed; keep default config
  }
}

module.exports = exportedConfig;