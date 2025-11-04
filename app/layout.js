import { getBaseUrl } from '../lib/site';
const baseUrl = getBaseUrl();

export const metadata = {
  title: '100+ SEO Tools – Free, Fast, Client-side',
  description: 'All Your SEO Tools in One Place. 100+ browser-based tools for marketers, bloggers, and developers.',
  metadataBase: new URL(baseUrl),
  // Open Graph tags
  openGraph: {
    title: '100+ SEO Tools – Free, Fast, Client-side',
    description: 'All Your SEO Tools in One Place. 100+ browser-based tools for marketers, bloggers, and developers.',
    url: baseUrl,
    siteName: '100 SEO Tools',
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
import { UserPreferencesProvider } from '../contexts/UserPreferencesContext';
import ErrorBoundary from '../components/ErrorBoundary';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ClientLayout from '../components/ClientLayout';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://www.google-analytics.com" />
        <link rel="preload" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;700&display=swap" as="style" />
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;700&display=swap" media="print" onLoad="this.media='all'" />
        <noscript>
          <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;700&display=swap" />
        </noscript>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="theme-color" content="#0f172a" />
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="manifest" href="/manifest.json" />

        <script src="/sw-register.js" defer></script>
      </head>
      <body className="min-h-screen bg-white text-gray-900 dark:bg-gray-950 dark:text-gray-100">
        {/* Skip to main content link for accessibility */}
        <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-blue-600 text-white px-4 py-2 rounded-md z-50">
          Skip to main content
        </a>
        <UserPreferencesProvider>
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
        </UserPreferencesProvider>
      </body>
    </html>
  );
}