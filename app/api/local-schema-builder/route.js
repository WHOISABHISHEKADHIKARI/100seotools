import { NextResponse } from 'next/server';

export async function POST(request) {
    try {
        const { name, address, city, zip } = await request.json();

        if (!name) return NextResponse.json({ success: false, error: 'Business Name required' }, { status: 400 });

        const schema = {
            "@context": "https://schema.org",
            "@type": "LocalBusiness",
            "name": name,
            "address": {
                "@type": "PostalAddress",
                "streetAddress": address || '',
                "addressLocality": city || '',
                "postalCode": zip || '',
                "addressCountry": "US"
            },
            "url": "https://www.example.com",
            "telephone": "+1-555-555-5555"
        };

        const code = JSON.stringify(schema, null, 2);

        let output = `Generated LocalBusiness Schema (JSON-LD)\n`;
        output += `======================================\n\n`;

        output += `Add this code inside the <head> or <body> of your contact or home page:\n\n`;
        output += `\`\`\`html\n<script type="application/ld+json">\n${code}\n</script>\n\`\`\`\n\n`;

        output += `### Validation\n`;
        output += `Test this code using Google's Rich Results Test tool to ensure it's valid.`;

        return NextResponse.json({ success: true, result: output });

    } catch (error) {
        return NextResponse.json({ success: false, error: 'Server Error' }, { status: 500 });
    }
}
