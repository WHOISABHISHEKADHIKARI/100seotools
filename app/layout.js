import { getBaseUrl, logoImage, siteName, socialLinks, socialPreviewImage, twitterHandle } from '../lib/site';
import { socialImageHeight, socialImageType, socialImageWidth } from '../lib/socialMetadata';
const baseUrl = getBaseUrl();
const defaultSocialImage = `${baseUrl}${socialPreviewImage}`;

export const metadata = {
  title: '100+ Free SEO Tools - No Signup Required | 100 SEO Tools',
  description: 'Use 100+ free SEO tools for keyword research, on-page audits, technical SEO, schema, content optimization, and reports. Instant results, no signup.',
  metadataBase: new URL(baseUrl),
  keywords: ['100 seo tools', 'free seo tools list', 'seo tool comparison', 'best seo tools for 2024', '100 free seo tools', 'free seo toolkit'],
  // Icons / Favicons
  icons: {
    icon: [
      { url: '/icon.svg', type: 'image/svg+xml' },
      { url: '/icon-light.svg', type: 'image/svg+xml', media: '(prefers-color-scheme: light)' },
      { url: '/icon-dark.svg', type: 'image/svg+xml', media: '(prefers-color-scheme: dark)' },
    ],
    shortcut: [
      { url: '/icon.svg', type: 'image/svg+xml' },
    ],
    other: [
      { rel: 'mask-icon', url: '/icon.svg', color: '#0f172a' },
    ],
  },
  // Open Graph tags
  openGraph: {
    title: '100+ Free SEO Tools - No Signup Required',
    description: 'Keyword research, on-page audits, technical SEO, schema, content optimization, and SEO reports in one free browser toolkit.',
    url: baseUrl,
    siteName,
    images: [
      {
        url: defaultSocialImage,
        secureUrl: defaultSocialImage,
        width: socialImageWidth,
        height: socialImageHeight,
        type: socialImageType,
        alt: '100 Free SEO Tools - Complete Toolkit for Marketers',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  // Twitter Card tags
  twitter: {
    card: 'summary_large_image',
    title: '100+ Free SEO Tools - No Signup Required',
    description: 'Free keyword research, on-page audit, technical SEO, schema, and content optimization tools. Instant results, no signup.',
    url: baseUrl,
    site: twitterHandle,
    creator: twitterHandle,
    images: [{ url: defaultSocialImage, alt: '100 Free SEO Tools - Complete Toolkit for Marketers' }],
  },
  // Canonical URL
  alternates: {
    canonical: baseUrl,
  },
};

import './globals.css';
import { initPerformanceMonitoring } from '../lib/performance-monitor';
import Script from 'next/script';
const isProd = process.env.NODE_ENV === 'production';
const isVercel = process.env.VERCEL === '1';
const GA_ID = process.env.NEXT_PUBLIC_GA_ID;
const analyticsDisabled = process.env.NEXT_PUBLIC_DISABLE_ANALYTICS === 'true';
const enableAnalytics = isProd && !analyticsDisabled && GA_ID;

// Initialize performance monitoring
if (typeof window !== 'undefined') {
  initPerformanceMonitoring();
}
import ErrorBoundary from '../components/layout/ErrorBoundary';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import StructuredData from '../components/ui/StructuredData';
import ClientLayout from '../components/layout/ClientLayout';
import ClientRoot from '../components/layout/ClientRoot';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { generateWebsiteSchema } from '../lib/schema';

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Google Analytics (gtag) — load only when GA_ID is set and analytics not disabled */}
        {enableAnalytics && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
              strategy="afterInteractive"
            />
            <Script id="ga-init" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${GA_ID}');
              `}
            </Script>
          </>
        )}
        <link rel="preconnect" href={baseUrl} crossOrigin="anonymous" />
        <link rel="dns-prefetch" href={baseUrl} />
        <link rel="dns-prefetch" href="https://www.google-analytics.com" />
        <link rel="preconnect" href="https://www.google-analytics.com" />
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        <meta name="theme-color" content="#7c3aed" />
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="icon" href="/icon-light.svg" type="image/svg+xml" media="(prefers-color-scheme: light)" />
        <link rel="icon" href="/icon-dark.svg" type="image/svg+xml" media="(prefers-color-scheme: dark)" />
        <link rel="shortcut icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="mask-icon" href="/icon.svg" color="#7c3aed" />
        <link rel="manifest" href="/manifest.json" />

        {/* Minimal critical inline CSS to avoid flash of wrong colors before Tailwind loads */}
        <style dangerouslySetInnerHTML={{
          __html: `
          html{color-scheme:light dark}
          body{background-color:#fafbfc;color:#0f172a}
          @media (prefers-color-scheme: dark){body{background-color:#020617;color:#f8fafc}}
        `}} />



        {isProd && (
          <script dangerouslySetInnerHTML={{
            __html: `
            if ('serviceWorker' in navigator) {
              window.addEventListener('load', () => {
                const localHost = ['localhost', '127.0.0.1', '::1'].includes(window.location.hostname);
                if (localHost) {
                  navigator.serviceWorker.getRegistrations()
                    .then((registrations) => registrations.forEach((registration) => registration.unregister()))
                    .catch(() => {});
                  return;
                }
                navigator.serviceWorker.getRegistration()
                  .then((reg) => {
                    if (!reg) {
                      navigator.serviceWorker.register('/sw.js')
                        .catch(() => {});
                    }
                  })
                  .catch(() => {
                    navigator.serviceWorker.register('/sw.js').catch(()=>{});
                  });
              });
            }
          `}} />
        )}
      </head>
      <body suppressHydrationWarning className="min-h-screen bg-[#fafbfc] text-slate-900 selection:bg-violet-100 selection:text-violet-900 dark:bg-[#020617] dark:text-slate-100">
        {/* Global WebSite + Organization Schema for SEO */}
        <StructuredData data={generateWebsiteSchema(baseUrl)} />
        <StructuredData data={{
          "@context": "https://schema.org",
          "@type": "Organization",
          "name": "100 SEO Tools",
          "url": baseUrl,
          "logo": `${baseUrl}${logoImage}`,
          "sameAs": socialLinks,
          "description": "Free SEO tools collection for keyword research, on-page optimization, technical SEO, and performance tracking"
        }} />
        {/* Skip to main content link for accessibility */}
        <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-violet-600 text-white px-4 py-2 rounded-xl z-50 shadow-xl">
          Skip to main content
        </a>
        <ClientRoot>
          <div className="flex min-h-screen flex-col">
            {/* Global header */}
            <Navbar />

            {/* Client helpers (FAB, preferences, performance monitor) */}
            <ClientLayout />

            {/* Main content */}
            <main id="main" className="flex-1 pt-16 md:pt-24 pb-12 md:pb-16" tabIndex="-1">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <ErrorBoundary>
                  {children}
                </ErrorBoundary>
              </div>
            </main>

            {/* Global footer */}
            <Footer />
          </div>

          {/* Vercel Speed Insights */}
          {isVercel && <SpeedInsights />}
        </ClientRoot>
      </body>
    </html>
  );
}
