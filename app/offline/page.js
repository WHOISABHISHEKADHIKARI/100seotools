const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://100tools.app';

export const metadata = {
  title: 'Offline - 100+ SEO Tools',
  description: 'You are currently offline. Please check your internet connection.',
  alternates: { canonical: `${baseUrl}/offline` },
  robots: { index: false, follow: false },
  openGraph: {
    title: 'Offline - 100+ SEO Tools',
    description: 'You are currently offline. Please check your internet connection.',
    url: `${baseUrl}/offline`,
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'Offline - 100+ SEO Tools',
    description: 'You are currently offline. Please check your internet connection.'
  }
};

import OfflineContent from '../../components/OfflineContent';

export default function OfflinePage() {
  return <OfflineContent />;
}