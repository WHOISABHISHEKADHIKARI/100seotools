import { NextResponse } from 'next/server';

export async function POST(request) {
    try {
        const inputs = await request.json();

        // Logic ported and simplified from lib/templates.js
        const base = 'https://schema.org';
        const allowed = new Set(['Article', 'FAQPage', 'HowTo', 'LocalBusiness', 'SoftwareApplication']);

        // Clean inputs
        const strip = (s) => (s || '').replace(/<[^>]*>/g, '').trim();

        const typeRaw = strip(inputs.type);
        const typeCap = typeRaw.replace(/\s+/g, ''); // Naive handling
        const type = allowed.has(typeCap) ? typeCap : allowed.has(inputs.type) ? inputs.type : null;

        // If type not recognized or generic, try to support basics
        // For now, if no valid type, error.
        if (!type) {
            // Maybe user didn't select, default to Article??
            // Actually let's return error to guide user
            return NextResponse.json({ success: false, error: 'Invalid Schema Type. Please choose specific type.' }, { status: 400 });
        }

        const name = strip(inputs.name);
        const url = strip(inputs.url || inputs.pageUrl);
        const desc = strip(inputs.desc);
        const image = strip(inputs.image);

        // FAQ logic
        const faqText = strip(inputs.faqLines);
        const faqLines = faqText ? faqText.split(/\r?\n/).filter(l => l.trim()) : [];
        const faqEntities = faqLines.map((l) => {
            const parts = l.split('|');
            return {
                '@type': 'Question',
                name: parts[0]?.replace(/^Q:\s*/i, '').trim(),
                acceptedAnswer: {
                    '@type': 'Answer',
                    text: parts[1]?.replace(/^A:\s*/i, '').trim()
                }
            };
        });

        let node = {};

        switch (type) {
            case 'Article':
                node = {
                    '@context': base,
                    '@type': 'Article',
                    headline: name,
                    description: desc,
                    url: url,
                    image: image || undefined,
                    author: { '@type': 'Organization', name: inputs.authorName || 'Organization' },
                    datePublished: inputs.datePublished || undefined
                };
                break;
            case 'FAQPage':
                node = {
                    '@context': base,
                    '@type': 'FAQPage',
                    mainEntity: faqEntities
                };
                break;
            case 'HowTo':
                node = {
                    '@context': base,
                    '@type': 'HowTo',
                    name: name,
                    description: desc,
                    step: faqLines.map((l, i) => ({
                        '@type': 'HowToStep',
                        name: `Step ${i + 1}`,
                        text: l
                    }))
                };
                break;
            case 'LocalBusiness':
                node = {
                    '@context': base,
                    '@type': 'LocalBusiness',
                    name: name,
                    description: desc,
                    url: url
                };
                break;
            case 'SoftwareApplication':
                node = {
                    '@context': base,
                    '@type': 'SoftwareApplication',
                    name: name,
                    description: desc,
                    applicationCategory: 'SEO Tool',
                    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' }
                };
                break;
        }

        const script = `<script type="application/ld+json">\n${JSON.stringify(node, null, 2)}\n</script>`;

        return NextResponse.json({
            success: true,
            result: script
        });

    } catch (error) {
        return NextResponse.json({ success: false, error: 'Server Error' }, { status: 500 });
    }
}
