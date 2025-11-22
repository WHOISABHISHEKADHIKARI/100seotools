import ToolRunner from '../../../components/ToolRunner';
import ToolLayout from '../../../components/ToolLayout';
import StructuredData from '../../../components/StructuredData';
import { generateSoftwareApplicationSchema, generateHowToSchema, generateFAQSchema } from '../../../lib/schema';
import { getToolBySlug, getAllToolsMeta } from '../../../tools';
import { getToolGuide } from '../../../lib/guides';
import { notFound } from 'next/navigation';
import { getBaseUrl, siteName } from '../../../lib/site';

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
  const description = (toolDescription || '').slice(0, 155);
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
      { '@type': 'ListItem', position: 2, name: tool.category, item: `${baseUrl}/category/${tool.category.toLowerCase().replace(/\s+/g, '-')}` },
      { '@type': 'ListItem', position: 3, name: tool.name, item: `${baseUrl}/tools/${tool.slug}` }
    ]
  };

  // Use enhanced schema generators
  const softwareLd = generateSoftwareApplicationSchema(tool, baseUrl);
  const howToLd = generateHowToSchema(tool, baseUrl);
  const guide = getToolGuide(tool);
  const faqLd = Array.isArray(guide.faqs) && guide.faqs.length > 0 ? generateFAQSchema(guide.faqs, baseUrl) : null;

  return (
    <ToolLayout tool={tool} formFirst={true} relatedTools={relatedTools}>
      <StructuredData data={breadcrumbLd} />
      <StructuredData data={softwareLd} />
      <StructuredData data={howToLd} />
      {faqLd && <StructuredData data={faqLd} />}
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
