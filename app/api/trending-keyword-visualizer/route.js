import { NextResponse } from 'next/server';

export async function POST(request) {
    try {
        const { seed } = await request.json();

        if (!seed) return NextResponse.json({ success: false, error: 'Topic required' }, { status: 400 });

        const encoded = encodeURIComponent(seed);
        const url = `https://trends.google.com/trends/explore?q=${encoded}`;

        // Improve with some "Related Topics" suggestions (simulated or fetched via autocomplete)
        // Fetch suggestions like the Suggestion Tool
        const fetchSugg = async (q) => {
            try {
                const res = await fetch(`https://suggestqueries.google.com/complete/search?client=chrome&q=${encodeURIComponent(q)}`);
                if (res.ok) {
                    const data = await res.json();
                    return data[1] || [];
                }
            } catch { }
            return [];
        };
        const related = await fetchSugg(seed);

        let output = `Trending Analysis for "${seed}":\n\n`;

        output += `📉 View Real-Time Official Data:\n`;
        output += `[Click to open Google Trends](${url})\n\n`; // Markdown link? ToolRunner displays text.
        // ToolRunner renders inside <pre>. Markdown links won't work.
        // I'll provide plain URL.
        output += `${url}\n\n`;

        output += `🔥 Related Popular Searches:\n`;
        output += related.length > 0 ? related.slice(0, 10).map(x => `- ${x}`).join('\n') : '(No related data found)';

        return NextResponse.json({ success: true, result: output });

    } catch (error) {
        return NextResponse.json({ success: false, error: 'Server Error' }, { status: 500 });
    }
}
