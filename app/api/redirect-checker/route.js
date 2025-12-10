import { NextResponse } from 'next/server';

export async function POST(request) {
    try {
        const { url } = await request.json();

        if (!url) {
            return NextResponse.json({ success: false, error: 'URL is required' }, { status: 400 });
        }

        let currentUrl = url;
        if (!currentUrl.startsWith('http')) {
            currentUrl = 'https://' + currentUrl;
        }

        const chain = [];
        const maxRedirects = 10;

        for (let i = 0; i < maxRedirects; i++) {
            try {
                const controller = new AbortController();
                setTimeout(() => controller.abort(), 5000);

                const res = await fetch(currentUrl, {
                    method: 'HEAD',
                    redirect: 'manual',
                    headers: { 'User-Agent': '100SEOTools-Bot/1.0' },
                    signal: controller.signal
                });

                const status = res.status;
                chain.push({ url: currentUrl, status });

                if (status >= 300 && status < 400) {
                    const location = res.headers.get('location');
                    if (!location) {
                        chain.push({ error: 'Redirect status but no Location header.' });
                        break;
                    }
                    // Resolve relative URL
                    currentUrl = new URL(location, currentUrl).href;
                } else {
                    break; // Not a redirect
                }
            } catch (e) {
                chain.push({ url: currentUrl, error: e.message });
                break;
            }
        }

        // Format output
        let output = `Redirect Chain Analysis:\n\n`;
        chain.forEach((step, index) => {
            const symbol = index === chain.length - 1 ? '🏁' : '⬇️';
            if (step.error) {
                output += `${index + 1}. ${step.url} ❌ Error: ${step.error}\n`;
            } else {
                output += `${index + 1}. ${step.url} --> Status: ${step.status} ${symbol}\n`;
            }
        });

        if (chain.length > 1 && chain[chain.length - 1].status === 200) {
            output += `\n✅ Final Destination is reachable (200 OK).`;
        } else if (chain.length > maxRedirects) {
            output += `\n⚠️ Too many redirects or loop detected.`;
        }

        return NextResponse.json({
            success: true,
            result: output
        });

    } catch (error) {
        return NextResponse.json({ success: false, error: 'Server Error' }, { status: 500 });
    }
}
