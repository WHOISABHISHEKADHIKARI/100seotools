import { getBaseUrl, siteName } from '../../../lib/site';
import KeywordDensityInteractive from '../../../components/tools/KeywordDensityInteractive';
import ToolLayout from '../../../components/layout/ToolLayout';
import { getToolBySlug } from '../../../tools';

const baseUrl = getBaseUrl();
const canonicalUrl = `${baseUrl}/tools/keyword-density-checker`;

export const metadata = {
  title: 'Keyword Density Checker - Free SEO Tool | 100 SEO Tools',
  description: 'Analyze keyword density in your content with our free SEO tool. Optimize your content for better search engine rankings.',
  alternates: {
    canonical: canonicalUrl,
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
  openGraph: {
    title: 'Keyword Density Checker - Free SEO Tool',
    description: 'Analyze keyword density in your content with our free SEO tool.',
    url: canonicalUrl,
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
  twitter: {
    card: 'summary_large_image',
    title: 'Keyword Density Checker - Free SEO Tool',
    description: 'Analyze keyword density in your content with our free SEO tool.',
    images: [`${baseUrl}/icon.svg`],
  },
};

export default function KeywordDensityCheckerPage() {
  const tool = getToolBySlug('keyword-density-checker');

  if (!tool) {
    return (
      <div className="max-w-4xl mx-auto py-12 text-center">
        <h1 className="text-2xl font-bold">Tool configuration not found</h1>
      </div>
    );
  }

  return (
    <ToolLayout tool={tool} formFirst={true}>
      <KeywordDensityInteractive />
    </ToolLayout>
  );
}
