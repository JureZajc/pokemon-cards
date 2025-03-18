// app/card-sets/page.tsx
import React from "react";
import CardSetList from "./components/CardSetList";
import { CardSet } from "./components/interfaces/CardSet";

async function getCardSets() {
  const apiKey = process.env.TCG_API; // Access API key from environment variable

  if (!apiKey) {
    throw new Error("TCG_API key is not defined in environment variables.");
  }

  const res = await fetch("https://api.pokemontcg.io/v2/sets", {
    headers: {
      "X-Api-Key": apiKey,
    },
    next: { revalidate: 3600 }, // Optional: Revalidate data every hour
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch data: ${res.status} ${res.statusText}`);
  }

  const data = await res.json();

  data.data.sort((a: CardSet, b: CardSet) => {
    return (
      new Date(b.releaseDate).getTime() - new Date(a.releaseDate).getTime()
    );
  });

  return data.data;
}

export default async function CardSetsPage() {
  const cardSets = await getCardSets();

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-4 text-center">Pokémon Card Sets</h1>
      <CardSetList cardSets={cardSets} />
    </div>
  );
}
