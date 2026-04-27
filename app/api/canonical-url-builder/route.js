import { NextResponse } from 'next/server';

export async function POST(request) {
    try {
        const { url } = await request.json();

        if (!url) return NextResponse.json({ success: false, error: 'URL required' }, { status: 400 });

        let clean = url.trim();
        // 1. Remove query strings
        if (clean.includes('?')) clean = clean.split('?')[0];

        // 2. Ensure Protocol
        if (!clean.startsWith('http')) clean = 'https://' + clean;

        const tag = `<link rel="canonical" href="${clean}" />`;

        return NextResponse.json({ success: true, result: tag });

    } catch (error) {
        return NextResponse.json({ success: false, error: 'Server Error' }, { status: 500 });
    }
}
