import BlogPage, { metadata as blogMetadata } from '../../../page';

export const metadata = blogMetadata;

export default function BlogListCombinedPage({ params }) {
  const page = Number(params.page) || 1;
  const toolsPage = Number(params.toolsPage) || 1;
  return BlogPage({ searchParams: { page, toolsPage } });
}