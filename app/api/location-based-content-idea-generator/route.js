import { NextResponse } from 'next/server';

export async function POST(request) {
    try {
        const { keyword, location } = await request.json();

        if (!keyword) return NextResponse.json({ success: false, error: 'Service/Keyword required' }, { status: 400 });

        const k = keyword.trim();
        const l = location ? location.trim() : 'Your City';

        const permutations = [
            `Best ${k} in ${l}`,
            `${k} services ${l}`,
            `Affordable ${k} near ${l}`,
            `Top rated ${k} company in ${l}`,
            `${l} ${k} specialists`,
            `Emergency ${k} ${l}`,
            `Commercial ${k} providers in ${l}`,
            `Residential ${k} solutions ${l}`,
            `How to find a good ${k} in ${l}`,
            `${k} cost in ${l} (2025 Price Guide)`
        ];

        let output = `Location-Based Content Ideas for: ${k} + ${l}\n\n`;
        output += `### Title Ideas (SEO Optimized)\n`;
        permutations.forEach(p => output += `- ${p}\n`);

        output += `\n### Content Strategy Tips\n`;
        output += `1. **Local Landing Pages**: Create a dedicated page for "${k} in ${l}".\n`;
        output += `2. **GMB Integration**: Mention these keywords in your Google Business Profile posts.\n`;
        output += `3. **Local Schema**: Add LocalBusiness schema referencing ${l}.\n`;
        output += `4. **Testimonials**: Feature reviews from customers in ${l}.`;

        return NextResponse.json({ success: true, result: output });

    } catch (error) {
        return NextResponse.json({ success: false, error: 'Server Error' }, { status: 500 });
    }
}
