import { NextResponse } from 'next/server';

export async function POST(request) {
    try {
        const { url, languages } = await request.json();

        if (!url || !languages) return NextResponse.json({ success: false, error: 'Inputs required' }, { status: 400 });

        const defaultUrl = url.trim();
        const lines = languages.split('\n');

        let tags = [];

        // Add x-default if desired, using input URL as default fallback often
        tags.push(`<link rel="alternate" hreflang="x-default" href="${defaultUrl}" />`);

        let log = '';

        lines.forEach(line => {
            if (!line.includes('|')) return;
            const parts = line.split('|');
            const lang = parts[0].trim();
            const href = parts[1].trim();

            if (lang && href) {
                // Basic validation
                if (/^[a-z]{2}(-[a-z]{2})?$/i.test(lang)) {
                    tags.push(`<link rel="alternate" hreflang="${lang}" href="${href}" />`);
                } else {
                    log += `⚠️ Skipped invalid lang code: ${lang}\n`;
                }
            }
        });

        const codeBlock = tags.join('\n');

        let output = `Generated Hreflang Tags\n`;
        output += `======================\n\n`;

        output += `Copy and paste this into the <head> section of **ALL** page versions:\n\n`;
        output += `\`\`\`html\n${codeBlock}\n\`\`\`\n\n`;

        if (log) {
            output += `### Notes\n${log}`;
        }

        output += `### Setup Tips\n`;
        output += `1. **Self-Referencing**: Ensure each page includes a tag pointing to itself.\n`;
        output += `2. **Bidirectional**: If Page A links to Page B, Page B must link back to Page A.\n`;
        output += `3. **Absolute URLs**: Always use full https:// URLs.`;

        return NextResponse.json({ success: true, result: output });

    } catch (error) {
        return NextResponse.json({ success: false, error: 'Server Error' }, { status: 500 });
    }
}
