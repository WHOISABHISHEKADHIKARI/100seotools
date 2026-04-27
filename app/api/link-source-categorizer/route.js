import { NextResponse } from 'next/server';

export async function POST(request) {
    try {
        const { url } = await request.json();

        if (!url) return NextResponse.json({ success: false, error: 'URL required' }, { status: 400 });

        const u = url.toLowerCase();

        // Categorization Heuristics
        let category = 'General Website';
        let confidence = 'Low';

        if (u.includes('forum') || u.includes('reddit') || u.includes('discourse') || u.includes('quora')) {
            category = 'Forum / Discussion Board';
            confidence = 'High';
        } else if (u.includes('blog') || u.includes('wordpress') || u.includes('medium')) {
            category = 'Blog';
            confidence = 'Medium';
        } else if (u.includes('.gov')) {
            category = 'Government';
            confidence = 'High';
        } else if (u.includes('.edu')) {
            category = 'Educational';
            confidence = 'High';
        } else if (u.includes('news') || u.includes('times') || u.includes('daily') || u.includes('cnn') || u.includes('bbc')) {
            category = 'News / Media';
            confidence = 'Medium';
        } else if (u.includes('directory') || u.includes('listing') || u.includes('yelp') || u.includes('yellowpages')) {
            category = 'Directory';
            confidence = 'High';
        } else if (u.includes('shop') || u.includes('store') || u.includes('amazon') || u.includes('ebay')) {
            category = 'E-commerce';
            confidence = 'Medium';
        }

        let output = `Link Source Category: ${url}\n`;
        output += `============================${'='.repeat(url.length)}\n\n`;

        output += `### Category: **${category}**\n`;
        output += `Confidence: ${confidence}\n\n`;

        output += `### SEO Value Assessment\n`;
        if (category === 'Government' || category === 'Educational') {
            output += `🌟 **Gold Standard**: Links from .gov/.edu are extremely authoritative.`;
        } else if (category === 'News / Media') {
            output += `🔥 **High Value**: News links bring trust and traffic.`;
        } else if (category === 'Forum / Discussion Board') {
            output += `⚠️ **Low SEO Value**: Often 'nofollow', but good for referral traffic.`;
        } else if (category === 'Directory') {
            output += `ℹ️ **Foundational**: Good for Local SEO / NAP, but low power.`;
        } else {
            output += `✅ **Standard**: Value depends on the specific site's metrics (DA/DR).`;
        }

        return NextResponse.json({ success: true, result: output });

    } catch (error) {
        return NextResponse.json({ success: false, error: 'Server Error' }, { status: 500 });
    }
}
