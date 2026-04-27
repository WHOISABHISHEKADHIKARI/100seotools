import ToolLayout from "../../../components/layout/ToolLayout";
import ToolRunner from "../../../components/tools/ToolRunner";
import StructuredData from "../../../components/ui/StructuredData";
import ShareActions from "../../../components/ui/ShareActions";
import BlogSection from "../../../components/blog/BlogSection";
import { getToolBySlug, getAllToolsMeta } from "../../../tools";
import { getBaseUrl, siteName } from "../../../lib/site";
import { generateSoftwareApplicationSchema, generateHowToSchema, generateFAQSchema } from "../../../lib/schema";

export const dynamic = 'force-static';
export const dynamicParams = false;

// Exhaustive On-Page SEO Optimization for Keyword Density Checker
export const metadata = {
  title: "Keyword Density Checker | Free SEO Content Analysis Tool",
  description:
    "Analyze and optimize your content's keyword density with our free tool. Avoid keyword stuffing, improve topical relevance, and rank higher on Google.",
  keywords: "keyword density checker, seo content analyzer, keyword stuffing tool, content optimization, word frequency counter, on-page seo tool",
  robots: { index: true, follow: true },
  alternates: {
    canonical: "https://www.100seotools.com/tools/keyword-density-checker",
  },
  openGraph: {
    title: "Keyword Density Checker | Free SEO Content Analysis Tool",
    description: "Ensure your content is perfectly optimized. Check keyword frequency and density to avoid penalties and improve search rankings.",
    type: "website",
    url: "https://www.100seotools.com/tools/keyword-density-checker",
    siteName: siteName,
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Keyword Density Checker Tool",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Keyword Density Checker | Free SEO Content Analysis Tool",
    description: "Stop guessing your keyword density. Use our free tool to analyze your content like an SEO pro.",
  },
};

export default function KeywordDensityCheckerPage() {
  const tool = getToolBySlug("keyword-density-checker");
  const baseUrl = getBaseUrl();
  const allTools = getAllToolsMeta();
  
  // Related tools for semantic interlinking
  const relatedTools = allTools
    .filter((t) => t.slug !== tool.slug && (
      t.slug === "ai-article-length-optimizer" ||
      t.slug === "readability-score-calculator" ||
      t.slug === "ai-content-improver" ||
      t.slug === "heading-analyzer" ||
      t.slug === "seo-content-checker" ||
      t.slug === "keyword-intent-identifier"
    ))
    .slice(0, 6);

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: `${baseUrl}/` },
      { "@type": "ListItem", position: 2, name: "Content Tools", item: `${baseUrl}/category/content-tools` },
      { "@type": "ListItem", position: 3, name: "Keyword Density Checker", item: `${baseUrl}/tools/keyword-density-checker` },
    ],
  };

  const faqs = [
    {
      question: "What is the ideal keyword density for SEO?",
      answer: "While there is no fixed 'perfect' percentage, most SEO experts recommend keeping your primary keyword density between 1% and 2%. The key is natural integration rather than hitting a specific number."
    },
    {
      question: "What is keyword stuffing?",
      answer: "Keyword stuffing is the practice of overloading a webpage with keywords in an attempt to manipulate search rankings. This often leads to a poor user experience and can result in Google penalties."
    },
    {
      question: "How does this tool help with LSI keywords?",
      answer: "Our tool doesn't just check your primary keyword; it identifies all frequently used words and phrases, helping you spot opportunities to include Latent Semantic Indexing (LSI) terms that add context to your content."
    },
    {
      question: "Is this keyword density checker free to use?",
      answer: "Yes, like all tools on 100SEOTools, our Keyword Density Checker is 100% free with no registration required."
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
          <ToolRunner tool={tool} />
        </section>

        {/* Share and Social Proof */}
        <div className="flex justify-between items-center py-6 border-y border-gray-100 dark:border-gray-800">
          <ShareActions title={metadata.title} url={metadata.alternates.canonical} />
          <div className="text-sm text-gray-500">
            Trusted by <span className="font-bold text-brand-600">15,000+</span> writers every month
          </div>
        </div>

        {/* SEO Educational Content Section */}
        <article className="prose prose-slate dark:prose-invert max-w-none">
          <BlogSection>
            <h2>Mastering Keyword Density for Search Success</h2>
            <p>
              In the early days of SEO, ranking was as simple as repeating your keyword as many times as possible. Today, Google's <strong>RankBrain</strong> and <strong>BERT</strong> algorithms are far more sophisticated. Our <strong>Keyword Density Checker</strong> is designed to help you navigate this complexity.
            </p>

            <h3>Why Keyword Frequency Still Matters</h3>
            <p>
              Even with AI-driven search, frequency remains a signal of <strong>topical relevance</strong>. If you're writing about "organic coffee," that phrase needs to appear enough times for search engines to understand the primary subject. However, balance is everything.
            </p>
            <ul>
              <li><strong>Clarity:</strong> Helps search engines categorize your page accurately.</li>
              <li><strong>User Experience:</strong> Prevents repetitive, hard-to-read content.</li>
              <li><strong>Safety:</strong> Protects your site from "Over-optimization" penalties.</li>
            </ul>

            <h3>How to Use the Keyword Density Analyzer</h3>
            <ol>
              <li><strong>Paste Your Content:</strong> Simply copy your article or blog post into the text area.</li>
              <li><strong>Specify Focus Keyword:</strong> Tell the tool which term you are specifically targeting.</li>
              <li><strong>Review the Report:</strong> Look at the 1-word, 2-word, and 3-word phrase breakdowns.</li>
              <li><strong>Adjust Accordingly:</strong> If your density is too high (over 3%), try using synonyms. If too low (under 0.5%), find natural places to add the keyword.</li>
            </ol>

            <div className="bg-brand-50 dark:bg-brand-900/20 p-6 rounded-xl border border-brand-100 dark:border-brand-800 my-8">
              <h4 className="text-brand-800 dark:text-brand-300 mt-0">Pro Tip: Focus on Variations</h4>
              <p className="mb-0">
                Instead of using the exact same keyword 20 times, use 10 exact matches and 10 variations (e.g., "coffee beans," "roasted coffee," "brew organic coffee"). This signals <strong>semantic depth</strong> to Google.
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
