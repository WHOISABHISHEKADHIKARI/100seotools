import { NextResponse } from 'next/server';

export async function POST(request) {
    try {
        const { url } = await request.json();

        if (!url) return NextResponse.json({ success: false, error: 'URL required' }, { status: 400 });

        const targetUrl = url.startsWith('http') ? url : 'https://' + url;

        // Fetch page content
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 8000);
        const res = await fetch(targetUrl, {
            headers: { 'User-Agent': 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)' },
            signal: controller.signal
        });
        clearTimeout(timeout);

        if (!res.ok) {
            return NextResponse.json({ success: false, error: `Failed to fetch URL: ${res.status} ${res.statusText}` });
        }

        const html = await res.text();

        // Safe regex parsing
        const getTag = (regex) => {
            const match = html.match(regex);
            return match && match[1] ? match[1].trim() : null;
        };

        const title = getTag(/<title[^>]*>([^<]+)<\/title>/i);
        const metaDesc = getTag(/<meta\s+name=["']description["']\s+content=["']([^"']*)["'][^>]*>/i);
        const h1 = getTag(/<h1[^>]*>([^<]+)<\/h1>/i);
        const canonical = getTag(/<link\s+rel=["']canonical["']\s+href=["']([^"']*)["'][^>]*>/i);
        const wordCount = html.replace(/<[^>]*>/g, ' ').split(/\s+/).filter(w => w.length > 0).length;

        // Audit Logic
        const audit = [];

        // Title
        if (!title) audit.push(`❌ **Title Missing**: Crucial for SEO.`);
        else if (title.length < 30) audit.push(`⚠️ **Title Too Short**: ${title.length} chars. Aim for 50-60.`);
        else if (title.length > 60) audit.push(`⚠️ **Title Too Long**: ${title.length} chars. Google may truncate.`);
        else audit.push(`✅ **Title Optimized**: ${title.length} chars.`);

        // Description
        if (!metaDesc) audit.push(`❌ **Meta Description Missing**: Missed CTR opportunity.`);
        else if (metaDesc.length < 100) audit.push(`⚠️ **Description Too Short**: ${metaDesc.length} chars. Aim for 150-160.`);
        else if (metaDesc.length > 160) audit.push(`⚠️ **Description Too Long**: ${metaDesc.length} chars.`);
        else audit.push(`✅ **Description Optimized**: ${metaDesc.length} chars.`);

        // H1
        if (!h1) audit.push(`❌ **H1 Tag Missing**: Page structure is unclear.`);
        else audit.push(`✅ **H1 Present**: "${h1}"`);

        // Content
        if (wordCount < 300) audit.push(`⚠️ **Thin Content**: Only ~${wordCount} words. Recommend 500+.`);
        else audit.push(`✅ **Content Length Good**: ~${wordCount} words.`);

        let output = `On-Page SEO Audit: ${targetUrl}\n`;
        output += `===================================\n\n`;

        output += `### Critical Signals\n`;
        output += `- Title: ${title || 'N/A'}\n`;
        output += `- Meta Desc: ${metaDesc || 'N/A'}\n`;
        output += `- H1: ${h1 || 'N/A'}\n`;
        output += `- Canonical: ${canonical || 'Missing'}\n\n`;

        output += `### Audit Findings\n`;
        audit.forEach(a => output += `- ${a}\n`);

        return NextResponse.json({ success: true, result: output });

    } catch (error) {
        return NextResponse.json({ success: false, error: 'Audit failed. The URL might be blocking bots.' }, { status: 500 });
    }
}
