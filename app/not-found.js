import Link from 'next/link'
import { getAllBlogPosts } from '../lib/blog'

export const metadata = {
  title: 'Page Not Found (404)'
  , robots: { index: false, follow: false }
}

export default function NotFound() {
  const suggestions = getAllBlogPosts().slice(0, 4);
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="max-w-2xl w-full text-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Page Not Found (404)</h1>
        <p className="mt-3 text-gray-600 dark:text-gray-300">
          We can’t find the page you’re looking for. It may have been moved or removed.
        </p>
        <div className="mt-6 flex items-center justify-center gap-3">
          <Link href="/" className="btn">Go Home</Link>
          <Link href="/blog" className="btn">Browse Blog</Link>
          <Link href="/category/keyword-research" className="btn">Browse Tools</Link>
        </div>
        {suggestions?.length ? (
          <div className="mt-8 text-left">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Popular articles you can read:</h2>
            <ul className="grid sm:grid-cols-1 md:grid-cols-2 gap-3">
              {suggestions.map((p) => (
                <li key={p.slug} className="rounded-md border border-slate-200 dark:border-white/10 p-3 bg-white dark:bg-slate-900/40">
                  <Link href={`/blog/${p.slug}`} className="text-brand-600 font-medium hover:underline">
                    {p.title}
                  </Link>
                  <p className="text-sm text-slate-600 dark:text-slate-300 mt-1 line-clamp-2">{p.description}</p>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </div>
    </div>
  )
}