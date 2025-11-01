export const metadata = {
  title: 'Privacy Policy – 100 SEO Tools',
  description: 'Learn how 100 SEO Tools handles data, privacy, and cookies. We are browser-based and do not store personal data.',
  alternates: { canonical: '/privacy' },
  robots: { index: true, follow: true },
};

export default function PrivacyPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <header className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold">Privacy Policy</h1>
        <p className="text-gray-600 dark:text-gray-400">Updated: {new Date().toLocaleDateString()}</p>
      </header>

      <section className="space-y-4">
        <p>
          100 SEO Tools is a browser-based collection of utilities. Most tools run entirely client-side in your browser.
          We do not store personal data on our servers for tool execution.
        </p>
        <h2 className="text-xl font-semibold">Data Processing</h2>
        <p>
          Inputs you provide to the tools are processed locally. Some tools may fetch public web resources when you explicitly request them
          (e.g., validating a robots.txt URL). We do not retain these inputs.
        </p>
        <h2 className="text-xl font-semibold">Analytics</h2>
        <p>
          We may use privacy-friendly analytics to understand aggregate usage. This data is anonymized and does not include personally identifiable information.
        </p>
        <h2 className="text-xl font-semibold">Cookies</h2>
        <p>
          Cookies may be used for preferences (e.g., theme selection). You can clear these in your browser at any time.
        </p>
        <h2 className="text-xl font-semibold">Contact</h2>
        <p>
          For questions about this policy, contact Hashtag Solutions.
        </p>
      </section>
    </div>
  );
}