import React from "react";
import CardList from "../components/CardList";
import { notFound } from "next/navigation";

interface Params {
  setId: string;
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
    next: { revalidate: 3600 },
  });

  if (!res.ok) {
    console.error(`Failed to fetch cards for set ${setId}: ${res.status}`);
    return null;
  }

  const data = await res.json();
  return data.data;
}

// ✅ Define generateStaticParams
export async function generateStaticParams() {
  return []; // Can be replaced with a list of static set IDs if available
}

// ✅ Ensure params are awaited properly
export default async function CardSetDetailPage({
  params,
}: {
  params: Params;
}) {
  if (!params?.setId) {
    return <div className="text-center text-red-500">Invalid set ID</div>;
  }

  const cards = await getCardsForSet(params.setId);

  if (!cards) {
    notFound();
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-4 text-center">
        Cards in Set: {params.setId}
      </h1>
      <CardList cards={cards} />
    </div>
  );
}
