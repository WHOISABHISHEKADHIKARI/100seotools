export const metadata = {
  title: '100+ SEO Tools – Free, Fast, Client-side',
  description: 'All Your SEO Tools in One Place. 100+ browser-based tools for marketers, bloggers, and developers.',
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://100tools.app'),
  alternates: {
    canonical: '/',
  },
  keywords: 'SEO tools, keyword research, on-page optimization, technical SEO, backlink analysis, content SEO, local SEO, competitor analysis, AI SEO tools',
  authors: [{ name: 'Hashtag Solutions', url: 'https://hashtagweb.com.np/' }],
  creator: 'Hashtag Solutions',
  publisher: 'Hashtag Solutions',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0f172a' },
  ],
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 5,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'IIDbfvTOF7fBFu7Qq_NHwku3OY6Yl4HYLbh2oo-MWQg'
  },
  openGraph: {
    title: '100+ SEO Tools – Free, Fast, Client-side',
    description: 'All Your SEO Tools in One Place. 100+ browser-based tools for marketers, bloggers, and developers.',
    url: '/',
    siteName: '100 SEO Tools',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: '100+ SEO Tools',
      }
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: '100+ SEO Tools – Free, Fast, Client-side',
    description: 'All Your SEO Tools in One Place. 100+ browser-based tools for marketers, bloggers, and developers.',
    creator: '@hashtagsolutions',
    images: ['/twitter-image.png'],
  },
  manifest: '/manifest.json',
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/icon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/icon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180' }
    ],
    other: [
      {
        rel: 'mask-icon',
        url: '/safari-pinned-tab.svg',
        color: '#5bbad5',
      },
    ],
  },
};

import './globals.css';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import BackToTop from '../components/BackToTop';
import SplashScreen from '../components/SplashScreen';
import ErrorBoundary from '../components/ErrorBoundary';

export default function RootLayout({ children }) {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://100tools.app';
  const orgJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: '100 SEO Tools',
    url: baseUrl + '/',
    logo: baseUrl + '/icon.png'
  };
  const siteJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: '100 SEO Tools',
    url: baseUrl + '/',
    potentialAction: {
      '@type': 'SearchAction',
      target: baseUrl + '/?q={search_term_string}',
      'query-input': 'required name=search_term_string'
    }
  };
  return (
    <html lang="en" suppressHydrationWarning className="scroll-smooth">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="theme-color" content="#ffffff" media="(prefers-color-scheme: light)" />
        <meta name="theme-color" content="#0f172a" media="(prefers-color-scheme: dark)" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var theme = localStorage.getItem('theme');
                  var isDark = theme ? theme === 'dark' : true;
                  document.documentElement.classList.toggle('dark', isDark);
                } catch (e) {
                  document.documentElement.classList.add('dark');
                }
              })();
            `,
          }}
        />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(siteJsonLd) }} />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js').then(
                    function(registration) {
                      console.log('ServiceWorker registration successful with scope: ', registration.scope);
                    },
                    function(err) {
                      console.log('ServiceWorker registration failed: ', err);
                    }
                  );
                });
              }
            `,
          }}
        />
      </head>
      <body className="min-h-screen bg-white text-gray-900 dark:bg-gray-950 dark:text-gray-100">
        <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:top-0 focus:left-0 focus:z-50 focus:px-4 focus:py-2 focus:bg-brand-500 focus:text-white focus:rounded focus:outline-none">Skip to main content</a>
        <SplashScreen duration={1200} />
        <div className="max-w-7xl mx-auto px-4">
          <Navbar />
          <ErrorBoundary>
            <main id="main" className="pb-12 md:pb-16" tabIndex="-1">{children}</main>
          </ErrorBoundary>
        </div>
        <Footer />
        <BackToTop />
      </body>
    </html>
  );
}