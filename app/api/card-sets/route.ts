import {NextResponse} from 'next/server';
import {CardSet} from '@/app/card-sets/components/interfaces/CardSet';

export async function GET() {
    const apiKey = process.env.TCG_API;

    if (!apiKey) {
        console.error("TCG_API key is not defined in environment variables.");
        return NextResponse.json({error: 'API key not configured'}, {status: 500});
    }

    try {
        const res = await fetch("https://api.pokemontcg.io/v2/sets", {
            headers: {
                "X-Api-Key": apiKey,
            },
            next: {revalidate: 3600},
            signal: AbortSignal.timeout(30000), // 30 second timeout
        });

        if (!res.ok) {
            console.error(`Failed to fetch data: ${res.status} ${res.statusText}`);
            return NextResponse.json(
                {error: `API request failed: ${res.status} ${res.statusText}`},
                {status: res.status}
            );
        }

        const data = await res.json();

        // Sort by release date (newest first)
        data.data.sort((a: CardSet, b: CardSet) => {
            return new Date(b.releaseDate).getTime() - new Date(a.releaseDate).getTime();
        });

        return NextResponse.json(data.data);
    } catch (error) {
        console.error("Error fetching card sets:", error);
        return NextResponse.json(
            {error: 'Failed to fetch card sets'},
            {status: 500}
        );
    }
}
