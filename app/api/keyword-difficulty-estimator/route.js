import { NextResponse } from 'next/server';

export async function POST(request) {
    try {
        const { seed } = await request.json();

        if (!seed) return NextResponse.json({ success: false, error: 'Keyword required' }, { status: 400 });

        const k = seed.toLowerCase().trim();
        const words = k.split(/\s+/).length;
        const chars = k.length;

        let score = 50; // Base

        // Length Factor (Shorter = Harder)
        if (words === 1) score += 30;
        else if (words === 2) score += 15;
        else if (words === 3) score += 5;
        else if (words >= 4) score -= 15;
        else if (words >= 6) score -= 30;

        // Intent Factor
        const commercial = ['buy', 'price', 'cheap', 'best', 'review', 'services', 'agency', 'hire'];
        const informational = ['how', 'what', 'why', 'guide', 'tutorial', 'tips', 'pdf', 'free'];

        if (commercial.some(w => k.includes(w))) score += 15;
        if (informational.some(w => k.includes(w))) score -= 10;

        // Cap
        score = Math.max(1, Math.min(100, score));

        let label = '';
        if (score > 80) label = 'Very Hard';
        else if (score > 60) label = 'Hard';
        else if (score > 40) label = 'Medium';
        else if (score > 20) label = 'Easy';
        else label = 'Very Easy';

        const output = `Keyword: "${seed}"\n` +
            `Estimated Difficulty: ${score}/100 (${label})\n\n` +
            `Analysis:\n` +
            `- Word Count: ${words} (${words < 3 ? 'Short Tail - High Competition' : 'Long Tail - Lower Competition'})\n` +
            `- Intent: ${commercial.some(w => k.includes(w)) ? 'Commercial (Advertiser Competition)' : 'Informational'}\n\n` +
            `Recommendation: ${score > 60 ? 'Content Optimization + Backlinks needed.' : 'Good opportunity for content targeting.'}`;

        return NextResponse.json({ success: true, result: output });

    } catch (error) {
        return NextResponse.json({ success: false, error: 'Server Error' }, { status: 500 });
    }
}
