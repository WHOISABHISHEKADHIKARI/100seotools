/** @type {import('next').NextConfig} */
import bundleAnalyzer from '@next/bundle-analyzer';

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
});

const nextConfig = withBundleAnalyzer({
  reactStrictMode: true,
  productionBrowserSourceMaps: true,
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  compress: true,
  experimental: {
    serverActions: {
      bodySizeLimit: '1mb',
    },
  },
  webpack(config, { isServer }) {
    if (!isServer) {
      config.resolve.alias = {
        ...config.resolve.alias,
        'next/dist/build/polyfills/polyfill-module.js': false,
        'next/dist/build/polyfills/polyfill-nomodule.js': false,
      };
    }
    return config;
  },
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'res.cloudinary.com', pathname: '/**' },
      { protocol: 'https', hostname: 'cdn.sanity.io', pathname: '/**' },
      { protocol: 'https', hostname: 'ui-avatars.com', pathname: '/**' },
    ],
  },
  typedRoutes: true,
  turbopack: {},
  redirects: async () => {
    const common = [
      { source: '/blog/:slug/p/:page', destination: '/blog#:slug', permanent: true },
      { source: '/blog/:slug/p', destination: '/blog#:slug', permanent: true },
      { source: '/blog/:slug', destination: '/blog#:slug', permanent: true },
      { source: '/blog/p/:page', destination: '/blog', permanent: true },
      { source: '/category/:slug/p/:page', destination: '/category/:slug', permanent: true },
      { source: '/tools/:slug/p/:page', destination: '/tools/:slug', permanent: true },
    ];
    if (process.env.NODE_ENV !== 'production') return common;
    return [
      ...common,
      {
        source: '/:path*',
        has: [{ type: 'header', key: 'x-forwarded-proto', value: 'http' }],
        destination: 'https://www.100seotools.com/:path*',
        permanent: true,
      },
      {
        source: '/:path*',
        has: [{ type: 'host', value: '100seotools.com' }],
        destination: 'https://www.100seotools.com/:path*',
        permanent: true,
      },
    ];
  },
  headers: async () => [
    {
      source: '/alternative/(.*)',
      headers: [
        { key: 'X-Robots-Tag', value: 'noindex, follow' },
        { key: 'Link', value: '<https://www.100seotools.com/tools/keyword-density-checker>; rel="canonical"' },
        { key: 'Cache-Control', value: 'no-cache, no-store, must-revalidate' },
        { key: 'Pragma', value: 'no-cache' },
        { key: 'Expires', value: '0' },
      ],
    },
    {
      source: '/(.*)',
      headers: [
        { key: 'Content-Security-Policy', value: "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https://res.cloudinary.com https://cdn.sanity.io https://ui-avatars.com; font-src 'self'; connect-src 'self' https://cdn.sanity.io; media-src 'self';" },
        { key: 'X-Frame-Options', value: 'DENY' },
        { key: 'Referrer-Policy', value: 'origin-when-cross-origin' },
        { key: 'X-Content-Type-Options', value: 'nosniff' },
        { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
        { key: 'Strict-Transport-Security', value: 'max-age=31536000; includeSubDomains; preload' },
      ],
    },
    { source: '/404', headers: [{ key: 'X-Robots-Tag', value: 'noindex, nofollow' }] },
    { source: '/_next/static/(.*)', headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }] },
  ],
});

export default nextConfig;
