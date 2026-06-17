'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

export default function Error({ error, reset }) {
  useEffect(() => {
    const prev = document.title;
    document.title = 'Error | 100 SEO Tools';
    console.error('Segment Error:', error);
    return () => { document.title = prev; };
  }, [error]);

  return (
    <div className="min-h-[70vh] flex items-center justify-center p-6">
      <div className="max-w-lg w-full bg-white dark:bg-gray-900 rounded-3xl shadow-xl border border-slate-100 dark:border-white/10 p-10 text-center">
        <div className="w-16 h-16 bg-red-50 dark:bg-red-900/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <AlertTriangle className="w-8 h-8 text-red-600 dark:text-red-500" />
        </div>

        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white mb-3">Something went wrong</h1>
        <p className="text-slate-500 dark:text-slate-400 mb-8 leading-relaxed">
          An error occurred while loading this part of the application. The rest of the site is still operational.
        </p>

        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={() => reset()}
            className="flex-1 flex items-center justify-center gap-2 px-6 py-3.5 bg-violet-600 text-white font-extrabold rounded-xl hover:bg-violet-700 transition-all shadow-lg shadow-violet-200 dark:shadow-none"
          >
            <RefreshCw className="w-4 h-4" />
            Try Again
          </button>

          <Link
            href="/"
            className="flex-1 flex items-center justify-center gap-2 px-6 py-3.5 bg-slate-100 dark:bg-white/5 text-slate-700 dark:text-slate-200 font-bold rounded-xl hover:bg-slate-200 dark:hover:bg-white/10 transition-all"
          >
            <Home className="w-4 h-4" />
            Go Home
          </Link>
        </div>

        {process.env.NODE_ENV === 'development' && (
          <div className="mt-10 pt-6 border-t border-slate-50 dark:border-white/5 text-left">
            <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mb-3 px-1">Developer Details</p>
            <div className="bg-red-50/50 dark:bg-red-900/10 p-4 rounded-xl overflow-hidden">
              <pre className="text-xs text-red-600 dark:text-red-400 overflow-auto max-h-48 font-mono">
                {error?.message || 'Unknown Segment Error'}
                {'\n\n'}
                {error?.stack}
              </pre>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
