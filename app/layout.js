export const metadata = {
  title: '100+ SEO Tools – Free, Fast, Client-side',
  description: 'All Your SEO Tools in One Place. 100+ browser-based tools for marketers, bloggers, and developers.',
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://100tools.app'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: '100+ SEO Tools – Free, Fast, Client-side',
    description: 'All Your SEO Tools in One Place. 100+ browser-based tools for marketers, bloggers, and developers.',
    url: '/',
    siteName: '100 SEO Tools',
    locale: 'en_US',
    type: 'website'
  },
  twitter: {
    card: 'summary_large_image',
    title: '100+ SEO Tools – Free, Fast, Client-side',
    description: 'All Your SEO Tools in One Place. 100+ browser-based tools for marketers, bloggers, and developers.'
  }
};

import './globals.css';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import BackToTop from '../components/BackToTop';

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
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(siteJsonLd) }} />
      </head>
      <body className="min-h-screen bg-white text-gray-900 dark:bg-gray-950 dark:text-gray-100">
        <div className="max-w-7xl mx-auto px-4">
          <Navbar />
          <main id="main">{children}</main>
          <Footer />
          <BackToTop />
        </div>
      </body>
    </html>
  );
}