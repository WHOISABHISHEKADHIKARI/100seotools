import { NextResponse } from 'next/server';

export async function POST(request) {
    try {
        const { content } = await request.json();

        if (!content || typeof content !== 'string') {
            return NextResponse.json(
                { success: false, error: 'Content is required and must be a string' },
                { status: 400 }
            );
        }

        if (content.length > 100000) {
            return NextResponse.json(
                { success: false, error: 'Content too long (max 100,000 characters)' },
                { status: 400 }
            );
        }

        // 1. Clean and normalize text
        // Remove HTML tags if any (basic cleaning)
        const cleanText = content.replace(/<[^>]*>/g, ' ');

        // Normalize format: lowercase, remove special punctuation but keep structure
        const normalizedText = cleanText.toLowerCase();

        // Split into words (handling various whitespace and punctuation)
        // We filter out empty strings
        const words = normalizedText
            .replace(/[^\w\s-]/g, '') // Remove special chars except word chars, spaces, hyphens
            .split(/\s+/)
            .filter(w => w.length > 0);

        const totalWords = words.length;

        if (totalWords === 0) {
            return NextResponse.json(
                { success: true, result: { totalWords: 0, density: [] } },
                { status: 200 }
            );
        }

        // 2. Count frequencies
        const frequency = {};
        words.forEach(word => {
            // Skip very short words or numbers if desired, but for now we keep everything
            if (word.length < 2) return;
            frequency[word] = (frequency[word] || 0) + 1;
        });

        // 3. Calculate density and sort
        const densityList = Object.keys(frequency).map(word => {
            const count = frequency[word];
            const density = (count / totalWords) * 100;
            return {
                word,
                count,
                density: parseFloat(density.toFixed(2))
            };
        });

        // Sort by count descending, then density descending
        densityList.sort((a, b) => b.count - a.count);

        // Top 50 keywords
        const topKeywords = densityList.slice(0, 50);

        return NextResponse.json({
            success: true,
            result: {
                totalWords,
                uniqueWords: densityList.length,
                density: topKeywords
            }
        });

    } catch (error) {
        console.error('Keyword Density API Error:', error);
        return NextResponse.json(
            { success: false, error: 'Internal Server Error' },
            { status: 500 }
        );
    }
}
