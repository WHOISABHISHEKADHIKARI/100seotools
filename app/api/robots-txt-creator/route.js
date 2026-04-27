import { NextResponse } from 'next/server';

export async function POST(request) {
    try {
        const { allowed, disallowed } = await request.json();

        const allowList = allowed ? allowed.split(/[\n,]+/).map(r => r.trim()).filter(r => r) : [];
        const disallowList = disallowed ? disallowed.split(/[\n,]+/).map(r => r.trim()).filter(r => r) : [];

        let output = `User-agent: *\n`;

        allowList.forEach(p => {
            output += `Allow: ${p}\n`;
        });

        disallowList.forEach(p => {
            output += `Disallow: ${p}\n`;
        });

        if (allowList.length === 0 && disallowList.length === 0) {
            output += `Allow: /\n`;
        }

        return NextResponse.json({ success: true, result: output });

    } catch (error) {
        return NextResponse.json({ success: false, error: 'Server Error' }, { status: 500 });
    }
}
