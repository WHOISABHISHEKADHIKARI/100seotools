import { NextResponse } from 'next/server';

export async function POST(request) {
    try {
        const { desc, keyword } = await request.json();

        if (!desc) return NextResponse.json({ success: false, error: 'Description required' }, { status: 400 });

        const len = desc.length;
        const k = (keyword || '').toLowerCase();
        const dLow = desc.toLowerCase();

        const checks = [];
        let score = 100;

        // Length
        if (len < 100) { score -= 20; checks.push('❌ Too short (< 100 chars)'); }
        else if (len > 160) { score -= 20; checks.push('❌ Too long (> 160 chars)'); }
        else checks.push('✅ Good length (100-160 chars)');

        // Keyword
        if (k && dLow.includes(k)) checks.push(`✅ Includes keyword "${keyword}"`);
        else if (k) { score -= 30; checks.push(`❌ Missing keyword "${keyword}"`); }

        // CTA
        const ctas = ['click', 'learn', 'discover', 'read', 'find', 'get', 'shop', 'buy'];
        if (ctas.some(w => dLow.includes(w))) checks.push('✅ Includes Call-to-Action words');
        else { score -= 10; checks.push('⚠️ Consider adding a CTA (e.g., "Learn more", "Discover")'); }

        const output = `Score: ${Math.max(0, score)}/100\n\nAnalysis:\n` + checks.join('\n');

        return NextResponse.json({ success: true, result: output });

    } catch (error) {
        return NextResponse.json({ success: false, error: 'Server Error' }, { status: 500 });
    }
}
