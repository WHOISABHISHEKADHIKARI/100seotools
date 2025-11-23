import { NextResponse } from 'next/server';
import { getBaseUrl } from './lib/site';

export function middleware(request) {
    const { pathname } = request.nextUrl;
    const response = NextResponse.next();

    // Canonicalize non-www to www in production
    const host = request.headers.get('host') || '';
    const isLocal = /localhost|127\.0\.0\.1/.test(host);
    if (!isLocal) {
        const url = new URL(request.url);
        const isHttp = url.protocol === 'http:';
        const isBare = host === '100seotools.com';
        const isOurDomain = /(^|\.)100seotools\.com$/i.test(host);
        if (isBare || isHttp && isOurDomain) {
            url.host = 'www.100seotools.com';
            url.protocol = 'https:';
            return NextResponse.redirect(url, 308);
        }
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

    // Block pagination pages from indexing (critical SEO fix)
    // Pagination pages like /blog/p/11 were ranking at position 1.5, competing with main content
    if (pathname.match(/\/(p|tp)\/\d+$/)) {
        response.headers.set('X-Robots-Tag', 'noindex, follow');
    }

    // Legacy blog pagination redirect: /blog/<slug>/p/<n> -> /blog/<slug>?page=<n>
    const blogPaginateMatch = pathname.match(/^\/blog\/(.+?)\/p\/(\d+)$/);
    if (blogPaginateMatch) {
        const slug = blogPaginateMatch[1];
        const url = new URL(request.url);
        url.pathname = `/blog/${slug}`;
        url.search = '';
        return NextResponse.redirect(url, 308);
    }

    // Normalize blog query pagination: /blog/<slug>?page=<n> -> /blog/<slug>
    // This removes duplicate variants and lets the canonical path serve content.
    const blogWithQueryMatch = pathname.match(/^\/blog\/([^\/]+)$/);
    if (blogWithQueryMatch) {
        const url = new URL(request.url);
        if (url.searchParams.has('page')) {
            url.search = '';
            return NextResponse.redirect(url, 308);
        }
    }

    // Add security headers
    // Force HTTPS for 1 year (HSTS)
    response.headers.set(
        'Strict-Transport-Security',
        'max-age=31536000; includeSubDomains; preload'
    );

    // Prevent clickjacking
    response.headers.set('X-Frame-Options', 'DENY');

    // Prevent MIME sniffing
    response.headers.set('X-Content-Type-Options', 'nosniff');

    // Referrer policy
    response.headers.set('Referrer-Policy', 'origin-when-cross-origin');

    // XSS protection
    response.headers.set('X-XSS-Protection', '1; mode=block');

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
