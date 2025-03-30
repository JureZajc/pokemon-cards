import CardSetContent from "./CardSetContent";
import { notFound } from "next/navigation";

interface Params {
  setId: string;
}

interface Props {
  params: Params;
  searchParams: { name: string };
}

async function getCardsForSet(setId: string) {
  const apiKey = process.env.TCG_API;

  if (!apiKey) {
    throw new Error("TCG_API key is not defined in environment variables.");
  }

  const apiUrl = `https://api.pokemontcg.io/v2/cards?q=set.id:${setId}`;

  const res = await fetch(apiUrl, {
    headers: {
      "X-Api-Key": apiKey,
    },
    next: { revalidate: 3600 }, // Cache for an hour
  });

  if (!res.ok) {
    console.error(`Failed to fetch cards for set ${setId}: ${res.status}`);
    return null;
  }

  const data = await res.json();
  return data.data;
}

// ✅ Static params function (optional)
export async function generateStaticParams() {
  return [];
}

export default async function CardSetDetailPage({ params }: Props) {
  if (!params?.setId) {
    return <div className="text-center text-red-500">Invalid set ID</div>;
  }

  const cards = await getCardsForSet(params.setId);
  if (!cards) {
    notFound();
  }

  return <CardSetContent cards={cards} />;
}
