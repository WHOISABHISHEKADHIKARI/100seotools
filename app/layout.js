import { getBaseUrl, siteName } from '../lib/site';
const baseUrl = getBaseUrl();

export const metadata = {
  title: '100+ Free SEO Tools  - No Signup Required | Used by 50,000+ Marketers',
  description: '✓ 100+ free SEO tools ✓ Keyword research ✓ On-page audit ✓ Technical SEO ✓ Content optimization ✓ No login needed ✓ Instant results. Start optimizing now!',
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
    title: '100+ Free SEO Tools  - No Signup Required',
    description: '✓ 100+ free SEO tools ✓ Keyword research ✓ On-page audit ✓ Technical SEO ✓ No login needed. Used by 50,000+ marketers worldwide!',
    url: baseUrl,
    siteName,
    images: [
      {
        url: `${baseUrl}/og-image.jpg`,
        width: 1200,
        height: 630,
        alt: '100 Free SEO Tools - Complete Toolkit for Marketers',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  // Twitter Card tags
  twitter: {
    card: 'summary_large_image',
    title: '100+ Free SEO Tools  - No Signup Required',
    description: '✓ 100+ free SEO tools ✓ Keyword research ✓ On-page audit ✓ Technical SEO ✓ No login needed. Used by 50,000+ marketers!',
    images: [`${baseUrl}/og-image.jpg`],
  },
  // Canonical URL
  alternates: {
    canonical: baseUrl,
  },
};

import './globals.css';
import { Inter } from 'next/font/google';
import { initPerformanceMonitoring } from '../lib/performance-monitor';
import Script from 'next/script';
const isProd = process.env.NODE_ENV === 'production';
const GA_ID = process.env.NEXT_PUBLIC_GA_ID;
const analyticsDisabled = process.env.NEXT_PUBLIC_DISABLE_ANALYTICS === 'true';
const enableAnalytics = isProd && !analyticsDisabled && GA_ID;

const inter = Inter({ subsets: ['latin'], display: 'swap', weight: ['400', '700'] });

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
        <meta name="theme-color" content="#0f172a" />
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="icon" href="/icon-light.svg" type="image/svg+xml" media="(prefers-color-scheme: light)" />
        <link rel="icon" href="/icon-dark.svg" type="image/svg+xml" media="(prefers-color-scheme: dark)" />
        <link rel="shortcut icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="mask-icon" href="/icon.svg" color="#0f172a" />
        <link rel="manifest" href="/manifest.json" />

        {/* Minimal critical inline CSS to avoid flash of wrong colors before Tailwind loads */}
        <style dangerouslySetInnerHTML={{
          __html: `
          html{color-scheme:light dark}
          body{background-color:#ffffff;color:#111827}
          @media (prefers-color-scheme: dark){body{background-color:#0b1020;color:#f3f4f6}}
        `}} />



        {isProd && (
          <script dangerouslySetInnerHTML={{
            __html: `
            if ('serviceWorker' in navigator) {
              window.addEventListener('load', () => {
                navigator.serviceWorker.getRegistration()
                  .then((reg) => {
                    if (!reg) {
                      navigator.serviceWorker.register('/sw.js')
                        .then((registration) => {
                          console.log('Service Worker registered with scope:', registration.scope);
                        })
                        .catch((error) => {
                          console.log('Service Worker registration failed:', error);
                        });
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
      <body suppressHydrationWarning className={`${inter.className} min-h-screen bg-white text-gray-900 dark:bg-gray-950 dark:text-gray-100`}>
        {/* Global WebSite + Organization Schema for SEO */}
        <StructuredData data={generateWebsiteSchema(baseUrl)} />
        <StructuredData data={{
          "@context": "https://schema.org",
          "@type": "Organization",
          "name": "100 SEO Tools",
          "url": baseUrl,
          "logo": `${baseUrl}/logo.png`,
          "sameAs": [
            "https://github.com/WHOISABHISHEKADHIKARI"
          ],
          "description": "Free SEO tools collection for keyword research, on-page optimization, technical SEO, and performance tracking"
        }} />
        {/* Skip to main content link for accessibility */}
        <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-blue-600 text-white px-4 py-2 rounded-md z-50">
          Skip to main content
        </a>
        <ClientRoot>
          {/* Global header */}
          <div className="max-w-7xl mx-auto px-4">
            <Navbar />
          </div>

          {/* Client helpers (FAB, preferences, performance monitor) */}
          <ClientLayout />

          {/* Main content */}
          <div className="max-w-7xl mx-auto px-4">
            <ErrorBoundary>
              <main id="main" className="pb-12 md:pb-16" tabIndex="-1">{children}</main>
            </ErrorBoundary>
          </div>

          {/* Global footer */}
          <Footer />

          {/* Vercel Speed Insights */}
          <SpeedInsights />

        </ClientRoot>
      </body>
    </html>
  );
}
