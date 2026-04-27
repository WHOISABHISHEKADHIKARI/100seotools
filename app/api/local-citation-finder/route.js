import { NextResponse } from 'next/server';

export async function POST(request) {
    try {
        const { category, city } = await request.json();

        if (!category || !city) return NextResponse.json({ success: false, error: 'Inputs required' }, { status: 400 });

        const cat = category.trim();
        const cit = city.trim();

        // General Top Citations (Simulated)
        const generalCitations = ['Google Business Profile', 'Facebook', 'Yelp', 'Bing Places', 'Apple Maps'];

        // Niche Citations simulation
        let nicheCitations = [];
        const cLower = cat.toLowerCase();
        if (cLower.includes('restaurant') || cLower.includes('food')) {
            nicheCitations = ['TripAdvisor', 'Zomato', 'OpenTable', 'Foursquare'];
        } else if (cLower.includes('doctor') || cLower.includes('health') || cLower.includes('clinic')) {
            nicheCitations = ['Healthgrades', 'ZocDoc', 'WebMD', 'Vitals'];
        } else if (cLower.includes('law') || cLower.includes('attorney')) {
            nicheCitations = ['Avvo', 'FindLaw', 'Justia', 'Lawyers.com'];
        } else if (cLower.includes('plumb') || cLower.includes('contractor') || cLower.includes('home')) {
            nicheCitations = ['HomeAdvisor', 'Angi', 'Houzz', 'Thumbtack'];
        } else {
            nicheCitations = ['YellowPages', 'BBB', 'Manta', 'Superpages'];
        }

        let output = `Local Citation Opportunities: ${cat} in ${cit}\n`;
        output += `==============================================\n\n`;

        output += `### Essential (Must Have)\n`;
        generalCitations.forEach(site => output += `- [ ] **${site}**: High authority, essential for map pack.\n`);

        output += `\n### Niche Specific (Highly Recommended)\n`;
        nicheCitations.forEach(site => output += `- [ ] **${site}**: Relevant to ${cat}.\n`);

        output += `\n### Local / City Specific\n`;
        output += `- [ ] **${cit} Chamber of Commerce**: Search for local chamber listing.\n`;
        output += `- [ ] **${cit} Local Business Directory**: Look for city-specific directories.\n`;
        output += `- [ ] **Local News/Papers in ${cit}**: Check if they have a business directory.\n\n`;

        output += `### Tips\n`;
        output += `1. **Consistency**: Ensure Name, Address, Phone (NAP) is identical on all.\n`;
        output += `2. **Descriptions**: Write unique descriptions where possible.\n`;
        output += `3. **Photos**: Maximize photo uploads on visual platforms like Yelp/TripAdvisor.`;

        return NextResponse.json({ success: true, result: output });

    } catch (error) {
        return NextResponse.json({ success: false, error: 'Server Error' }, { status: 500 });
    }
}
