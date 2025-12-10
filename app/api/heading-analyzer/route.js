import { NextResponse } from 'next/server';

export async function POST(request) {
    try {
        const { html } = await request.json();

        if (!html) {
            return NextResponse.json({ success: false, error: 'HTML content is required' }, { status: 400 });
        }

        const headingRegex = /<(h[1-6])[^>]*>(.*?)<\/\1>/gi;
        const matches = [];
        let match;

        while ((match = headingRegex.exec(html)) !== null) {
            matches.push({
                tag: match[1].toUpperCase(),
                text: match[2].replace(/<[^>]+>/g, '').trim() // Strip inner HTML
            });
        }

        if (matches.length === 0) {
            return NextResponse.json({ success: true, result: 'No headings found (h1-h6).' });
        }

        let output = `Found ${matches.length} headings:\n\n`;

        // Check hierarchy (simple check: H1 should be first, levels shouldn't skip, etc.)
        const h1Count = matches.filter(m => m.tag === 'H1').length;
        if (h1Count === 0) output += '⚠️ Warning: No H1 tag found.\n';
        if (h1Count > 1) output += '⚠️ Warning: Multiple H1 tags found (usually only one is recommended).\n';

        output += '\nStructure:\n';
        matches.forEach(m => {
            const indent = '  '.repeat(parseInt(m.tag[1]) - 1);
            output += `${indent}${m.tag}: ${m.text}\n`;
        });

        return NextResponse.json({
            success: true,
            result: output
        });

    } catch (error) {
        return NextResponse.json({ success: false, error: 'Server Error' }, { status: 500 });
    }
}
