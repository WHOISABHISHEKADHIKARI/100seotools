import { NextResponse } from 'next/server';

export async function POST(request) {
    try {
        const { seed, modifiers } = await request.json();

        if (!seed) return NextResponse.json({ success: false, error: 'Seed required' }, { status: 400 });

        const fetchSugg = async (q) => {
            try {
                const res = await fetch(`https://suggestqueries.google.com/complete/search?client=chrome&q=${encodeURIComponent(q)}`);
                if (res.ok) {
                    const data = await res.json();
                    return data[1] || [];
                }
            } catch { }
            return [];
        };

        const modsInput = modifiers ? modifiers.split(',').map(m => m.trim()) :
            ['best', 'top', 'guide', 'review', 'vs', 'alternatives', 'tutorial', 'for beginners'];

        const promises = modsInput.map(m => fetchSugg(`${seed} ${m}`));
        promises.push(fetchSugg(seed)); // Base

        // Also try prepending
        const prePromises = modsInput.slice(0, 3).map(m => fetchSugg(`${m} ${seed}`));

        const results = await Promise.all([...promises, ...prePromises]);
        const set = new Set(results.flat());

        const list = Array.from(set).sort();

        return NextResponse.json({
            success: true,
            result: `Found ${list.length} expanded keywords:\n\n` + list.join('\n')
        });

    } catch (error) {
        return NextResponse.json({ success: false, error: 'Server Error' }, { status: 500 });
    }
}
