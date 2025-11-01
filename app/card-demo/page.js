import CardDemoClient from './CardDemoClient.jsx';

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://100tools.app';

export const metadata = {
  title: 'Card UI Demo – Components Preview',
  description: 'Demo page showcasing card UI and grid components used across 100 SEO Tools.',
  alternates: { canonical: `${baseUrl}/card-demo` },
  robots: { index: false, follow: false },
  openGraph: {
    title: 'Card UI Demo – Components Preview',
    description: 'Demo page showcasing card UI and grid components used across 100 SEO Tools.',
    url: `${baseUrl}/card-demo`,
    type: 'website'
  },
  twitter: {
    card: 'summary',
    title: 'Card UI Demo – Components Preview',
    description: 'Demo page showcasing card UI and grid components used across 100 SEO Tools.'
  }
};

export default function CardDemoPage() {
  return <CardDemoClient />;
}