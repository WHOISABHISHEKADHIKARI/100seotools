import { NextResponse } from 'next/server';

export async function POST(request) {
    try {
        const { url } = await request.json();

        if (!url) return NextResponse.json({ success: false, error: 'URL required' }, { status: 400 });

        const target = url.startsWith('http') ? url : 'https://' + url;

        // Fetch
        const controller = new AbortController();
        setTimeout(() => controller.abort(), 6000);
        let html = '';
        let status = 0;
        try {
            const res = await fetch(target, { signal: controller.signal, headers: { 'User-Agent': '100SEOTools-Bot' } });
            html = await res.text();
            status = res.status;
        } catch {
            return NextResponse.json({ success: true, result: 'Could not reach site. Toxicity Unknown (possibly dead).' });
        }

        let toxicity = 0;
        const flags = [];

        // 1. SSL
        if (target.startsWith('http:')) {
            toxicity += 10;
            flags.push('⚠️ Insecure (HTTP)');
        }

        // 2. Link Density
        const linkCount = (html.match(/<a[^>]+href/gi) || []).length;
        const wordCount = html.replace(/<[^>]*>/g, ' ').split(/\s+/).length;
        const ratio = wordCount > 0 ? (linkCount / wordCount) : 0;

        if (linkCount > 200) {
            toxicity += 20;
            flags.push(`⚠️ Excessive outbound links number (${linkCount}) - Possible Link Farm?`);
        } else if (ratio > 0.3) { // > 30% words are links
            toxicity += 30;
            flags.push(`⚠️ High Link/Text Ratio (${(ratio * 100).toFixed(0)}%)`);
        }

        // 3. Spam Words
        const spamWords = ['casino', 'payday loan', 'viagra', 'buy links', 'gambling'];
        const foundSpam = spamWords.filter(w => html.toLowerCase().includes(w));
        if (foundSpam.length > 0) {
            toxicity += 40;
            flags.push(`⛔ Found potentially spammy terms: ${foundSpam.join(', ')}`);
        }

        // 4. Status
        if (status !== 200) {
            toxicity += 10;
            flags.push(`⚠️ Non-200 Status Code (${status})`);
        }

        // 5. TLD (Controversial, keep light)
        if (target.includes('.xyz') || target.includes('.info') || target.includes('.biz')) {
            toxicity += 5; // Minimal penalty
            flags.push('⚠️ Uncommon TLD (Caution)');
        }

        let risk = 'Low';
        if (toxicity > 60) risk = 'High';
        else if (toxicity > 30) risk = 'Medium';

        const output = `Toxicity Score: ${toxicity}/100\nRisk Level: ${risk}\n\nFlags:\n` +
            (flags.length ? flags.join('\n') : '✅ No obvious toxicity signals found.');

        return NextResponse.json({ success: true, result: output });

    } catch (error) {
        return NextResponse.json({ success: false, error: 'Server Error' }, { status: 500 });
    }
}
