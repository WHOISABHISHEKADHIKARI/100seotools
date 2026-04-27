import { NextResponse } from 'next/server';

export async function POST(request) {
    try {
        const { competitor_url } = await request.json();

        if (!competitor_url) return NextResponse.json({ success: false, error: 'Competitor URL required' }, { status: 400 });

        let url = competitor_url.trim();
        if (!url.startsWith('http')) url = 'https://' + url;

        // Basic URL validation
        try {
            const u = new URL(url);
            if (!u.hostname.includes('.')) throw new Error('Invalid Domain');
        } catch (e) {
            return NextResponse.json({ success: false, error: 'Invalid URL' }, { status: 400 });
        }

        const domain = url.replace(/(^\w+:|^)\/\//, '').split('/')[0];

        // Simulate ideas based on hypothetical niche detection
        // Real tools use massive databases. We will simulate logic.

        let niche = 'General';
        if (domain.includes('tech') || domain.includes('soft')) niche = 'Technology';
        else if (domain.includes('food') || domain.includes('recipe')) niche = 'Food & Beverage';
        else if (domain.includes('seo') || domain.includes('market')) niche = 'Marketing';

        let output = `Backlink Ideas based on Competitor: ${domain}\n`;
        output += `Detected Niche: ${niche}\n\n`;

        output += `### 1. High-Value Resource Pages (Simulated)\n`;
        output += `Competitors in ${niche} often get links from these types of pages:\n`;
        output += `- "Top 50 ${niche} Resources"\n`;
        output += `- "Best Tools for [Industry]"\n`;
        output += `- University/Educational Resource Lists\n\n`;

        output += `### 2. Guest Post Opportunities\n`;
        output += `Likely sites that accept guest posts in this space:\n`;
        output += `- ${niche}Weekly.com\n`;
        output += `- Daily${niche}Insights.com\n`;
        output += `- The${niche}Hub.org\n\n`;

        output += `### 3. Strategy Recommendations\n`;
        output += `- **Broken Link Building**: Check ${domain}'s broken pages (404s) and offer your content as a replacement.\n`;
        output += `- **Skyscraper Technique**: Find their most linked-to guide and write something 10x better.\n`;
        output += `- **Podcast Features**: Their founders often appear on podcasts. Pitch yourself to the same shows.`;

        return NextResponse.json({ success: true, result: output });

    } catch (error) {
        return NextResponse.json({ success: false, error: 'Server Error' }, { status: 500 });
    }
}
