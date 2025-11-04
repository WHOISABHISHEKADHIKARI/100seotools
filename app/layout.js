import { getBaseUrl } from '../lib/site';
const baseUrl = getBaseUrl();

export const metadata = {
  title: '100+ SEO Tools – Free, Fast, Client-side',
  description: 'All Your SEO Tools in One Place. 100+ browser-based tools for marketers, bloggers, and developers.',
  metadataBase: new URL(baseUrl),
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
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="theme-color" content="#0f172a" />
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body className="min-h-screen bg-white text-gray-900 dark:bg-gray-950 dark:text-gray-100">
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