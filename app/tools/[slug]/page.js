// Remove dynamic import to improve HMR stability on Windows
import ToolRunner from '../../../components/ToolRunner';
import ToolLayout from '../../../components/ToolLayout';
import StructuredData from '../../../components/StructuredData';
import { generateSoftwareApplicationSchema, generateHowToSchema } from '../../../lib/schema';
import { getToolBySlug, getAllToolsMeta } from '../../../tools';
import { FiLoader } from 'react-icons/fi';
import { notFound } from 'next/navigation';
import { getBaseUrl } from '../../../lib/site';

// Previously used dynamic import with ssr: false which can trigger
// webpack factory errors during Fast Refresh in development on Windows.
// Import ToolRunner normally; it's a client component and will hydrate
// correctly without a dynamic boundary.

export async function generateMetadata({ params }) {
  const tool = getToolBySlug(params.slug);
  if (!tool) {
    return { title: 'Tool not found' };
  }
  
  // Enhanced metadata for better SEO
  const toolName = tool.name;
  const toolDescription = tool.description;
  const toolCategory = tool.category;
  
  return {
    title: `${toolName} – Free SEO Tool | 100 SEO Tools`,
    description: `${toolDescription} Use this free ${toolCategory.toLowerCase()} tool online without login. Part of 100+ free SEO tools for marketers and developers.`,
    alternates: { canonical: `/tools/${tool.slug}` },
    keywords: `${tool.slug.replace(/-/g, ' ')}, ${toolCategory.toLowerCase()}, seo tools, free seo tools`,
    openGraph: {
      title: `${toolName} – Free Online SEO Tool`,
      description: toolDescription,
      url: `/tools/${tool.slug}`,
      type: 'website',
      siteName: '100 SEO Tools',
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
      title: `${toolName} – Free SEO Tool`,
      description: toolDescription,
      site: '@100seotools',
      creator: '@100seotools'
    }
  };
}

export default function ToolPage({ params }) {
  const tool = getToolBySlug(params.slug);
  if (!tool) {
    // Use Next.js App Router 404 handling to render app/not-found.js
    return notFound();
  }
  
  // Get related tools based on category
  const allTools = getAllToolsMeta();
  const relatedTools = allTools
    .filter(t => t.category === tool.category && t.slug !== tool.slug)
    .slice(0, 5);
  
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
  
  return (
    <ToolLayout tool={tool} formFirst={true} relatedTools={relatedTools}>
      <StructuredData data={breadcrumbLd} />
      <StructuredData data={softwareLd} />
      <StructuredData data={howToLd} />
      <ToolRunner tool={tool} />
    </ToolLayout>
  );
}

// Ensure static generation of valid tool slugs to avoid dynamic runtime misses
export function generateStaticParams() {
  const tools = getAllToolsMeta();
  return tools.map((t) => ({ slug: t.slug }));
}