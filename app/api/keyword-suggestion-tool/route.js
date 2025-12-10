import { NextResponse } from 'next/server';

export async function POST(request) {
    try {
        const { seed, locale } = await request.json();

        if (!seed || typeof seed !== 'string') {
            return NextResponse.json(
                { success: false, error: 'Seed keyword is required' },
                { status: 400 }
            );
        }

        const hl = locale ? locale.toLowerCase() : 'en';
        const gl = locale ? locale.toUpperCase() : 'US'; // approximate logic

        // We will try to get suggestions for the seed
        // To make it "richer", we could loop through prefixes/suffixes, but for speed we'll do the main one first.
        // Let's do a simple recursive strategy: Seed, then Seed + " a", Seed + " b" might be too slow for serverless limit.
        // Let's just do the Seed + some common modifiers if the list is short.

        const fetchSuggestions = async (query) => {
            const url = `https://suggestqueries.google.com/complete/search?client=chrome&q=${encodeURIComponent(query)}&hl=${hl}&gl=${gl}`;
            const res = await fetch(url);
            if (!res.ok) return [];
            const data = await res.json();
            // data format: ["query", ["sugg1", "sugg2", ...], ...]
            return data[1] || [];
        };

        let allSuggestions = new Set();

        // 1. Base query
        const baseSuggestions = await fetchSuggestions(seed);
        baseSuggestions.forEach(s => allSuggestions.add(s));

        // 2. If we want more, we can try a few modifiers
        // Let's add "how to [seed]" and "best [seed]"
        const modifiers = ['best', 'how to', 'what is', 'vs'];
        const modifierPromises = modifiers.map(m => fetchSuggestions(`${m} ${seed}`));

        const modifierResults = await Promise.all(modifierPromises);
        modifierResults.flat().forEach(s => allSuggestions.add(s));

        const sortedList = Array.from(allSuggestions).sort();

        // Limit to 100 to be safe
        const finalResult = sortedList.slice(0, 100).join('\n');

        return NextResponse.json({
            success: true,
            result: finalResult
        });

    } catch (error) {
        console.error('Keyword Suggestion API Error:', error);
        return NextResponse.json(
            { success: false, error: 'Internal Server Error' },
            { status: 500 }
        );
    }
}
