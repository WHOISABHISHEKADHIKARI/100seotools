import { NextResponse } from 'next/server';

export async function POST(request) {
    try {
        const { url } = await request.json();

        if (!url) return NextResponse.json({ success: false, error: 'URL required' }, { status: 400 });

        let targetUrl = url;
        if (!targetUrl.startsWith('http')) targetUrl = 'https://' + targetUrl;

        // 1. Fetch
        const controller = new AbortController();
        setTimeout(() => controller.abort(), 8000); // 8s timeout

        const res = await fetch(targetUrl, { signal: controller.signal, headers: { 'User-Agent': '100SEOTools-Bot' } });
        if (!res.ok) throw new Error('Failed to fetch page');

        const html = await res.text();
        const domain = new URL(targetUrl).hostname;
        const origin = new URL(targetUrl).origin;

        // 2. Extract Links
        const linkRegex = /href=["'](.*?)["']/gi;
        const links = new Set();
        links.add(targetUrl); // Add homepage

        let match;
        while ((match = linkRegex.exec(html)) !== null) {
            let href = match[1];
            if (href.startsWith('/')) href = origin + href;
            if (!href.startsWith('http')) continue;

            // Only internal
            if (href.includes(domain)) {
                links.add(href);
            }
        }

        // Limit
        const validLinks = Array.from(links).slice(0, 50);

        // 3. Build XML
        let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
        xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

        const date = new Date().toISOString().split('T')[0];

        validLinks.forEach(link => {
            xml += `  <url>\n`;
            xml += `    <loc>${link}</loc>\n`;
            xml += `    <lastmod>${date}</lastmod>\n`;
            xml += `    <changefreq>weekly</changefreq>\n`;
            xml += `    <priority>${link === targetUrl ? '1.0' : '0.8'}</priority>\n`;
            xml += `  </url>\n`;
        });

        xml += `</urlset>`;

        return NextResponse.json({
            success: true,
            result: xml
        });

    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
