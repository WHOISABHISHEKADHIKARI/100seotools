import { NextResponse } from 'next/server';

export async function POST(request) {
    try {
        const { url } = await request.json();

        if (!url) {
            return NextResponse.json({ success: false, error: 'URL is required' }, { status: 400 });
        }

        let targetUrl = url;
        if (!targetUrl.startsWith('http')) {
            targetUrl = 'https://' + targetUrl;
        }

        // Use HEAD to be fast
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 5000);

        const response = await fetch(targetUrl, {
            method: 'HEAD',
            headers: { 'User-Agent': '100SEOTools-Bot/1.0' },
            signal: controller.signal
        });
        clearTimeout(timeout);

        const status = response.status;
        const statusText = response.statusText;

        let explanation = 'Unknown Status';
        if (status >= 200 && status < 300) explanation = 'Success: The request was successfully received, understood, and accepted.';
        else if (status >= 300 && status < 400) explanation = 'Redirection: Further action needs to be taken in order to complete the request.';
        else if (status >= 400 && status < 500) explanation = 'Client Error: The request contains bad syntax or cannot be fulfilled.';
        else if (status >= 500) explanation = 'Server Error: The server failed to fulfill an apparently valid request.';

        return NextResponse.json({
            success: true,
            result: `URL: ${targetUrl}\nStatus Code: ${status}\nStatus Text: ${statusText}\n\nExplanation:\n${explanation}`
        });

    } catch (error) {
        return NextResponse.json({
            success: true,
            result: `Error checking URL: ${error.message}\n(Likely invalid URL, DNS error, or timeout)`
        });
    }
}
