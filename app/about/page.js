import StructuredData from '../../components/StructuredData';

export const metadata = {
  title: 'About 100 SEO Tools',
  description:
    'Learn what 100 SEO Tools is, how it works, who it is for, and why it is free, fast, and privacy-friendly.',
  alternates: { canonical: '/about' },
  openGraph: {
    title: 'About 100 SEO Tools',
    description:
      'Learn what 100 SEO Tools is, how it works, who it is for, and why it is free, fast, and privacy-friendly.',
    url: '/about',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'About 100 SEO Tools',
    description:
      'Learn what 100 SEO Tools is, how it works, who it is for, and why it is free, fast, and privacy-friendly.',
  },
};

export default function AboutPage() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

  const aboutLd = {
    '@context': 'https://schema.org',
    '@type': 'AboutPage',
    name: 'About 100 SEO Tools',
    description:
      '100 SEO Tools is a free, browser-based toolkit for keyword research, on-page optimization, technical checks, local SEO, AI writing, and performance tracking.',
    url: `${baseUrl}/about`,
    mainEntityOfPage: `${baseUrl}/about`,
    isPartOf: {
      '@type': 'WebSite',
      name: '100 SEO Tools',
      url: baseUrl,
    },
  };

  return (
    <article className="max-w-3xl mx-auto py-10 space-y-10">
      <StructuredData data={aboutLd} />

      <header className="space-y-3 text-center">
        <h1 className="text-3xl md:text-4xl font-bold">About 100 SEO Tools</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Free, fast, and privacy-friendly. Run 100+ SEO helpers directly in your
          browser — no signups or external APIs.
        </p>
      </header>

      <section className="space-y-3">
        <h2 className="text-xl md:text-2xl font-semibold">What is it?</h2>
        <p className="text-gray-700 dark:text-gray-300">
          100 SEO Tools is an all-in-one, browser-based toolkit created for marketers,
          developers, agencies, and bloggers. It includes keyword research utilities,
          on-page optimizers, technical validators, link tools, local SEO helpers,
          AI writing assistants, and performance calculators — all accessible instantly,
          without logins.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl md:text-2xl font-semibold">Key features</h2>
        <ul className="list-disc pl-5 space-y-2 text-gray-700 dark:text-gray-300">
          <li>100+ modular tools organized by category.</li>
          <li>Client-side execution for speed and privacy.</li>
          <li>Favorites and filters to streamline workflows.</li>
          <li>Per-tool guides and semantic blog articles for learning.</li>
          <li>Structured data and a clean sitemap for crawlability.</li>
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl md:text-2xl font-semibold">How it works</h2>
        <p className="text-gray-700 dark:text-gray-300">
          Each tool is a small web module that runs locally in your browser. There are no
          server-side calls, and no content or inputs are stored. This makes the tools fast,
          reliable, and private by default.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl md:text-2xl font-semibold">Who it’s for</h2>
        <ul className="list-disc pl-5 space-y-2 text-gray-700 dark:text-gray-300">
          <li>SEOs and content marketers needing quick checks and helpers.</li>
          <li>Developers validating markup, performance, and technical SEO.</li>
          <li>Agencies and freelancers standardizing workflows without heavy tools.</li>
          <li>Bloggers and business owners optimizing pages with simple steps.</li>
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl md:text-2xl font-semibold">Privacy & speed</h2>
        <p className="text-gray-700 dark:text-gray-300">
          Tools are client-side, so your inputs stay in your browser. No accounts or tracking
          are required to use the toolkit. Pages are optimized for fast loading and readable,
          accessible UI.
        </p>
      </section>

      <footer className="pt-4 border-t border-gray-200 dark:border-gray-800">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Have feedback or a tool idea? Reach out via the footer contact links or read the
          <a href="/faq" className="text-brand-600 hover:underline"> FAQ</a>.
        </p>
      </footer>
    </article>
  );
}