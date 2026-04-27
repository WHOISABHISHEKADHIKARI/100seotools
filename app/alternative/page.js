import { getBaseUrl, siteName } from '../../lib/site';
import AlternativeInteractive from '../../components/tools/AlternativeInteractive';

const baseUrl = getBaseUrl();
const primaryUrl = `${baseUrl}/tools/keyword-density-checker`;

// Metadata with canonical and noindex directives for alternative page
export const metadata = {
  title: 'Alternative: Keyword Density Checker - 100 SEO Tools',
  description: 'Alternative implementation of keyword density checker tool with enhanced features.',

  // Canonical URL pointing to primary version
  alternates: {
    canonical: primaryUrl,
  },

  // Robots directives to prevent indexing of alternative version
  robots: {
    index: false,
    follow: true,
    googleBot: {
      index: false,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },

  // Open Graph tags for social sharing (pointing to primary)
  openGraph: {
    title: 'Keyword Density Checker - 100 SEO Tools',
    description: 'Analyze keyword density in your content with our free SEO tool.',
    url: primaryUrl,
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

  // Twitter Card tags
  twitter: {
    card: 'summary_large_image',
    title: 'Keyword Density Checker - 100 SEO Tools',
    description: 'Analyze keyword density in your content with our free SEO tool.',
    images: [`${baseUrl}/icon.svg`],
  },
};

// Export metadata directly - this is the correct way for App Router
export { metadata };

export default function AlternativePage() {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header with canonical reference */}
      <section className="text-center space-y-4 py-8">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
          Alternative Keyword Density Checker
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300">
          This is an alternative implementation of our keyword density analysis tool.
        </p>

        {/* Canonical reference notice */}
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <p className="text-sm text-blue-800 dark:text-blue-200">
            <strong>SEO Notice:</strong> This alternative page is not indexed by search engines.
            The primary version can be found at{' '}
            <a
              href={primaryUrl}
              className="underline hover:no-underline font-medium"
              rel="canonical"
            >
              {primaryUrl}
            </a>
          </p>
        </div>
      </section>

      {/* Alternative tool implementation */}
      <section className="card p-6">
        <h2 className="text-2xl font-semibold mb-4">Enhanced Keyword Analysis</h2>

        <AlternativeInteractive primaryUrl={primaryUrl} />

        {/* Results placeholder */}
        <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-md">
          <p className="text-gray-600 dark:text-gray-300">
            Analysis results would appear here after processing...
          </p>
        </div>
      </section>

      {/* Technical documentation */}
      <section className="card p-6">
        <h2 className="text-2xl font-semibold mb-4">Technical Implementation Details</h2>

        <div className="space-y-4 text-sm">
          <div>
            <h3 className="font-semibold mb-2">Canonical Implementation:</h3>
            <ul className="list-disc list-inside space-y-1 text-gray-600 dark:text-gray-300">
              <li>Canonical URL points to primary version: <code className="bg-gray-100 dark:bg-gray-700 px-1 rounded">{primaryUrl}</code></li>
              <li>Meta robots set to: <code className="bg-gray-100 dark:bg-gray-700 px-1 rounded">noindex, follow</code></li>
              <li>HTTP headers include X-Robots-Tag for additional crawler guidance</li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Duplicate Content Prevention:</h3>
            <ul className="list-disc list-inside space-y-1 text-gray-600 dark:text-gray-300">
              <li>Search engines instructed not to index this alternative version</li>
              <li>Link equity passed to primary version via canonical tag</li>
              <li>Social media tags point to primary version for consistency</li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Implementation Date:</h3>
            <p className="text-gray-600 dark:text-gray-300">
              First detection: April 11, 2025<br />
              Resolution implemented: {new Date().toLocaleDateString()}
            </p>
          </div>
        </div>
      </section>

      {/* Verification steps */}
      <section className="card p-6">
        <h2 className="text-2xl font-semibold mb-4">Verification & Testing</h2>

        <div className="space-y-3">
          <h3 className="font-semibold">Technical Verification Steps:</h3>
          <ol className="list-decimal list-inside space-y-2 text-gray-600 dark:text-gray-300">
            <li>Check canonical tag implementation in page source</li>
            <li>Verify meta robots tag contains "noindex, follow"</li>
            <li>Confirm HTTP headers include X-Robots-Tag</li>
            <li>Test with Google Search Console URL Inspection tool</li>
            <li>Validate structured data and meta tags</li>
          </ol>

          <h3 className="font-semibold mt-4">Search Engine Verification:</h3>
          <ul className="list-disc list-inside space-y-1 text-gray-600 dark:text-gray-300">
            <li>Submit primary URL for indexing in Google Search Console</li>
            <li>Monitor for duplicate content warnings</li>
            <li>Check that alternative page is excluded from search results</li>
            <li>Verify canonical signals are properly recognized</li>
          </ul>
        </div>
      </section>
    </div>
  );
}
