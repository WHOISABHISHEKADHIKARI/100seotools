import { getBaseUrl } from '../../lib/site';
const baseUrl = getBaseUrl();

export const metadata = {
  title: 'About – 100 SEO Tools',
  description: 'Learn about 100 SEO Tools, a free, fast, browser-based toolkit built by Hashtag Solutions.',
  alternates: { canonical: `${baseUrl}/about` },
  openGraph: {
    title: 'About – 100 SEO Tools',
    description: 'Learn about 100 SEO Tools, a free, fast, browser-based toolkit built by Hashtag Solutions.',
    url: `${baseUrl}/about`,
    type: 'website'
  },
  twitter: {
    card: 'summary',
    title: 'About – 100 SEO Tools',
    description: 'Learn about 100 SEO Tools, a free, fast, browser-based toolkit built by Hashtag Solutions.'
  }
};

export default function AboutPage() {
  return (
    <main className="max-w-3xl mx-auto py-8">
      <header className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold">About 100 SEO Tools</h1>
        <p className="mt-2 text-gray-600 dark:text-gray-300">Free, fast, and privacy-friendly tools for everyday SEO workflows.</p>
      </header>

      <section className="space-y-4">
        <p>
          100 SEO Tools is an all-in-one, browser-based toolkit designed for digital marketers, developers,
          business owners, and bloggers. It includes keyword research utilities, on-page optimizers,
          technical validators, link tools, local SEO helpers, AI writing assistants, and tracking calculators —
          all accessible instantly without logins.
        </p>
        <p>
          Built by <a className="text-brand-600 hover:underline" href="https://github.com/hashtagsolutions" target="_blank" rel="noopener noreferrer">Hashtag Solutions</a>.
        </p>
      </section>
    </main>
  );
}