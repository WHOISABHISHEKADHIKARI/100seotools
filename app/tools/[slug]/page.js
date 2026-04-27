// Updated: Force rebuild for new tools
import ToolRunner from '../../../components/tools/ToolRunner';
import ToolLayout from '../../../components/layout/ToolLayout';
import StructuredData from '../../../components/ui/StructuredData';
import { generateSoftwareApplicationSchema, generateHowToSchema, generateFAQSchema } from '../../../lib/schema';
import { getToolBySlug, getAllToolsMeta } from '../../../tools';
import { getToolGuide } from '../../../lib/guides';
import { notFound } from 'next/navigation';
import { getBaseUrl, siteName } from '../../../lib/site';
import { slugify } from '../../../lib/utils';

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const tool = getToolBySlug(slug);
  if (!tool) {
    notFound();
  }

  // Enhanced metadata for better SEO
  const toolName = tool.name;
  const toolDescription = tool.metaDescription || tool.description;
  const toolCategory = tool.category;
  const title = tool.metaTitle || `${toolName} – Free SEO Tool | 100 SEO Tools`;
  // Create a compelling description using guide sections if available, otherwise fallback
  const guide = getToolGuide(tool);
  let description = (toolDescription || '').slice(0, 155);

  if (guide && guide.sections && guide.sections.what) {
    // Try to construct a rich snippet style description
    const richDesc = `Use ${toolName} to ${guide.sections.what.split('.')[0].toLowerCase()}. Includes step-by-step instructions, examples, and optimization tips.`;
    if (richDesc.length <= 160) {
      description = richDesc;
    }
  }

  const keywords = Array.isArray(tool.keywords) && tool.keywords.length > 0
    ? tool.keywords.join(', ')
    : `${tool.slug.replace(/-/g, ' ')}, ${toolCategory.toLowerCase()}, seo tools, free seo tools`;

  return {
    title,
    description,
    alternates: { canonical: `${getBaseUrl()}/tools/${tool.slug}` },
    keywords,
    robots: { index: true, follow: true },
    openGraph: {
      title: title.replace(' | 100 SEO Tools', ' – Free Online SEO Tool'),
      description,
      url: `${getBaseUrl()}/tools/${tool.slug}`,
      type: 'website',
      siteName,
      locale: 'en_US',
      images: [
        {
          url: '/og-image.jpg',
          width: 1200,
          height: 630,
          alt: `${toolName} - Free SEO Tool`
        }
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

export default async function ToolPage({ params }) {
  const { slug } = await params;
  const tool = getToolBySlug(slug);
  if (!tool) {
    // Use Next.js App Router 404 handling to render app/not-found.js
    notFound();
  }

  // Get related tools based on category
  const allTools = getAllToolsMeta();
  const relatedTools = allTools
    .filter(t => t.category === tool.category && t.slug !== tool.slug)
    .slice(0, 10);

  const baseUrl = getBaseUrl();

  // Enhanced structured data for better AI crawler understanding
  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: `${baseUrl}/` },
      { '@type': 'ListItem', position: 2, name: tool.category, item: `${baseUrl}/category/${slugify(tool.category)}` },
      { '@type': 'ListItem', position: 3, name: tool.name, item: `${baseUrl}/tools/${tool.slug}` }
    ]
  };

  // Use enhanced schema generators
  const softwareLd = generateSoftwareApplicationSchema(tool, baseUrl);
  const howToLd = generateHowToSchema(tool, baseUrl);
  const guide = getToolGuide(tool);
  const faqLd = Array.isArray(guide.faqs) && guide.faqs.length > 0 ? generateFAQSchema(guide.faqs, baseUrl) : null;

  return (
    <ToolLayout
      tool={tool}
      formFirst={true}
      relatedTools={relatedTools}
      extraSchema={[breadcrumbLd, softwareLd, howToLd, faqLd].filter(Boolean)}
    >
      <ToolRunner tool={tool} />
    </ToolLayout>
  );
}

// Ensure static generation of valid tool slugs to avoid dynamic runtime misses
export function generateStaticParams() {
  const tools = getAllToolsMeta();
  return tools.map((t) => ({ slug: t.slug }));
}
// Ensure unknown slugs return 404 and page is treated as static
export const dynamicParams = false;
export const dynamic = 'force-static';
