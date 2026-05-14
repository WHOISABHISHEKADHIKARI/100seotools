import ToolRunner from '../../../components/tools/ToolRunner';
import ToolLayout from '../../../components/layout/ToolLayout';
import { generateSoftwareApplicationSchema, generateHowToSchema, generateFAQSchema } from '../../../lib/schema';
import { getToolBySlug, getAllToolsMeta } from '../../../tools';
import { getToolGuide } from '../../../lib/guides';
import { notFound } from 'next/navigation';
import { getBaseUrl, siteName, socialPreviewImage, twitterHandle } from '../../../lib/site';
import { slugify } from '../../../lib/utils';
import { standardizeToolSeo } from '../../../lib/toolSeo';

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const tool = getToolBySlug(slug);
  if (!tool) {
    notFound();
  }

  const toolName = tool.name;
  const seo = standardizeToolSeo(tool);
  const title = seo.title;
  const description = seo.description;
  const keywords = seo.keywords.join(', ');
  const canonicalUrl = `${getBaseUrl()}/tools/${tool.slug}`;

  return {
    title,
    description,
    alternates: { canonical: canonicalUrl },
    keywords,
    robots: { index: true, follow: true },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      type: 'website',
      siteName,
      locale: 'en_US',
      images: [
        {
          url: socialPreviewImage,
          width: 1200,
          height: 630,
          alt: `${toolName} - Free SEO Tool`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      site: twitterHandle,
      creator: twitterHandle,
      images: [socialPreviewImage],
    },
  };
}

export default async function ToolPage({ params }) {
  const { slug } = await params;
  const tool = getToolBySlug(slug);
  if (!tool) {
    notFound();
  }

  const allTools = getAllToolsMeta();
  const relatedTools = allTools
    .filter((relatedTool) => relatedTool.category === tool.category && relatedTool.slug !== tool.slug)
    .slice(0, 10);

  const baseUrl = getBaseUrl();
  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: `${baseUrl}/` },
      { '@type': 'ListItem', position: 2, name: tool.category, item: `${baseUrl}/category/${slugify(tool.category)}` },
      { '@type': 'ListItem', position: 3, name: tool.name, item: `${baseUrl}/tools/${tool.slug}` },
    ],
  };

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

export function generateStaticParams() {
  const tools = getAllToolsMeta();
  return tools.map((tool) => ({ slug: tool.slug }));
}

export const dynamicParams = false;
export const dynamic = 'force-static';
