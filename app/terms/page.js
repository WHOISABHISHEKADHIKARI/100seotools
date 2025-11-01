export const metadata = {
  title: 'Terms of Service – 100 SEO Tools',
  description: 'Read the terms governing your use of 100 SEO Tools. Client-side utilities provided as-is without warranties.',
  alternates: { canonical: '/terms' },
  robots: { index: true, follow: true },
};

export default function TermsPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <header className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold">Terms of Service</h1>
        <p className="text-gray-600 dark:text-gray-400">Updated: {new Date().toLocaleDateString()}</p>
      </header>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Acceptance of Terms</h2>
        <p>
          By using 100 SEO Tools, you agree to these Terms of Service. If you do not agree, please discontinue use.
        </p>

        <h2 className="text-xl font-semibold">Use of Tools</h2>
        <p>
          Our tools are provided for informational and productivity purposes. You are responsible for how you use outputs within your projects.
        </p>

        <h2 className="text-xl font-semibold">Availability & Changes</h2>
        <p>
          Features may change without notice. We strive for reliability but do not guarantee uninterrupted availability.
        </p>

        <h2 className="text-xl font-semibold">Disclaimer</h2>
        <p>
          Tools are provided "as-is" without warranties of any kind. We are not liable for damages resulting from use.
        </p>

        <h2 className="text-xl font-semibold">Contact</h2>
        <p>
          For questions about these terms, contact Hashtag Solutions.
        </p>
      </section>
    </div>
  );
}