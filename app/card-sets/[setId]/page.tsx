import {notFound} from "next/navigation";
import CardSetContent from "./CardSetContent";

// Next.js 15+ PageProps type structure (used internally for routing)
export default async function CardSetDetailPage({
                                                    params,
                                                }: {
    params: Promise<{ setId: string }>;
}) {
    const apiKey = process.env.TCG_API;
    const {setId} = await params;

    if (!setId || !apiKey) {
        notFound();
    }

    const apiUrl = `https://api.pokemontcg.io/v2/cards?q=set.id:${setId}`;

    const res = await fetch(apiUrl, {
        headers: {
            "X-Api-Key": apiKey,
        },
        next: {revalidate: 3600},
    });

    if (!res.ok) {
        console.error(`Failed to fetch cards for set ${setId}: ${res.status}`);
        notFound();
    }

    const json = await res.json();
    const cards = json.data;

    return <CardSetContent cards={cards}/>;
}
