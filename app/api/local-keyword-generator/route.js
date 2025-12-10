import { NextResponse } from 'next/server';

export async function POST(request) {
    try {
        const { service, location } = await request.json();

        if (!service || !location) return NextResponse.json({ success: false, error: 'Inputs required' }, { status: 400 });

        const s = service.trim();
        const l = location.trim();

        const variations = [
            `${s} in ${l}`,
            `${s} near ${l}`,
            `best ${s} in ${l}`,
            `affordable ${s} ${l}`,
            `${l} ${s}`,
            `${s} ${l} reviews`,
            `24 hour ${s} ${l}`,
            `emergency ${s} ${l}`,
            `top rated ${s} ${l}`,
            `${s} services ${l}`
        ];

        let output = `Local Keyword List\n`;
        output += `Target: "${s}" in "${l}"\n\n`;

        output += `### Generated Keywords\n`;
        variations.forEach(v => output += `- ${v}\n`);

        output += `\n### Optimization Tips\n`;
        output += `- Includes these in your **H1 Tag** and **Meta Title**.\n`;
        output += `- Use variations in H2s (e.g. "Why choose our ${s} services in ${l}?").\n`;
        output += `- Create a dedicated location page if you serve multiple cities.`;

        return NextResponse.json({ success: true, result: output });

    } catch (error) {
        return NextResponse.json({ success: false, error: 'Server Error' }, { status: 500 });
    }
}
