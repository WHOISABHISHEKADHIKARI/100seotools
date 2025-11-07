import Link from "next/link";
import Redirect301GeneratorClient from "./Client";
import ToolLayout from "../../../components/ToolLayout";
import StructuredData from "../../../components/StructuredData";
import { generateSoftwareApplicationSchema, generateHowToSchema } from "../../../lib/schema";
import ShareActions from "../../../components/ShareActions";
import BlogSection from "../../../components/BlogSection";
import { getToolBySlug, getAllToolsMeta } from "../../../tools";
import { getBaseUrl } from "../../../lib/site";

export const metadata = {
  title: "301 Redirect Generator | Advanced SEO Tool",
  description:
    "Generate production-ready 301 redirects for Apache, Nginx, PHP, HTML, and JavaScript. Detect circular redirects, validate URLs, and visualize redirect flows.",
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: "https://www.100seotools.com/tools/redirect-301-generator",
  },
  openGraph: {
    title: "301 Redirect Generator | Advanced SEO Tool",
    description:
      "Generate production-ready 301 redirects across multiple formats, with real-time validation and redirect flow visualization.",
    type: "website",
    url: "https://www.100seotools.com/tools/redirect-301-generator",
  },
  twitter: {
    card: "summary",
    title: "301 Redirect Generator | Advanced SEO Tool",
    description:
      "Generate production-ready 301 redirects with circular detection, validation, and flow diagrams.",
  },
};

export default function Redirect301GeneratorPage() {
  const tool = getToolBySlug("redirect-301-generator");
  const baseUrl = getBaseUrl();
  const allTools = getAllToolsMeta();
  const relatedTools = allTools
    .filter((t) => t.slug !== tool.slug && (t.slug === "canonical-url-builder" || t.slug === "redirect-checker" || t.slug === "robots-txt-creator" || t.slug === "xml-sitemap-visualizer"))
    .slice(0, 6);

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: `${baseUrl}/` },
      { "@type": "ListItem", position: 2, name: "Categories", item: `${baseUrl}/category` },
      { "@type": "ListItem", position: 3, name: tool.name, item: `${baseUrl}/tools/${tool.slug}` },
    ],
  };

  const softwareLd = generateSoftwareApplicationSchema(tool, baseUrl);
  const howToLd = generateHowToSchema(tool, baseUrl);

  return (
    <>
      {/* Visible breadcrumb for better navigation context */}
      <nav aria-label="Breadcrumb" className="px-4 md:px-8 lg:px-12 max-w-6xl mx-auto mt-6">
        <ol className="flex flex-wrap items-center gap-1 text-sm text-slate-600 dark:text-slate-300">
          <li>
            <Link href="/" prefetch={false} className="hover:text-brand-600 transition-gpu will-change-transform-opacity">Home</Link>
          </li>
          <li aria-hidden className="mx-1">›</li>
          <li>
            <Link href="/category" prefetch={false} className="hover:text-brand-600 transition-gpu will-change-transform-opacity">Categories</Link>
          </li>
          <li aria-hidden className="mx-1">›</li>
          <li className="font-medium text-slate-900 dark:text-white">{tool.name}</li>
        </ol>
      </nav>

      <ToolLayout tool={tool} formFirst={true} relatedTools={relatedTools}>
        {/* Share actions adjacent to title for social sharing and copy */}
        <div className="mb-4 flex items-center justify-between">
          <div className="sr-only">Share this tool</div>
          <ShareActions url={`${baseUrl}/tools/${tool.slug}`} title={tool.name} />
        </div>

        {/* Quick jump anchors for better page navigation */}
        <div className="mb-4 not-prose text-sm text-slate-600 dark:text-slate-300">
          <span className="mr-2">Jump to:</span>
          <a href="#input-section" className="text-brand-600 hover:text-brand-700 transition-gpu will-change-transform-opacity">Rules</a>
          <span className="mx-2" aria-hidden>•</span>
          <a href="#validation-section" className="text-brand-600 hover:text-brand-700 transition-gpu will-change-transform-opacity">Validation</a>
          <span className="mx-2" aria-hidden>•</span>
          <a href="#visual-section" className="text-brand-600 hover:text-brand-700 transition-gpu will-change-transform-opacity">Flow</a>
          <span className="mx-2" aria-hidden>•</span>
          <a href="#output-section" className="text-brand-600 hover:text-brand-700 transition-gpu will-change-transform-opacity">Output</a>
          <span className="mx-2" aria-hidden>•</span>
          <a href="#best-practices" className="text-brand-600 hover:text-brand-700 transition-gpu will-change-transform-opacity">Best Practices</a>
        </div>

        {/* Main interactive component */}
        <Redirect301GeneratorClient />

        {/* Related resources to strengthen interlinking */}
        <section className="mt-6" aria-labelledby="related-resources">
          <h2 id="related-resources" className="text-lg font-semibold mb-2">Related Resources</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Link href="/blog/redirect-301-generator-how-to-use" prefetch={false} className="p-3 rounded-lg border border-slate-200 dark:border-white/10 hover:shadow-sm transition-gpu will-change-transform-opacity">
              <span className="font-medium">How to Use the 301 Redirect Generator</span>
            </Link>
            <Link href="/blog/redirect-301-generator-best-practices-integrations-costs" prefetch={false} className="p-3 rounded-lg border border-slate-200 dark:border-white/10 hover:shadow-sm transition-gpu will-change-transform-opacity">
              <span className="font-medium">Redirect Best Practices, Integrations, and Costs</span>
            </Link>
            <Link href="/tools/canonical-url-builder" prefetch={false} className="p-3 rounded-lg border border-slate-200 dark:border-white/10 hover:shadow-sm transition-gpu will-change-transform-opacity">
              <span className="font-medium">Canonical URL Builder</span>
            </Link>
            <Link href="/tools/redirect-checker" prefetch={false} className="p-3 rounded-lg border border-slate-200 dark:border-white/10 hover:shadow-sm transition-gpu will-change-transform-opacity">
              <span className="font-medium">Redirect Checker</span>
            </Link>
            <Link href="/tools/robots-txt-creator" prefetch={false} className="p-3 rounded-lg border border-slate-200 dark:border-white/10 hover:shadow-sm transition-gpu will-change-transform-opacity">
              <span className="font-medium">Robots.txt Creator</span>
            </Link>
            <Link href="/tools/xml-sitemap-visualizer" prefetch={false} className="p-3 rounded-lg border border-slate-200 dark:border-white/10 hover:shadow-sm transition-gpu will-change-transform-opacity">
              <span className="font-medium">XML Sitemap Visualizer</span>
            </Link>
          </div>
        </section>

        {/* Structured data for crawlers & AI */}
        <StructuredData data={breadcrumbLd} />
        <StructuredData data={softwareLd} />
        <StructuredData data={howToLd} />
      </ToolLayout>

      {/* Blog integration at the bottom for interlinking */}
      <div className="px-4 md:px-8 lg:px-12 max-w-6xl mx-auto mt-8">
        <BlogSection />
      </div>
    </>
  );
}