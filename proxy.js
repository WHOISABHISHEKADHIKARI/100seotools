import { NextResponse } from 'next/server';
import { getBaseUrl } from './lib/site';

// Next.js has renamed the middleware file/function to "proxy".
// This function implements the same behavior under the new convention.
export function proxy(request) {
  const { pathname } = request.nextUrl;
  const response = NextResponse.next();

  // Canonicalize non-www to www in production
  const host = request.headers.get('host') || '';
  const isLocal = /localhost|127\.0\.0\.1/.test(host);
  if (!isLocal && host === '100seotools.com') {
    const url = new URL(request.url);
    url.host = 'www.100seotools.com';
    url.protocol = 'https:';
    return NextResponse.redirect(url, 308);
  }

  // Special handling for alternative pages to prevent indexing
  if (pathname.startsWith('/alternative')) {
    response.headers.set('X-Robots-Tag', 'noindex, follow');
    const primaryUrl = `${getBaseUrl()}/tools/keyword-density-checker`;
    response.headers.set('Link', `<${primaryUrl}>; rel="canonical"`);
    response.headers.set('Cache-Control', 'no-cache, no-store, must-revalidate');
    response.headers.set('Pragma', 'no-cache');
    response.headers.set('Expires', '0');
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!api|_next/static|_next/image|favicon.ico|public).*)',
  ],
};
