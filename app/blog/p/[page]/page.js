import BlogPage, { metadata as blogMetadata } from '../../page';

export const metadata = blogMetadata;

export default function BlogListPage({ params }) {
  const page = Number(params.page) || 1;
  return BlogPage({ searchParams: { page } });
}