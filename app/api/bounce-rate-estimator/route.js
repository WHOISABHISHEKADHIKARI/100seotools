import { NextResponse } from 'next/server';

export async function POST(request) {
    try {
        const { industry, load_time } = await request.json();

        const ind = industry ? industry.toLowerCase() : 'general';
        const load = parseFloat(load_time) || 2.0;

        // Base rates by industry (heuristic)
        let baseRate = 50;
        if (ind.includes('blog') || ind.includes('news')) baseRate = 75;
        else if (ind.includes('commerce') || ind.includes('shop')) baseRate = 40;
        else if (ind.includes('b2b') || ind.includes('service')) baseRate = 55;
        else if (ind.includes('landing')) baseRate = 80;

        // Load time penalty: +5% for every second over 2s
        const penalty = Math.max(0, (load - 2) * 5);

        let estimatedRate = Math.min(99, Math.round(baseRate + penalty));

        let status = 'Good';
        if (estimatedRate > 70) status = 'Poor';
        else if (estimatedRate > 50) status = 'Average';
        else status = 'Excellent';

        let output = `Bounce Rate Estimation Report\n`;
        output += `=============================\n\n`;

        output += `Input Details:\n`;
        output += `- Industry: ${industry || 'General'}\n`;
        output += `- Load Time: ${load}s\n\n`;

        output += `### Estimated Bounce Rate: ${estimatedRate}%\n`;
        output += `Status: **${status}**\n\n`;

        output += `### Analysis & Factors\n`;
        output += `- **Industry Benchmark**: ~${baseRate}%\n`;
        if (penalty > 0) {
            output += `- **Load Time Impact**: +${penalty.toFixed(1)}% (Your site is slower than optimal 2s)\n`;
        } else {
            output += `- **Load Time Impact**: 0% (Fast load speed!)\n`;
        }

        output += `\n### Recommendations to Reduce Bounce Rate\n`;
        if (estimatedRate > 60) {
            output += `1. **Improve Speed**: Optimize images and minify JS to reach <2s load time.\n`;
            output += `2. **Above the Fold**: Ensure your main value proposition is visible without scrolling.\n`;
            output += `3. **Match Intent**: Ensure your title tag matches the page content perfectly.\n`;
        } else {
            output += `1. **Maintain Quality**: Keep content fresh and relevant.\n`;
            output += `2. **Internal Linking**: Add more relevant usage links to keep users on site.\n`;
        }

        return NextResponse.json({ success: true, result: output });

    } catch (error) {
        return NextResponse.json({ success: false, error: 'Server Error' }, { status: 500 });
    }
}
