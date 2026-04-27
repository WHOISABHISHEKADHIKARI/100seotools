import { NextResponse } from 'next/server';

export async function POST(request) {
    try {
        const { keyword } = await request.json();

        if (!keyword) return NextResponse.json({ success: false, error: 'Keyword required' }, { status: 400 });

        const k = keyword.toLowerCase();

        let intent = 'Informational'; // Default
        let reason = 'General topic';

        // Heuristics
        if (/\b(buy|price|cheap|deal|sale|discount|coupon|shipping)\b/.test(k)) {
            intent = 'Transactional';
            reason = 'Purchase-related terms detected (buy, price, etc).';
        } else if (/\b(best|vs|review|comparison|top|list of)\b/.test(k)) {
            intent = 'Commercial Investigation';
            reason = 'Comparison terms detected (best, review, vs).';
        } else if (/\b(login|signup|contact|support|near me|directions)\b/.test(k)) {
            intent = 'Navigational';
            reason = 'User is looking for a specific page or location.';
        } else if (/\b(what|how|why|guide|tips|tutorial|history|definition)\b/.test(k)) {
            intent = 'Informational';
            reason = 'Knowledge-seeking terms (what, how, guide).';
        }

        let output = `Keyword Intent Analysis: "${keyword}"\n`;
        output += `=====================================\n\n`;

        output += `### Identified Intent: ${intent}\n`;
        output += `Reasoning: ${reason}\n\n`;

        output += `### Recommended Content Type\n`;
        if (intent === 'Transactional') output += `- Product Page\n- Checkout Page\n- Sales Landing Page`;
        else if (intent === 'Commercial Investigation') output += `- "Best of" Listicles\n- Comparison Guides\n- Product Reviews`;
        else if (intent === 'Navigational') output += `- Homepage\n- Contact Page\n- Login Portal`;
        else output += `- Comprehensive Guide\n- Blog Post\n- FAQ Section`;

        return NextResponse.json({ success: true, result: output });

    } catch (error) {
        return NextResponse.json({ success: false, error: 'Server Error' }, { status: 500 });
    }
}
