'use client';

import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

export default function GlobalError({ error, reset }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head><title>Critical Error | 100 SEO Tools</title><meta name="robots" content="noindex, nofollow" /></head>
      <body className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center p-4 antialiased">
        <div className="max-w-md w-full bg-white dark:bg-slate-800 rounded-3xl shadow-2xl shadow-slate-200 dark:shadow-slate-900 border border-slate-100 dark:border-slate-700 p-8 text-center">
          <div className="w-20 h-20 bg-red-50 dark:bg-red-900/30 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <AlertTriangle className="w-10 h-10 text-red-600 dark:text-red-500" />
          </div>

          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white mb-2">Critical Application Error</h1>
          <p className="text-slate-500 dark:text-slate-400 mb-8 leading-relaxed">
            A serious error occurred that prevented the application from loading. We&#39;ve been notified and are looking into it.
          </p>

          <div className="space-y-3">
            <button
              onClick={() => reset()}
              className="w-full flex items-center justify-center gap-2 px-6 py-3.5 bg-violet-600 text-white font-extrabold rounded-xl hover:bg-violet-700 transition-all shadow-lg shadow-violet-200 dark:shadow-none"
            >
              <RefreshCw className="w-4 h-4" />
              Try Restarting App
            </button>

            <a
              href="/"
              className="w-full flex items-center justify-center gap-2 px-6 py-3.5 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold rounded-xl hover:bg-slate-200 dark:hover:bg-slate-600 transition-all"
            >
              <Home className="w-4 h-4" />
              Return to Homepage
            </a>
          </div>

          {process.env.NODE_ENV === 'development' && (
            <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-700 text-left">
              <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mb-2">Error Debug Info</p>
              <pre className="text-xs text-red-500 dark:text-red-400 bg-red-50/50 dark:bg-red-900/20 p-4 rounded-lg overflow-auto max-h-40 font-mono">
                {error?.message || 'Unknown Error'}
                {'\n\n'}
                {error?.stack}
              </pre>
            </div>
          )}
        </div>
      </body>
    </html>
  );
}
