import StructuredData from '../../../components/StructuredData';
import ToolLayout from '../../../components/ToolLayout';
import ToolRunner from '../../../components/ToolRunner';
import { getToolBySlug, getAllToolsMeta } from '../../../tools';
import { getBaseUrl } from '../../../lib/site';
import { generateSoftwareApplicationSchema, generateHowToSchema, generateFAQSchema } from '../../../lib/schema';

export async function generateMetadata() {
  const tool = getToolBySlug('ai-blog-intro-writer');
  const baseUrl = getBaseUrl();
  const title = `${tool.name} – Free AI Blog Intro Generator | 100 SEO Tools`;
  const description = `${tool.description} Generate compelling blog introductions that improve engagement and SEO. Free, fast, and no login.`;
  return {
    title,
    description,
    alternates: { canonical: `${baseUrl}/tools/${tool.slug}` },
    keywords: 'ai blog intro writer, blog introduction generator, content writing tools, seo tools, free',
    openGraph: {
      title,
      description,
      url: `/tools/${tool.slug}`,
      type: 'website',
      siteName: '100 SEO Tools',
      locale: 'en_US',
      images: [
        { url: '/og-image.jpg', width: 1200, height: 630, alt: `${tool.name} – Free AI Tool` }
      ]
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      site: '@100seotools',
      creator: '@100seotools'
    }
  };
}

