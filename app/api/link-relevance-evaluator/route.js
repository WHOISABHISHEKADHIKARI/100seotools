import { NextResponse } from 'next/server';

export async function POST(request) {
    try {
        const { linkUrl, targetKeyword } = await request.json();

        if (!linkUrl || !targetKeyword) return NextResponse.json({ success: false, error: 'URL and Keyword required' }, { status: 400 });

        const keyword = targetKeyword.toLowerCase();

        // Fetch
        const controller = new AbortController();
        setTimeout(() => controller.abort(), 6000);
        const res = await fetch(linkUrl, { signal: controller.signal, headers: { 'User-Agent': '100SEOTools-Bot' } });
        if (!res.ok) throw new Error('Could not fetch page');
        const html = (await res.text()).toLowerCase();

        // Analyze
        const titleRegex = /<title>(.*?)<\/title>/;
        const h1Regex = /<h1[^>]*>(.*?)<\/h1>/;

        const titleMatch = html.match(titleRegex);
        const title = titleMatch ? titleMatch[1] : '';

        const h1Match = html.match(h1Regex);
        const h1 = h1Match ? h1Match[1] : '';

        const bodyText = html.replace(/<[^>]*>/g, ' '); // simple strip

        let score = 0;
        const checks = [];

        if (title.includes(keyword)) { score += 40; checks.push('✅ Found in Title'); }
        else { checks.push('❌ Not in Title'); }

        if (h1.includes(keyword)) { score += 30; checks.push('✅ Found in Main Heading (H1)'); }
        else { checks.push('❌ Not in H1'); }

        if (bodyText.includes(keyword)) {
            score += 20;
            const count = bodyText.split(keyword).length - 1;
            checks.push(`✅ Found in Body Content (${count} times)`);
        } else {
            checks.push('❌ Not found in Body Content');
        }

        if (linkUrl.toLowerCase().includes(keyword.replace(/\s+/g, '-'))) {
            score += 10;
            checks.push('✅ Found in URL');
        }

        let rating = 'Low Relevance';
        if (score > 70) rating = 'Excellent Relevance';
        else if (score > 40) rating = 'Moderate Relevance';

        const output = `Relevance Score: ${score}/100\nRating: ${rating}\n\nBreakdown:\n` + checks.join('\n');

        return NextResponse.json({ success: true, result: output });

    } catch (error) {
        return NextResponse.json({ success: false, error: 'Error: ' + error.message }, { status: 500 });
    }
}
