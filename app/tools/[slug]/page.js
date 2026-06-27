import ToolRunner from '../../../components/tools/ToolRunner';
import ToolLayout from '../../../components/layout/ToolLayout';
import ShareActions from '../../../components/ui/ShareActions';
import BlogSection from '../../../components/blog/BlogSection';
import { generateSoftwareApplicationSchema, generateHowToSchema, generateFAQSchema } from '../../../lib/schema';
import { getToolBySlug, getAllToolsMeta } from '../../../tools';
import { getToolGuide } from '../../../lib/guides';
import { notFound } from 'next/navigation';
import { getBaseUrl } from '../../../lib/site';
import { createSocialMetadata } from '../../../lib/socialMetadata';
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
    ...createSocialMetadata({
      title,
      description,
      url: canonicalUrl,
      imageAlt: `${toolName} - Free SEO Tool`,
    }),
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
  const guide = getToolGuide(tool);
  const howToLd = generateHowToSchema(tool, baseUrl, guide.howToSteps);
  const faqLd = Array.isArray(guide.faqs) && guide.faqs.length > 0 ? generateFAQSchema(guide.faqs, baseUrl) : null;
  const webPageLd = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    '@id': `${baseUrl}/tools/${tool.slug}#webpage`,
    'name': tool.name.split('|')[0].trim(),
    'description': tool.description,
    'url': `${baseUrl}/tools/${tool.slug}`,
    'isPartOf': { '@id': `${baseUrl}/#website` },
    'inLanguage': 'en-US',
    'speakable': {
      '@type': 'SpeakableSpecification',
      'cssSelector': ['#intro-heading', '#how-to-heading', '#faq-heading']
    }
  };

  return (
    <ToolLayout
      tool={tool}
      formFirst={true}
      relatedTools={relatedTools}
      extraSchema={[breadcrumbLd, softwareLd, howToLd, faqLd, webPageLd].filter(Boolean)}
    >
      <div className="space-y-12">
        <section id="tool-interface" className="scroll-mt-20">
          <ToolRunner tool={tool} />
        </section>

        <div className="flex justify-between items-center py-6 border-y border-gray-100 dark:border-gray-800">
          <ShareActions title={tool.name} url={`${baseUrl}/tools/${tool.slug}`} />
          <div className="text-sm text-gray-500">
            Trusted by <span className="font-bold text-brand-600">15,000+</span> marketers every month
          </div>
        </div>

        <article className="prose prose-slate dark:prose-invert max-w-none">
          <BlogSection>
            <h2>How to Use the {tool.name}</h2>
            <p>{guide.introduction || `Learn how to use the ${tool.name} tool effectively for your SEO workflow.`}</p>
            {guide.howToSteps && guide.howToSteps.length > 0 && (
              <>
                <h3>Step-by-Step Guide</h3>
                <ol>
                  {guide.howToSteps.map((step, i) => (
                    <li key={i}>{step}</li>
                  ))}
                </ol>
              </>
            )}
          </BlogSection>
        </article>
      </div>
    </ToolLayout>
  );
}

export function generateStaticParams() {
  const tools = getAllToolsMeta();
  return tools.map((tool) => ({ slug: tool.slug }));
}

export const dynamicParams = false;
export const dynamic = 'force-static';
