import { getBaseUrl } from '../../lib/site';
import { createSocialMetadata } from '../../lib/socialMetadata';
const baseUrl = getBaseUrl();

export const metadata = {
  title: 'Offline - 100+ SEO Tools',
  description: 'You are currently offline. Please check your internet connection.',
  alternates: { canonical: `${baseUrl}/offline` },
  robots: { index: false, follow: false },
  ...createSocialMetadata({
    title: 'Offline - 100+ SEO Tools',
    description: 'You are currently offline. Please check your internet connection.',
    url: `${baseUrl}/offline`,
    imageAlt: 'Offline - 100 SEO Tools',
  })
};

import OfflineContent from '../../components/layout/OfflineContent';

export default function OfflinePage() {
  return <OfflineContent />;
}
