import { NextResponse } from 'next/server';

export async function POST(request) {
    try {
        const { keyword } = await request.json();

        if (!keyword) return NextResponse.json({ success: false, error: 'Keyword required' }, { status: 400 });

        const k = keyword.trim();

        // Generate strategies
        const strategies = [
            {
                title: "Guest Posting",
                desc: `Find blogs in the "${k}" niche that accept guest posts. Pitch topics like "The Future of ${k}" or "10 Tips for ${k}".`,
                query: `"${k}" intitle:"write for us" OR intitle:"guest post"`
            },
            {
                title: "Resource Pages",
                desc: `Find resource pages that list useful links about ${k} and ask to be included.`,
                query: `"${k}" intitle:"resources" OR intitle:"links"`
            },
            {
                title: "Broken Link Building",
                desc: `Find pages about ${k} with broken links and suggest your content as a replacement.`,
                query: `"${k}" intitle:"links" "404 not found"`
            },
            {
                title: "Skyscraper Technique",
                desc: `Find popular content about ${k}, write something better/longer, and reach out to linkers.`,
                query: `"${k}" site:reddit.com OR site:quora.com`
            },
            {
                title: "HARO / Digital PR",
                desc: `Sign up for HARO and watch for queries related to ${k}.`,
                query: `Help A Reporter Out ${k}`
            }
        ];

        let output = `Link Building Strategy for: "${k}"\n\n`;

        strategies.forEach((s, i) => {
            output += `${i + 1}. ${s.title}\n`;
            output += `   Idea: ${s.desc}\n`;
            output += `   Search Query: ${s.query}\n\n`;
        });

        return NextResponse.json({ success: true, result: output });

    } catch (error) {
        return NextResponse.json({ success: false, error: 'Server Error' }, { status: 500 });
    }
}
