import { NextResponse } from 'next/server';

export async function POST(request) {
    try {
        const { url } = await request.json();

        if (!url) return NextResponse.json({ success: false, error: 'URL required' }, { status: 400 });

        let targetUrl = url.startsWith('http') ? url : 'https://' + url;

        // Fetch the page
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000); // 5s timeout

        let html = '';
        let status = 200;

        try {
            const res = await fetch(targetUrl, {
                method: 'GET',
                headers: { 'User-Agent': 'Mozilla/5.0 (Compatible; SEOBot/1.0)' },
                signal: controller.signal
            });
            status = res.status;
            html = await res.text();
        } catch (err) {
            return NextResponse.json({ success: false, error: 'Failed to fetch URL. Ensure it is accessible.' }, { status: 500 });
        } finally {
            clearTimeout(timeoutId);
        }

        // Extract canonical tag
        // Simple regex extraction. Note: Basic parsing, robust HTML parsing is heavy.
        const match = html.match(/<link\s+rel=["']canonical["']\s+href=["'](.*?)["']/i) ||
            html.match(/<link\s+href=["'](.*?)["']\s+rel=["']canonical["']/i);

        const canonical = match ? match[1] : null;

        let output = `Canonical Tag Analysis for ${targetUrl}\n`;
        output += `==========================================\n\n`;
        output += `Check Status: ${status === 200 ? '✅ Accessible' : '❌ Error (' + status + ')'}\n\n`;

        output += `### Result\n`;
        if (canonical) {
            output += `Detected Canonical URL: \`${canonical}\`\n\n`;

            // Normalize for comparison
            const inputNorm = targetUrl.replace(/\/$/, '');
            const canonNorm = canonical.replace(/\/$/, '');

            if (inputNorm === canonNorm) {
                output += `✅ **Self-Referencing**: The canonical tag points to this page correctly.\n`;
            } else {
                output += `⚠️ **Mismatch**: The canonical tag points to a different URL.\n`;
                output += `This tells search engines to index **${canonical}** instead of this page.\n`;
            }
        } else {
            output += `❌ **No Canonical Tag Found**\n`;
            output += `Recommendation: Add \`<link rel="canonical" href="${targetUrl}" />\` to the <head> section to prevent duplicate content issues.\n`;
        }

        return NextResponse.json({ success: true, result: output });

    } catch (error) {
        return NextResponse.json({ success: false, error: 'Server Error' }, { status: 500 });
    }
}
