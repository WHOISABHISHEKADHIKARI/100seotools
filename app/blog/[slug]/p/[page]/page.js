import BlogGuidePage, { generateMetadata as baseGenerateMetadata } from '../../page.js';

export default function BlogGuidePagePaged({ params }) {
  const { slug, page } = params;
  return <BlogGuidePage params={{ slug }} searchParams={{ page }} />;
}

export async function generateMetadata({ params }) {
  const { slug, page } = params;
  return baseGenerateMetadata({ params: { slug }, searchParams: { page } });
}