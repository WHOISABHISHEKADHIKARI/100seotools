import { NextResponse } from 'next/server';

export function middleware(request) {
    const { pathname, search } = request.nextUrl;
    const host = request.headers.get('host') || '';
    const protocol = request.headers.get('x-forwarded-proto') || 'http';

    // Skip middleware for static files and API routes
    if (
        pathname.startsWith('/_next') ||
        pathname.startsWith('/api') ||
        pathname.includes('.')
    ) {
        return NextResponse.next();
    }

    // In production, enforce HTTPS and WWW
    if (process.env.NODE_ENV === 'production') {
        const isHTTP = protocol === 'http';
        const isNonWWW = !host.startsWith('www.');
        const targetHost = 'www.100seotools.com';

        // Redirect HTTP to HTTPS
        if (isHTTP) {
            const url = `https://${targetHost}${pathname}${search}`;
            return NextResponse.redirect(url, { status: 308 });
        }

        // Redirect non-WWW to WWW
        if (isNonWWW && host !== 'localhost:3000') {
            const url = `https://${targetHost}${pathname}${search}`;
            return NextResponse.redirect(url, { status: 308 });
        }
    }

    // Add security headers
    const response = NextResponse.next();

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
         * Match all request paths except:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * - public files (public folder)
         */
        '/((?!_next/static|_next/image|favicon.ico|.*\\..*|api).*)',
    ],
};
