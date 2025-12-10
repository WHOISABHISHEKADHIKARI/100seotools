import { NextResponse } from 'next/server';

export async function POST(request) {
    try {
        const { title, description, url } = await request.json();

        const safeText = (s) => (s || '').replace(/<[^>]*>/g, '').trim();
        const escapeAttr = (s) => (s || '')
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');

        const cleanTitle = safeText(title);
        const cleanDesc = safeText(description);
        const cleanUrl = safeText(url);

        // Validation Status
        const titleLen = cleanTitle.length;
        const descLen = cleanDesc.length;
        const titleStatus = titleLen === 0 ? 'Missing' : (titleLen >= 50 && titleLen <= 60 ? 'Perfect' : titleLen < 50 ? 'Too Short' : 'Too Long');
        const descStatus = descLen === 0 ? 'Missing' : (descLen >= 120 && descLen <= 160 ? 'Perfect' : descLen < 120 ? 'Too Short' : 'Too Long');

        // Generate Tags
        const tags = [];
        tags.push('<!-- Primary Meta Tags -->');
        tags.push(`<title>${escapeAttr(cleanTitle)}</title>`);
        tags.push(`<meta name="title" content="${escapeAttr(cleanTitle)}" />`);
        tags.push(`<meta name="description" content="${escapeAttr(cleanDesc)}" />`);
        if (cleanUrl) tags.push(`<link rel="canonical" href="${escapeAttr(cleanUrl)}" />`);

        tags.push('');
        tags.push('<!-- Open Graph / Facebook -->');
        tags.push('<meta property="og:type" content="website" />');
        if (cleanUrl) tags.push(`<meta property="og:url" content="${escapeAttr(cleanUrl)}" />`);
        tags.push(`<meta property="og:title" content="${escapeAttr(cleanTitle)}" />`);
        tags.push(`<meta property="og:description" content="${escapeAttr(cleanDesc)}" />`);

        tags.push('');
        tags.push('<!-- Twitter -->');
        tags.push('<meta property="twitter:card" content="summary_large_image" />');
        if (cleanUrl) tags.push(`<meta property="twitter:url" content="${escapeAttr(cleanUrl)}" />`);
        tags.push(`<meta property="twitter:title" content="${escapeAttr(cleanTitle)}" />`);
        tags.push(`<meta property="twitter:description" content="${escapeAttr(cleanDesc)}" />`);

        const output = tags.join('\n');

        return NextResponse.json({
            success: true,
            result: `Analysis:\nTitle: ${titleLen} chars (${titleStatus})\nDescription: ${descLen} chars (${descStatus})\n\nGenerated Code:\n${output}`
        });

    } catch (error) {
        console.error('Meta Tag API Error:', error);
        return NextResponse.json(
            { success: false, error: 'Internal Server Error' },
            { status: 500 }
        );
    }
}
