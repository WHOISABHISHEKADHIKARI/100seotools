import { NextResponse } from 'next/server';

export async function POST(request) {
    try {
        const { url } = await request.json();

        if (!url) return NextResponse.json({ success: false, error: 'URL required' }, { status: 400 });

        const target = url.startsWith('http') ? url : 'https://' + url;

        // Real check
        const start = Date.now();
        let res = null;
        try {
            const controller = new AbortController();
            setTimeout(() => controller.abort(), 6000);
            res = await fetch(target, { method: 'HEAD', signal: controller.signal });
        } catch {
            return NextResponse.json({ success: true, result: 'Could not access site. Health Score: 0 (Unreachable)' });
        }
        const duration = Date.now() - start;

        let score = 100;
        const checks = [];

        // 1. Status
        if (res.status === 200) checks.push('✅ Status 200 OK');
        else { score -= 40; checks.push(`❌ Status is ${res.status}`); }

        // 2. SSL
        if (target.startsWith('https')) checks.push('✅ HTTPS Secured');
        else { score -= 30; checks.push('❌ Not using HTTPS'); }

        // 3. Speed
        if (duration < 500) checks.push(`✅ Fast Response (${duration}ms)`);
        else if (duration < 1500) { score -= 10; checks.push(`⚠️ Moderate Speed (${duration}ms)`); }
        else { score -= 20; checks.push(`❌ Slow Response (${duration}ms)`); }

        // 4. Server Header (Simulated check)
        checks.push('✅ Server Accessible');

        const output = `SEO Health Score: ${Math.max(0, score)}/100\n\nDiagnostic Report:\n` + checks.join('\n');

        return NextResponse.json({ success: true, result: output });

    } catch (error) {
        return NextResponse.json({ success: false, error: 'Server Error' }, { status: 500 });
    }
}
