import { NextResponse } from 'next/server';

export async function POST(request) {
    try {
        const { service, cities } = await request.json();

        if (!service) return NextResponse.json({ success: false, error: 'Service required' }, { status: 400 });

        const serv = service.trim();
        const cityList = cities ? cities.split(',').map(c => c.trim()).filter(c => c) : ['New York', 'Los Angeles', 'Chicago'];

        let output = `Geo-Targeted Keyword List for "${serv}"\n`;
        output += `=======================================\n\n`;

        output += `### Generated Keywords\n`;

        cityList.forEach(city => {
            output += `- ${serv} in ${city}\n`;
            output += `- best ${serv} ${city}\n`;
            output += `- ${city} ${serv} services\n`;
            output += `- affordable ${serv} near ${city}\n`;
        });

        output += `\n### Local SEO Tips\n`;
        output += `1. **Create Location Pages**: Build a unique page for each city above.\n`;
        output += `2. **Optimize H1s**: Make sure the H1 includes "${serv} in [City]".\n`;
        output += `3. **NAP Consistency**: Ensure your Name, Address, Phone matches your GMB profile.`;

        return NextResponse.json({ success: true, result: output });

    } catch (error) {
        return NextResponse.json({ success: false, error: 'Server Error' }, { status: 500 });
    }
}
