import { NextResponse } from 'next/server';

export async function POST(request) {
    try {
        const { url } = await request.json();

        if (!url) return NextResponse.json({ success: false, error: 'URL required' }, { status: 400 });

        let targetUrl = url;
        if (!targetUrl.startsWith('http')) targetUrl = 'https://' + targetUrl;
        let parsedUrl;
        try {
            parsedUrl = new URL(targetUrl);
        } catch (error) {
            return NextResponse.json({ success: false, error: 'Valid URL required' }, { status: 400 });
        }

        // 1. Fetch
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 8000); // 8s timeout

        let res;
        try {
            res = await fetch(parsedUrl.toString(), { signal: controller.signal, headers: { 'User-Agent': '100SEOTools-Bot' } });
        } catch (error) {
            const message = error.name === 'AbortError' ? 'Timed out while fetching URL' : 'Unable to fetch URL';
            return NextResponse.json({ success: false, error: message }, { status: 422 });
        } finally {
            clearTimeout(timeoutId);
        }
        if (!res.ok) {
            return NextResponse.json({ success: false, error: `URL returned HTTP ${res.status}` }, { status: 422 });
        }

        const html = await res.text();
        const domain = parsedUrl.hostname;
        const origin = parsedUrl.origin;

        // 2. Extract Links
        const linkRegex = /href=["'](.*?)["']/gi;
        const links = new Set();
        links.add(parsedUrl.toString()); // Add homepage

        let match;
        while ((match = linkRegex.exec(html)) !== null) {
            let href = match[1];
            if (href.startsWith('/')) href = origin + href;
            if (!href.startsWith('http')) continue;

            // Only internal
            try {
                const hrefUrl = new URL(href);
                if (hrefUrl.hostname === domain) {
                    links.add(hrefUrl.toString());
                }
            } catch (error) {
                continue;
            }
        }

        // Limit
        const validLinks = Array.from(links).slice(0, 50);

        // 3. Build XML
        let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
        xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

        const date = new Date().toISOString().split('T')[0];

        const escapeXml = (value) => value
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&apos;');

        validLinks.forEach(link => {
            xml += `  <url>\n`;
            xml += `    <loc>${escapeXml(link)}</loc>\n`;
            xml += `    <lastmod>${date}</lastmod>\n`;
            xml += `    <changefreq>weekly</changefreq>\n`;
            xml += `    <priority>${link === parsedUrl.toString() ? '1.0' : '0.8'}</priority>\n`;
            xml += `  </url>\n`;
        });

        xml += `</urlset>`;

        return NextResponse.json({
            success: true,
            result: xml
        });

    } catch (error) {
        return NextResponse.json({ success: false, error: 'Unable to generate sitemap' }, { status: 400 });
    }
}
