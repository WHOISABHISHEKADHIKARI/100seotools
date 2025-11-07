// @ts-check

const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

/** @type {import('next').NextConfig} */
const nextConfig = withBundleAnalyzer({
  reactStrictMode: true,
  productionBrowserSourceMaps: true,
  // swcMinify: true, // removed – Next.js 13+ uses SWC by default
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  compress: true,
  // Remove custom splitChunks override. Next.js 16 manages chunking internally
  // and overriding optimization.splitChunks can break module execution in dev,
  // triggering runtime errors like "Cannot read properties of undefined (reading 'call')".
  // Keep the webpack hook only if you need other customizations.
  // webpack(config) {
  //   return config;
  // },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io',
      },
    ],
  },
  typedRoutes: true,
  experimental: {
    serverActions: {
      bodySizeLimit: '1mb',
    },
  },
  // Silence Turbopack default error by explicitly declaring config
  turbopack: {},
  redirects: async () => {
    return [
      // Fix redirect chains by implementing direct 301 redirects
      // HTTP to HTTPS redirects (avoid 308 status codes)
      {
        source: '/:path*',
        has: [
          {
            type: 'header',
            key: 'x-forwarded-proto',
            value: 'http',
          },
        ],
        permanent: true, // 301 redirect
        destination: 'https://www.100seotools.com/:path*',
      },
      // Non-www to www redirects (avoid 307 status codes)
      {
        source: '/:path*',
        has: [
          {
            type: 'host',
            value: '100seotools.com',
          },
        ],
        permanent: true, // 301 redirect
        destination: 'https://www.100seotools.com/:path*',
      },
    ];
  },
  headers: async () => {
    return [
      {
        source: '/alternative/(.*)',
        headers: [
          {
            key: 'X-Robots-Tag',
            value: 'noindex, follow',
          },
          {
            key: 'Link',
            value: '<https://www.100seotools.com/tools/keyword-density-checker>; rel="canonical"',
          },
          {
            key: 'Cache-Control',
            value: 'no-cache, no-store, must-revalidate',
          },
          {
            key: 'Pragma',
            value: 'no-cache',
          },
          {
            key: 'Expires',
            value: '0',
          },
        ],
      },
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https://images.unsplash.com https://res.cloudinary.com https://cdn.sanity.io; font-src 'self'; connect-src 'self' https://cdn.sanity.io; media-src 'self';",
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains; preload',
          },
          {
            key: 'X-Robots-Tag',
            value: 'all',
          },
        ]
      },
      {
        source: '/_next/static/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },

});

module.exports = nextConfig;
