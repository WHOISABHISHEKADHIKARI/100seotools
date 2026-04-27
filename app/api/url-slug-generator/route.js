import { NextResponse } from 'next/server';

export async function POST(request) {
    try {
        const { title } = await request.json();

        if (!title) return NextResponse.json({ success: false, error: 'Title required' }, { status: 400 });

        const slug = title
            .toLowerCase()
            .replace(/[^a-z0-9\s-]/g, '') // Remove non-alphanumeric (keep spaces and hyphens)
            .trim()
            .replace(/\s+/g, '-') // Replace spaces with hyphens
            .replace(/-+/g, '-'); // Remove duplicate hyphens

        return NextResponse.json({ success: true, result: slug });

    } catch (error) {
        return NextResponse.json({ success: false, error: 'Server Error' }, { status: 500 });
    }
}
