import dynamic from 'next/dynamic';
import ToolLayout from '../../../components/ToolLayout';
import StructuredData from '../../../components/StructuredData';
import { getToolBySlug } from '../../../tools';
import { FiLoader } from 'react-icons/fi';

const ToolRunner = dynamic(() => import('../../../components/ToolRunner'), {
  ssr: false,
  loading: () => (
    <div className="p-6 flex items-center gap-3" role="status" aria-live="polite" aria-busy="true">
      <FiLoader aria-hidden className="w-5 h-5 animate-spin text-brand-500" />
      <span>Loading tool interface…</span>
    </div>
  )
});

export async function generateMetadata({ params }) {
  const tool = getToolBySlug(params.slug);
  if (!tool) {
    return { title: 'Tool not found' };
  }
  return {
    title: `${tool.name} – 100 SEO Tools`,
    description: tool.description,
    alternates: { canonical: `/tools/${tool.slug}` },
    openGraph: {
      title: `${tool.name} – 100 SEO Tools`,
      description: tool.description,
      url: `/tools/${tool.slug}`,
      type: 'article'
    },
    twitter: {
      card: 'summary',
      title: `${tool.name} – 100 SEO Tools`,
      description: tool.description
    }
  };
}

export default function ToolPage({ params }) {
  const tool = getToolBySlug(params.slug);
  if (!tool) {
    return (
      <div className="py-16 text-center">
        <h2 className="text-xl font-semibold">Tool not found</h2>
        <p className="text-gray-600 dark:text-gray-400">The requested tool does not exist.</p>
      </div>
    );
  }
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://100tools.app';
  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: `${baseUrl}/` },
      { '@type': 'ListItem', position: 2, name: 'Tools', item: `${baseUrl}/` },
      { '@type': 'ListItem', position: 3, name: tool.name, item: `${baseUrl}/tools/${tool.slug}` }
    ]
  };
  const webPageLd = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: tool.name,
    description: tool.description,
    url: `${baseUrl}/tools/${tool.slug}`
  };
  return (
    <ToolLayout tool={tool}>
      <StructuredData data={breadcrumbLd} />
      <StructuredData data={webPageLd} />
      <ToolRunner tool={tool} />
    </ToolLayout>
  );
}