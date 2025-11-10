import { getBaseUrl, siteName } from '../lib/site';
const baseUrl = getBaseUrl();

export const metadata = {
  title: '100+ SEO Tools – Free, Fast, Client-side',
  description: 'All Your SEO Tools in One Place. 100+ browser-based tools for marketers, bloggers, and developers.',
  metadataBase: new URL(baseUrl),
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
    title: '100+ SEO Tools – Free, Fast, Client-side',
    description: 'All Your SEO Tools in One Place. 100+ browser-based tools for marketers, bloggers, and developers.',
    url: baseUrl,
    siteName,
    images: [
      {
        url: `${baseUrl}/icon.svg`,
        width: 1200,
        height: 630,
        alt: '100 SEO Tools Logo',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  // Twitter Card tags
  twitter: {
    card: 'summary_large_image',
    title: '100+ SEO Tools – Free, Fast, Client-side',
    description: 'All Your SEO Tools in One Place. 100+ browser-based tools for marketers, bloggers, and developers.',
    images: [`${baseUrl}/icon.svg`],
  },
  // Canonical URL
  alternates: {
    canonical: baseUrl,
  },
};

import './globals.css';
import { Inter } from 'next/font/google';
import { initPerformanceMonitoring } from '@/lib/performance-monitor';
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
import ErrorBoundary from '../components/ErrorBoundary';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import StructuredData from '../components/StructuredData';
import PerformanceDashboard from '../components/PerformanceDashboard';
import BrowserCompatibilityTest from '../components/BrowserCompatibilityTest';
import ClientLayout from '../components/ClientLayout';
import ClientRoot from '../components/ClientRoot';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
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
        <link rel="preconnect" href="https://www.100seotools.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://www.100seotools.com" />
        <link rel="dns-prefetch" href="https://www.google-analytics.com" />
        <link rel="preconnect" href="https://www.google-analytics.com" />
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="theme-color" content="#0f172a" />
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="icon" href="/icon-light.svg" type="image/svg+xml" media="(prefers-color-scheme: light)" />
        <link rel="icon" href="/icon-dark.svg" type="image/svg+xml" media="(prefers-color-scheme: dark)" />
        <link rel="shortcut icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="mask-icon" href="/icon.svg" color="#0f172a" />
        <link rel="manifest" href="/manifest.json" />

        {/* Minimal critical inline CSS to avoid flash of wrong colors before Tailwind loads */}
        <style dangerouslySetInnerHTML={{__html: `
          html{color-scheme:light dark}
          body{background-color:#ffffff;color:#111827}
          @media (prefers-color-scheme: dark){body{background-color:#0b1020;color:#f3f4f6}}
        `}} />

        {/* Feature detection for conditional polyfill loading */}
        <script type="module" dangerouslySetInnerHTML={{__html: `
          // Baseline ES6+ feature detection
          function checkBaselineFeatures() {
            const tests = [
              () => Array.prototype.at && [1].at(0) === 1,
              () => Array.prototype.flat && [[1]].flat().length === 1,
              () => Array.prototype.flatMap,
              () => Object.fromEntries && Object.fromEntries([["a",1]]).a === 1,
              () => (Object.hasOwn ? Object.hasOwn({x:1}, "x") : Object.prototype.hasOwnProperty.call({x:1}, "x")),
              () => ("".trimEnd && "".trimStart),
            ];

            try {
              return tests.every(fn => {
                try {
                  return !!fn();
                } catch {
                  return false;
                }
              });
            } catch {
              return false;
            }
          }

          // Load polyfills only if baseline features are missing
          if (!checkBaselineFeatures()) {
            import('/polyfills-modern.js').catch(()=>{
              console.warn('Failed to load modern polyfills');
            });
          }
        `}} />

        {/* Legacy polyfills for browsers without ESM support */}
        <script noModule src="/polyfills-legacy.js"></script>

        <script dangerouslySetInnerHTML={{__html: `
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
      </head>
      <body className={`${inter.className} min-h-screen bg-white text-gray-900 dark:bg-gray-950 dark:text-gray-100`}>
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
        <PerformanceDashboard />
        <BrowserCompatibilityTest />
        </ClientRoot>
      </body>
    </html>
  );
}