export default function Page() {
  const tool = getToolBySlug('ai-blog-intro-writer');
  const baseUrl = getBaseUrl();

  // Related tools from existing inventory
  const relatedTools = getAllToolsMeta()
    .filter(t => ['blog-title-generator','heading-analyzer','ai-content-improver','ai-meta-tag-writer','keyword-density-checker','ai-article-length-optimizer','meta-description-writer'].includes(t.slug))
    .slice(0, 6);

  // Structured data
  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: `${baseUrl}/` },
      { '@type': 'ListItem', position: 2, name: 'Tools', item: `${baseUrl}/` },
      { '@type': 'ListItem', position: 3, name: tool.name, item: `${baseUrl}/tools/${tool.slug}` }
    ]
  };
  const softwareLd = generateSoftwareApplicationSchema(tool, baseUrl);
  const howToLd = generateHowToSchema(tool, baseUrl);
  const faqLd = generateFAQSchema([
    { q: 'How do I write a strong blog intro?', a: 'Lead with the reader’s problem, promise a clear outcome, set expectations for what the article covers, and keep it concise and specific.' },
    { q: 'Is the tool free and private?', a: 'Yes. It is free to use with no login. Processing happens in your browser; no data is sent to our servers.' },
    { q: 'Can I customize tone and audience?', a: 'Yes. Use the inputs to set tone, audience, and context. The output adapts to your selections.' }
  ], baseUrl);

  return (
    <ToolLayout tool={tool} formFirst={true} relatedTools={relatedTools}>
      {/* Visible Breadcrumbs */}
      <nav aria-label="Breadcrumb" className="text-sm text-gray-600 dark:text-gray-300">
        <ol className="flex items-center gap-1 flex-wrap">
          <li><a href="/" className="hover:underline">Home</a></li>
          <li aria-hidden="true" className="mx-1">›</li>
          <li><a href="/" className="hover:underline">Tools</a></li>
          <li aria-hidden="true" className="mx-1">›</li>
          <li aria-current="page" className="font-medium">{tool.name}</li>
        </ol>
      </nav>

      <StructuredData data={breadcrumbLd} />
      <StructuredData data={softwareLd} />
      <StructuredData data={howToLd} />
      <StructuredData data={faqLd} />

      {/* Overview */}
      <section aria-labelledby="overview-heading" className="space-y-3">
        <h2 id="overview-heading" className="text-xl md:text-2xl font-semibold">Write Click-Worthy Blog Introductions</h2>
        <p>
          A strong blog intro earns attention fast. This tool helps you lead with the reader’s need, establish credibility, and preview value—so more visitors continue reading and your article ranks better over time.
        </p>
        <p>
          Use it to generate intros for tutorials, reviews, thought leadership, and how-tos. Edit lightly to match brand voice. Then publish with confidence.
        </p>
      </section>

      {/* How it works */}
      <section aria-labelledby="how-heading" className="space-y-3">
        <h2 id="how-heading" className="text-xl md:text-2xl font-semibold">How It Works</h2>
        <ul className="list-disc pl-5 space-y-1">
          <li>Describe the article topic and audience.</li>
          <li>Set tone (professional, friendly, expert, etc.).</li>
          <li>Add key value promises or outcomes.</li>
          <li>Click Generate to produce a concise intro.</li>
          <li>Copy or download the output for immediate use.</li>
        </ul>
      </section>

      {/* Examples */}
      <section aria-labelledby="examples-heading" className="space-y-3">
        <h2 id="examples-heading" className="text-xl md:text-2xl font-semibold">Example Blog Intros</h2>
        <p className="font-medium">Tech</p>
        <p>Launching a new feature? A strong intro connects your product vision to user outcomes. In this guide, you’ll learn how to frame benefits, minimize jargon, and lead with clarity.</p>
        <p className="font-medium">Travel</p>
        <p>Planning a city escape? Start with a short scene, highlight essentials, and set expectations for budget, timing, and local insights to help readers plan effectively.</p>
        <p className="font-medium">Health</p>
        <p>When tackling wellness topics, an empathetic opening builds trust. Introduce the theme, recognize common challenges, and preview science-backed steps.</p>
        <p className="font-medium">Marketing</p>
        <p>Great campaigns begin with a clear promise. Use a concise intro to define goals, outline the path, and spark curiosity about data-driven tactics you’ll explore.</p>
        <p className="mt-3"><a href="#tool-form" className="btn" aria-label="Jump to the form to generate your blog intro">Generate Your Blog Intro Now</a></p>
      </section>

      {/* FAQs */}
      <section aria-labelledby="faq-heading" className="space-y-3">
        <h2 id="faq-heading" className="text-xl md:text-2xl font-semibold">FAQs</h2>
        <details>
          <summary>How do I optimize intros for SEO?</summary>
          <div className="pt-2">Include the primary keyword naturally, establish topical relevance quickly, and preview structure so readers stay. Pair with strong headings and internal links.</div>
        </details>
        <details>
          <summary>What tone works best?</summary>
          <div className="pt-2">Match audience expectations. For B2B, aim for expert clarity. For consumer content, be friendly and specific. Always be concise.</div>
        </details>
        <details>
          <summary>Will it work in any niche?</summary>
          <div className="pt-2">Yes—adapt inputs to your niche. The tool focuses on clarity, value, and momentum, which are universal.</div>
        </details>
      </section>

      {/* Interlinking */}
      <section aria-labelledby="links-heading" className="space-y-3">
        <h2 id="links-heading" className="text-xl md:text-2xl font-semibold">Continue Your Workflow</h2>
        <ul className="list-disc pl-5 space-y-1">
          <li><a href="/tools/blog-title-generator" className="link">Blog Title Generator</a></li>
          <li><a href="/tools/heading-analyzer" className="link">Heading Analyzer</a></li>
          <li><a href="/tools/ai-content-improver" className="link">AI Content Improver</a></li>
          <li><a href="/tools/ai-meta-tag-writer" className="link">AI Meta Tag Writer</a></li>
          <li><a href="/tools/keyword-density-checker" className="link">Keyword Density Checker</a></li>
          <li><a href="/tools/ai-article-length-optimizer" className="link">AI Article Length Optimizer</a></li>
        </ul>
      </section>

      {/* Tool form and output */}
      <section id="tool-form" aria-labelledby="tool-form-heading">
        <h2 id="tool-form-heading" className="sr-only">Generate Blog Intro</h2>
        <ToolRunner tool={tool} />
      </section>
    </ToolLayout>
  );
}

export const dynamicParams = false;
export const dynamic = 'force-static';