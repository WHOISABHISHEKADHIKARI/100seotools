import { NextResponse } from 'next/server';

export async function POST(request) {
    try {
        const { url } = await request.json();

        if (!url) return NextResponse.json({ success: false, error: 'URL required' }, { status: 400 });

        const target = url.startsWith('http') ? url : 'https://' + url;

        // Simulate analysis based on HTML size
        const controller = new AbortController();
        setTimeout(() => controller.abort(), 5000);
        let size = 50000;
        try {
            const res = await fetch(target, { method: 'HEAD', signal: controller.signal });
            size = parseInt(res.headers.get('content-length') || 50000);
        } catch { }

        // Score: Smaller is better.
        // 10kb = 100. 100kb = 90. 1mb = 50.
        let mobileScore = Math.max(20, 100 - (size / 10000));
        let desktopScore = Math.min(100, mobileScore + 15);

        // Add randomness (Lighthouse variance)
        mobileScore = Math.floor(mobileScore + (Math.random() * 10 - 5));
        desktopScore = Math.floor(desktopScore + (Math.random() * 10 - 5));

        const metrics = [
            { name: "First Contentful Paint", val: (1 + Math.random()).toFixed(1) + 's' },
            { name: "Largest Contentful Paint", val: (2 + Math.random()).toFixed(1) + 's' },
            { name: "Cumulative Layout Shift", val: (Math.random() * 0.1).toFixed(3) },
            { name: "Total Blocking Time", val: Math.floor(Math.random() * 300) + 'ms' }
        ];

        let output = `Simulated Page Speed Insights for ${target}:\n\n`;
        output += `📱 Mobile Score: ${mobileScore}/100\n`;
        output += `💻 Desktop Score: ${desktopScore}/100\n\n`;

        output += `Core Web Vitals (Estimated):\n`;
        metrics.forEach(m => output += `- ${m.name}: ${m.val}\n`);

        output += `\nRecommendations:\n`;
        output += `- Optimize images (WebP format)\n`;
        output += `- Minify CSS/JS\n`;
        output += `- Reduce server response time`;

        return NextResponse.json({ success: true, result: output });

    } catch (error) {
        return NextResponse.json({ success: false, error: 'Server Error' }, { status: 500 });
    }
}
