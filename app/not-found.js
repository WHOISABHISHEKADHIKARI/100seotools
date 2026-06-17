import Link from 'next/link';
import { Search, Home, BookOpen, LayoutGrid, ArrowRight } from 'lucide-react';
import { getAllBlogPostsPublished } from '../lib/blog-data';

export const metadata = {
  title: 'Page Not Found | 100 SEO Tools',
  robots: { index: false, follow: true }
};

export default async function NotFound() {
  let suggestions = [];
  try {
    suggestions = (await getAllBlogPostsPublished()).slice(0, 4);
  } catch (e) {
    console.error('404 suggestions failed:', e);
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-6">
      <div className="max-w-3xl w-full text-center">
        <div className="relative inline-block mb-8">
          <div className="absolute inset-0 bg-violet-500/20 blur-3xl rounded-full" />
          <h1 className="relative text-[120px] font-black text-slate-200 dark:text-white/5 leading-none">404</h1>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full">
            <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white">Page not found</h2>
          </div>
        </div>

        <p className="text-lg text-slate-500 dark:text-slate-400 mb-10 max-w-lg mx-auto leading-relaxed font-medium">
          The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4 mb-16">
          <Link href="/" className="inline-flex items-center gap-2 px-8 py-4 bg-violet-600 text-white font-extrabold rounded-2xl hover:bg-violet-700 transition-all shadow-xl shadow-violet-200 dark:shadow-none">
            <Home className="w-5 h-5" />
            Go to Homepage
          </Link>
          <Link href="/tools" className="inline-flex items-center gap-2 px-8 py-4 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-200 font-extrabold rounded-2xl hover:bg-slate-50 dark:hover:bg-white/10 transition-all shadow-sm">
            <LayoutGrid className="w-5 h-5" />
            Browse 100+ Tools
          </Link>
        </div>

        {suggestions?.length > 0 && (
          <div className="text-left bg-slate-50 dark:bg-white/5 rounded-3xl p-8 md:p-10 border border-slate-100 dark:border-white/10">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-violet-600" />
                Popular Guides
              </h3>
              <Link href="/blog" className="text-sm font-bold text-violet-600 hover:underline inline-flex items-center gap-1">
                View blog <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              {suggestions.map((p) => (
                <Link
                  key={p.slug}
                  href={`/blog/${p.slug}`}
                  className="group block p-5 bg-white dark:bg-gray-900 rounded-2xl border border-slate-100 dark:border-white/10 hover:border-violet-300 transition-all shadow-sm hover:shadow-md"
                >
                  <h4 className="font-extrabold text-slate-900 dark:text-white group-hover:text-violet-600 transition-colors line-clamp-1 mb-2">
                    {p.title}
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                    {p.description}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
