import { NextResponse } from 'next/server';

export async function POST(request) {
    try {
        const { xml } = await request.json();

        if (!xml) return NextResponse.json({ success: false, error: 'XML content required' }, { status: 400 });

        const cleanXml = xml.replace(/\s+/g, ' ');

        // Extract URLs
        const urlMatches = cleanXml.match(/<url>(.*?)<\/url>/g) || [];

        if (urlMatches.length === 0) {
            return NextResponse.json({ success: true, result: 'No <url> tags found. Is this a valid sitemap?' });
        }

        let output = `Found ${urlMatches.length} URLs in Sitemap:\n\n`;

        urlMatches.forEach((u, i) => {
            const loc = (u.match(/<loc>(.*?)<\/loc>/) || [])[1] || 'Unknown';
            const lastmod = (u.match(/<lastmod>(.*?)<\/lastmod>/) || [])[1];
            const priority = (u.match(/<priority>(.*?)<\/priority>/) || [])[1];

            output += `${i + 1}. ${loc}`;
            if (lastmod) output += ` (Last Mod: ${lastmod})`;
            if (priority) output += ` [Priority: ${priority}]`;
            output += '\n';
        });

        return NextResponse.json({
            success: true,
            result: output
        });

    } catch (error) {
        return NextResponse.json({ success: false, error: 'Server Error' }, { status: 500 });
    }
}
