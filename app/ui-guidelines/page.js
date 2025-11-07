import { Metadata } from 'next';
import { UIGuidelinesClient } from './Client';

export const metadata = {
  title: 'UI Guidelines - Design System & Components',
  description: 'Comprehensive UI guidelines and design system for consistent, accessible, and beautiful user interfaces across the application.',
  keywords: ['UI guidelines', 'design system', 'components', 'accessibility', 'responsive design', 'dark mode'],
  openGraph: {
    title: 'UI Guidelines - Design System & Components',
    description: 'Comprehensive UI guidelines and design system for consistent, accessible, and beautiful user interfaces.',
    type: 'website',
    images: ['/api/og?title=UI%20Guidelines&subtitle=Design%20System%20%26%20Components'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'UI Guidelines - Design System & Components',
    description: 'Comprehensive UI guidelines and design system for consistent, accessible, and beautiful user interfaces.',
    images: ['/api/og?title=UI%20Guidelines&subtitle=Design%20System%20%26%20Components'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function UIGuidelinesPage() {
  return (
    <>
      <UIGuidelinesClient />
    </>
  );
}