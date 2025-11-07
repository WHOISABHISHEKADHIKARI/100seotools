import { getBaseUrl, siteName } from '../../../lib/site';
import KeywordDensityInteractive from '../../../components/KeywordDensityInteractive';

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
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <section className="text-center space-y-4 py-8">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
          Keyword Density Checker
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300">
          Analyze keyword density in your content to optimize for search engines.
        </p>
      </section>

      <section className="card p-6">
        <h2 className="text-2xl font-semibold mb-4">Content Analysis Tool</h2>

        <KeywordDensityInteractive />

        <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-md">
          <h3 className="font-semibold mb-2">Analysis Results</h3>
          <p className="text-gray-600 dark:text-gray-300">
            Keyword density analysis results will appear here after processing your content.
          </p>
        </div>
      </section>

      <section className="card p-6">
        <h2 className="text-2xl font-semibold mb-4">About Keyword Density</h2>
        <div className="prose dark:prose-invert max-w-none">
          <p>
            Keyword density refers to the percentage of times a keyword appears in your content
            compared to the total word count. While there's no perfect keyword density, most SEO
            experts recommend keeping it between 1-3% for optimal results.
          </p>
          <p>
            Our keyword density checker helps you analyze your content to ensure you're using
            keywords effectively without over-optimization, which can lead to search engine penalties.
          </p>
        </div>
      </section>
    </div>
  );
}
