import { NextResponse } from 'next/server';

export async function POST(request) {
    try {
        const { url } = await request.json();

        if (!url) return NextResponse.json({ success: false, error: 'URL required' }, { status: 400 });

        let targetUrl = url.startsWith('http') ? url : 'https://' + url;

        // Fetch to check basic reachability and meta viewport
        let hasViewport = false;
        let accessible = false;
        let status = 0;

        try {
            const controller = new AbortController();
            setTimeout(() => controller.abort(), 5000);
            const res = await fetch(targetUrl, { method: 'GET', signal: controller.signal });
            status = res.status;
            if (res.ok) {
                accessible = true;
                const html = await res.text();
                hasViewport = /<meta\s+name=["']viewport["']/.test(html);
            }
        } catch (err) {
            status = 500;
        }

        let output = `Mobile-Friendly Test Report: ${targetUrl}\n`;
        output += `==========================================\n\n`;

        output += `### Basic Checks\n`;
        output += `- **Accessible**: ${accessible ? '✅ Yes' : '❌ No (Status: ' + status + ')'}\n`;
        output += `- **Viewport Tag**: ${hasViewport ? '✅ Detected' : '❌ Missing! (Critical for mobile)'}\n\n`;

        output += `### Simulation Results\n`;
        if (hasViewport) {
            output += `✅ **Passed**: Page appears to be configured for mobile devices.\n`;
            output += `Status: **Mobile-Friendly**\n`;
        } else {
            output += `❌ **Failed**: Missing Viewport tag means the page likely does not scale correctly on phones.\n`;
            output += `Fix: Add \`<meta name="viewport" content="width=device-width, initial-scale=1">\` to your <head>.\n`;
        }

        output += `\n### Usability Tips\n`;
        output += `1. **Tap Targets**: Ensure buttons are at least 48x48 pixels.\n`;
        output += `2. **Font Size**: Use at least 16px for body text.\n`;
        output += `3. **Spacing**: Avoid cluttering links too close together.`;

        return NextResponse.json({ success: true, result: output });

    } catch (error) {
        return NextResponse.json({ success: false, error: 'Server Error' }, { status: 500 });
    }
}
