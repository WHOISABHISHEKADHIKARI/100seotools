import { NextResponse } from 'next/server';

export async function POST(request) {
    try {
        const { url } = await request.json().catch(() => ({}));

        if (!url || typeof url !== 'string') {
            return NextResponse.json({ success: false, error: 'URL is required' }, { status: 400 });
        }

        // Add protocol if missing
        let targetUrl = url;
        if (!targetUrl.startsWith('http')) {
            targetUrl = 'https://' + targetUrl;
        }

        // 1. Fetch the page HTML
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout

        const response = await fetch(targetUrl, {
            headers: { 'User-Agent': '100SEOTools-Crawler/1.0' },
            signal: controller.signal
        });
        clearTimeout(timeoutId);

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
        const results = [];
        const batchSize = 5;

        for (let i = 0; i < checkList.length; i += batchSize) {
            const batch = checkList.slice(i, i + batchSize);
            const batchPromises = batch.map(async (item) => {
                try {
                    const controller = new AbortController();
                    const timeoutId = setTimeout(() => controller.abort(), 4000); // 4s timeout

                    // Try HEAD first, fall back to GET if HEAD not allowed
                    let res = await fetch(item.url, {
                        method: 'HEAD',
                        signal: controller.signal,
                        headers: { 'User-Agent': '100SEOTools-Bot/1.0' }
                    });

                    // Some servers return 405 for HEAD; fall back to GET
                    if (res.status === 405) {
                        const controller2 = new AbortController();
                        const timeoutId2 = setTimeout(() => controller2.abort(), 4000);
                        res = await fetch(item.url, {
                            method: 'GET',
                            signal: controller2.signal,
                            headers: { 'User-Agent': '100SEOTools-Bot/1.0' },
                        });
                        clearTimeout(timeoutId2);
                    }
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
        const workingCount = results.length - brokenCount;

        // Format output with proper headings
        const lines = [];
        lines.push(`# Broken Link Report`);
        lines.push('');
        lines.push(`**Scanned:** ${targetUrl}`);
        lines.push(`**Links Checked:** ${results.length} (of ${links.size} total found)`);
        lines.push(`**Broken:** ${brokenCount}  |  **Working:** ${workingCount}`);
        lines.push('');

        if (brokenCount > 0) {
            lines.push('## Broken Links Found');
            lines.push('');
            broken.forEach(b => {
                const tag = b.isInternal ? '(internal)' : '(external)';
                lines.push(`- ❌ **${b.status || 'Error'}** ${b.url} ${tag}`);
            });
            lines.push('');

            lines.push('## Recommendations');
            lines.push('- Fix or redirect broken links to relevant working pages.');
            lines.push('- Use 301 redirects for moved content.');
            lines.push('- Update internal links pointing to removed pages.');
            lines.push('- For external broken links, consider removing or updating the link.');
            lines.push('');
        } else {
            lines.push('✅ **No broken links found in this sample.**');
            lines.push('');
        }

        lines.push('## Summary');
        lines.push(`| Metric | Value |`);
        lines.push(`|---|---|`);
        lines.push(`| Total Links Found | ${links.size} |`);
        lines.push(`| Links Checked | ${results.length} |`);
        lines.push(`| Broken | ${brokenCount} |`);
        lines.push(`| Working | ${workingCount} |`);
        lines.push(`| Internal | ${results.filter(r => r.isInternal).length} |`);
        lines.push(`| External | ${results.filter(r => !r.isInternal).length} |`);
        lines.push('');

        if (results.length < links.size) {
            lines.push(`> **Note:** Limited to first ${results.length} links for performance. Run again for a full scan.`);
        }

        return NextResponse.json({
            success: true,
            result: lines.join('\n')
        });

    } catch (error) {
        console.error('Broken Link API Error:', error);
        return NextResponse.json(
            { success: false, error: 'Server Error' },
            { status: 500 }
        );
    }
}
