import { NextResponse } from 'next/server';

export async function POST(request) {
    try {
        const { type, name, url } = await request.json();

        if (!type) return NextResponse.json({ success: false, error: 'Schema Type required' }, { status: 400 });

        const t = type.trim();
        const n = name ? name.trim() : 'Example Name';
        const u = url ? url.trim() : 'https://example.com';

        // Construct smart schema based on type input (case insensitive heuristic)
        const typeLower = t.toLowerCase();
        let schema = {};

        if (typeLower.includes('article') || typeLower.includes('blog')) {
            schema = {
                "@context": "https://schema.org",
                "@type": "Article",
                "headline": n,
                "mainEntityOfPage": { "@type": "WebPage", "@id": u },
                "author": { "@type": "Person", "name": "Author Name" },
                "publisher": { "@type": "Organization", "name": "Publisher Name" },
                "datePublished": "2025-01-01"
            };
        } else if (typeLower.includes('product')) {
            schema = {
                "@context": "https://schema.org",
                "@type": "Product",
                "name": n,
                "description": "Product description goes here.",
                "brand": { "@type": "Brand", "name": "Brand Name" },
                "offers": { "@type": "Offer", "url": u, "priceCurrency": "USD", "price": "99.99" }
            };
        } else if (typeLower.includes('local') || typeLower.includes('business')) {
            schema = {
                "@context": "https://schema.org",
                "@type": "LocalBusiness",
                "name": n,
                "url": u,
                "address": { "@type": "PostalAddress", "streetAddress": "123 Main St", "addressLocality": "City", "addressRegion": "State" }
            };
        } else {
            // Generic Fallback
            schema = {
                "@context": "https://schema.org",
                "@type": t.charAt(0).toUpperCase() + t.slice(1), // Capitalize
                "name": n,
                "url": u
            };
        }

        const output = JSON.stringify(schema, null, 2);
        const result = `<script type="application/ld+json">\n${output}\n</script>`;

        return NextResponse.json({ success: true, result: result });

    } catch (error) {
        return NextResponse.json({ success: false, error: 'Server Error' }, { status: 500 });
    }
}
