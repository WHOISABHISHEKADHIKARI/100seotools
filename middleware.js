import { NextResponse } from 'next/server';
import { getBaseUrl } from './lib/site';

export function middleware(request) {
  const { pathname } = request.nextUrl;
  const response = NextResponse.next();
  
  // Special handling for alternative pages to prevent indexing
  if (pathname.startsWith('/alternative')) {
    // Set X-Robots-Tag header for alternative pages
    response.headers.set('X-Robots-Tag', 'noindex, follow');
    
    // Set canonical link header pointing to primary version
    const primaryUrl = `${getBaseUrl()}/tools/keyword-density-checker`;
    response.headers.set('Link', `<${primaryUrl}>; rel="canonical"`);
    
    // Add cache control to prevent caching of alternative versions
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