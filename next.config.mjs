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
  transpilePackages: [],
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
  // Explicitly enable webpack by silencing the turbopack error, or just let it be.
  // The error suggests setting an empty turbopack config to silence it.
  turbopack: {},
  typedRoutes: true,
  redirects: async () => {
    const common = [
      { source: '/blog/p/:page', destination: '/blog', permanent: true },
      { source: '/blog/tp/:page', destination: '/blog', permanent: true },
      { source: '/category/:slug/p/:page', destination: '/category/:slug', permanent: true },
      { source: '/tools/:slug/p/:page', destination: '/tools/:slug', permanent: true },

      // Legacy blog pagination redirect: /blog/<slug>/p/<n> -> /blog/<slug>
      { source: '/blog/:slug/p/:page', destination: '/blog/:slug', permanent: true },

      // SEO keyword variant redirects for better rankings
      // On-page SEO checker variants (currently ranking 94-102)
      { source: '/on-page-checker', destination: '/tools/on-page-seo-audit-checker', permanent: true },
      { source: '/onpage-checker', destination: '/tools/on-page-seo-audit-checker', permanent: true },
      { source: '/on-page-seo-checker', destination: '/tools/on-page-seo-audit-checker', permanent: true },
      { source: '/onpage-seo-checker', destination: '/tools/on-page-seo-audit-checker', permanent: true },

      // Robots.txt validator variants
      { source: '/robot-txt-validator', destination: '/tools/robots-txt-validator', permanent: true },
      { source: '/robotstxt-validator', destination: '/tools/robots-txt-validator', permanent: true },

      // Redirect old/removed blog URLs to valid pages (prevent 404s from external links)
      { source: '/blog/free-seo-tools-list-2024', destination: '/blog', permanent: true },
      { source: '/blog/100-free-seo-tools-ultimate-list', destination: '/blog/seo-basics', permanent: true },
      { source: '/blog/seo-content-checker-how-to-use', destination: '/tools/seo-content-checker', permanent: true },
      { source: '/blog/keyword-suggestion-tool', destination: '/tools/keyword-suggestion-tool', permanent: true },
      { source: '/blog/keyword-suggestion-tool-how-to-use', destination: '/tools/keyword-suggestion-tool', permanent: true },
      { source: '/blog/keyword-suggestion-tool-popular-search-terms', destination: '/tools/keyword-suggestion-tool', permanent: true },
      { source: '/blog/meta-tag-generator', destination: '/tools/meta-tag-generator', permanent: true },
      { source: '/blog/keyword-clustering-tool', destination: '/tools/keyword-clustering-tool', permanent: true },
      // Fix 404 for indexed Heading Analyzer guide
      { source: '/blog/heading-analyzer-guide-2', destination: '/blog/heading-analyzer-guide', permanent: true },
      // Fix 404s for other legacy numbered guide slugs
      { source: '/blog/on-page-seo-audit-checker-guide-3', destination: '/blog/on-page-seo-audit-checker-guide', permanent: true },
      { source: '/blog/meta-description-writer-guide-2', destination: '/blog/meta-description-writer-guide', permanent: true },
      { source: '/blog/featured-snippet-optimizer-guide-3', destination: '/blog/featured-snippet-optimizer-guide', permanent: true },
      { source: '/blog/ai-keyword-explainer-guide-1', destination: '/blog/ai-keyword-explainer-guide', permanent: true },
      // Redirect Google My Business Optimization Helper Guide to home page
      { source: '/blog/google-my-business-optimization-helper-guide-1', destination: '/', permanent: true },
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
    // Block pagination pages from indexing (critical SEO fix)
    {
      source: '/(p|tp)/:page',
      headers: [{ key: 'X-Robots-Tag', value: 'noindex, follow' }],
    },
    {
      source: '/(.*)/(p|tp)/:page',
      headers: [{ key: 'X-Robots-Tag', value: 'noindex, follow' }],
    },

    { source: '/404', headers: [{ key: 'X-Robots-Tag', value: 'noindex, nofollow' }] },
    { source: '/_next/static/(.*)', headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }] },
  ],
});

export default nextConfig;
