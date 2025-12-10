import { NextResponse } from 'next/server';

export async function POST(request) {
    try {
        const { url } = await request.json();

        if (!url || typeof url !== 'string') {
            return NextResponse.json({ success: false, error: 'URL is required' }, { status: 400 });
        }

        // Add protocol if missing
        let targetUrl = url;
        if (!targetUrl.startsWith('http')) {
            targetUrl = 'https://' + targetUrl;
        }

        // 1. Fetch the page HTML
        const response = await fetch(targetUrl, {
            headers: { 'User-Agent': '100SEOTools-Crawler/1.0' }
        });

        if (!response.ok) {
            // Return 200 but explain failure in result, so tool doesn't "crash"
            return NextResponse.json({
                success: true,
                result: `Could not crawl ${targetUrl}. Status: ${response.status}. Please check if the URL is accessible.`
            });
        }

        const html = await response.text();
        const baseUrlObj = new URL(targetUrl);
        const domain = baseUrlObj.hostname;

        // 2. Extract links (Regex for speed/robustness against bad HTML)
        // Matches href="..." or href='...'
        const linkRegex = /href=["'](.*?)["']/gi;
        const links = new Set();
        let match;
        while ((match = linkRegex.exec(html)) !== null) {
            links.add(match[1]);
        }

        const checkList = [];
        const maxChecks = 30; // Limit for serverless timeout safety

        // Normalize and filter links
        links.forEach(href => {
            try {
                if (checkList.length >= maxChecks) return;

                // Skip anchors, js, mailto
                if (href.startsWith('#') || href.startsWith('javascript:') || href.startsWith('mailto:') || href.startsWith('tel:')) return;

                const absoluteUrl = new URL(href, targetUrl).href;

                // Skip duplicate
                if (checkList.find(i => i.url === absoluteUrl)) return;

                checkList.push({
                    url: absoluteUrl,
                    original: href,
                    isInternal: absoluteUrl.includes(domain)
                });
            } catch (e) {
                // Invalid URL
            }
        });

        // 3. Check status codes in parallel (batches of 5)
        // We only check Head
        const results = [];
        const batchSize = 5;

        for (let i = 0; i < checkList.length; i += batchSize) {
            const batch = checkList.slice(i, i + batchSize);
            const batchPromises = batch.map(async (item) => {
                try {
                    const controller = new AbortController();
                    const timeoutId = setTimeout(() => controller.abort(), 4000); // 4s timeout

                    const res = await fetch(item.url, {
                        method: 'HEAD',
                        signal: controller.signal,
                        headers: { 'User-Agent': '100SEOTools-Bot/1.0' }
                    });
                    clearTimeout(timeoutId);
                    return { ...item, status: res.status, ok: res.ok };
                } catch (err) {
                    return { ...item, status: 0, ok: false, error: 'Timeout/Error' };
                }
            });

            const batchResults = await Promise.all(batchPromises);
            results.push(...batchResults);
        }

        const broken = results.filter(r => !r.ok);
        const brokenCount = broken.length;

        // Format output string
        let output = `Scanned ${results.length} links on ${targetUrl}\n`;
        output += `Found ${brokenCount} broken link(s).\n\n`;

        if (brokenCount > 0) {
            broken.forEach(b => {
                output += `❌ ${b.status || 'Error'} - ${b.url}\n`;
            });
        } else {
            output += '✅ No broken links found in this sample.';
        }

        if (results.length < links.size) {
            output += `\n\n(Note: limited to first ${results.length} links for performance)`;
        }

        return NextResponse.json({
            success: true,
            result: output
        });

    } catch (error) {
        console.error('Broken Link API Error:', error);
        return NextResponse.json(
            { success: false, error: 'Internal Server Error: ' + error.message },
            { status: 500 }
        );
    }
}
