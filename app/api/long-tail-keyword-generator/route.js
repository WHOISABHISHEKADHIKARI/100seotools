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

        // Long Tail strategy: Questions & Prepositions
        const questionMods = ['how to', 'what is', 'why', 'where to', 'can I', 'best way to'];
        const prepMods = ['for', 'with', 'without', 'near', 'vs', 'under'];

        // User custom mods
        const custom = modifiers ? modifiers.split(',').map(m => m.trim()) : [];

        const targets = custom.length ? custom : [...questionMods, ...prepMods];

        const promises = targets.map(m => fetchSugg(`${seed} ${m}`));
        // Also tried "reverse" for questions: "how to [seed]"
        const questionPromises = questionMods.map(q => fetchSugg(`${q} ${seed}`));

        const results = await Promise.all([...promises, ...questionPromises]);
        const flattened = new Set(results.flat());
        const list = Array.from(flattened);

        // Filter for "Long Tail" (>= 3 words)
        const longTail = list.filter(k => k.split(/\s+/).length >= 3).sort((a, b) => b.length - a.length);

        return NextResponse.json({
            success: true,
            result: `Generated ${longTail.length} long-tail keywords based on "${seed}":\n\n` + longTail.join('\n')
        });

    } catch (error) {
        return NextResponse.json({ success: false, error: 'Server Error' }, { status: 500 });
    }
}
