import BlogPage, { metadata as blogMetadata } from '../../page';

export const metadata = blogMetadata;

export default function BlogToolsPage({ params }) {
  const toolsPage = Number(params.toolsPage) || 1;
  return BlogPage({ searchParams: { toolsPage } });
}