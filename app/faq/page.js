import StructuredData from '../../components/StructuredData';
import { getBaseUrl } from '../../lib/site';

const baseUrl = getBaseUrl();

export const metadata = {
  title: 'FAQ – 100 SEO Tools',
  description:
    'Answers to common questions about 100 SEO Tools: pricing, privacy, features, favorites, guides, and support.',
  alternates: { canonical: `${baseUrl}/faq` },
  openGraph: {
    title: 'FAQ – 100 SEO Tools',
    description:
      'Answers to common questions about 100 SEO Tools: pricing, privacy, features, favorites, guides, and support.',
    url: `${baseUrl}/faq`,
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'FAQ – 100 SEO Tools',
    description:
      'Answers to common questions about 100 SEO Tools: pricing, privacy, features, favorites, guides, and support.',
  },
};

const faqs = [
  {
    q: 'Is 100 SEO Tools free?',
    a: 'Yes. All tools are free to use and run directly in your browser.',
  },
  {
    q: 'Do you store my inputs or data?',
    a: 'No. Tools are client-side; inputs stay in your browser and are not sent to a server.',
  },
  { q: 'Do I need an account?', a: 'No accounts or logins are required.' },
  {
    q: 'How do favorites work?',
    a: 'Click the star on a tool card to mark it as a favorite. Favorites are stored locally in your browser so only you can see them.',
  },
  {
    q: 'Where can I find guides for each tool?',
    a: 'Open any tool page and use the “Read guide” link to access a detailed blog guide, or visit the Blog index to browse all guides.',
  },
  {
    q: 'Are there APIs or integrations?',
    a: 'The toolkit focuses on client-side helpers. If you need integrations or API-based workflows, consider exporting outputs and combining them with your own scripts.',
  },
  {
    q: 'Can I request a new tool?',
    a: 'Yes. Use the contact options in the footer to suggest tools or features.',
  },
  {
    q: 'How do I report bugs?',
    a: 'Describe the issue and share steps to reproduce via footer contact links. Screenshots help a lot.',
  },
  {
    q: 'Will this work on mobile?',
    a: 'Yes. The UI adapts to different screen sizes and supports dark mode.',
  },
];

export default function FAQPage() {
  const faqLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((item) => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: { '@type': 'Answer', text: item.a },
    })),
    url: `${baseUrl}/faq`,
  };

  return (
    <article className="max-w-3xl mx-auto py-10 space-y-8">
      <StructuredData data={faqLd} />

      <header className="space-y-3 text-center">
        <h1 className="text-3xl md:text-4xl font-bold">Frequently Asked Questions</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Quick answers about pricing, privacy, features, guides, and support.
        </p>
      </header>

      <section className="space-y-4">
        {faqs.map((item) => (
          <details key={item.q} className="card p-4" aria-labelledby={item.q.replace(/\s+/g, '-').toLowerCase()}>
            <summary className="cursor-pointer font-medium">{item.q}</summary>
            <div className="mt-2 text-gray-700 dark:text-gray-300">{item.a}</div>
          </details>
        ))}
      </section>

      <footer className="pt-4 border-t border-gray-200 dark:border-gray-800">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Didn’t find what you need? Check the <a href="/blog" className="text-brand-600 hover:underline">Blog</a> for tool guides or contact us via the footer.
        </p>
      </footer>
    </article>
  );
}