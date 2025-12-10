import { NextResponse } from 'next/server';

export async function POST(request) {
    try {
        const { url } = await request.json();

        if (!url) return NextResponse.json({ success: false, error: 'URL required' }, { status: 400 });

        let targetUrl = url;
        if (!targetUrl.startsWith('http')) targetUrl = 'https://' + targetUrl;

        const controller = new AbortController();
        setTimeout(() => controller.abort(), 8000);

        // 1. Fetch
        let res;
        try {
            res = await fetch(targetUrl, {
                headers: { 'User-Agent': '100SEOTools-Analyzer' },
                signal: controller.signal
            });
        } catch (e) {
            return NextResponse.json({ success: false, error: 'Failed to access URL: ' + e.message }, { status: 422 });
        }

        if (!res.ok) return NextResponse.json({ success: false, error: `Failed to fetch page. Status: ${res.status}` }, { status: 422 });
        const html = await res.text();

        // 2. Extract <a> tags with regex
        // <a href="...">Anchor</a>
        const regex = /<a[^>]+href=["'](.*?)["'][^>]*>(.*?)<\/a>/gis;

        const anchors = [];
        let match;
        while ((match = regex.exec(html)) !== null) {
            const href = match[1];
            let text = match[2].replace(/<[^>]+>/g, '').trim(); // Strip internal tags like <img>
            if (!text) text = '[Image/Empty]';

            anchors.push({ href, text });
            if (anchors.length >= 100) break;
        }

        // 3. Analysis
        const total = anchors.length;
        const empty = anchors.filter(a => a.text === '[Image/Empty]').length;
        const uniqueAnchors = new Set(anchors.map(a => a.text)).size;

        let output = `Found ${total} links on ${targetUrl}\n\n`;
        output += `Summary:\n- Unique Anchor Texts: ${uniqueAnchors}\n- Empty/Image Anchors: ${empty}\n\n`;
        output += `Link Analysis:\n`;

        anchors.slice(0, 50).forEach((a, i) => {
            let snippet = a.text;
            if (snippet.length > 30) snippet = snippet.substring(0, 27) + '...';
            output += `${i + 1}. "${snippet}" -> ${a.href.substring(0, 40)}...\n`;
        });

        return NextResponse.json({ success: true, result: output });

    } catch (error) {
        return NextResponse.json({ success: false, error: 'Error: ' + error.message }, { status: 500 });
    }
}
