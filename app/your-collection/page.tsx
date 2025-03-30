// app/your-collection/page.tsx
"use client";

import React, { useEffect, useState } from "react";
import CardList from "@/app/card-sets/components/CardList";
import { Card } from "@/app/card-sets/components/interfaces/Card";
import { useSession } from "next-auth/react";

interface CollectionItem {
  _id: string;
  userId: string;
  cardId: string;
  quantity: number;
}

interface CardWithQuantity extends Card {
  quantity: number;
}

export default function YourCollectionPage() {
  const { data: session } = useSession();
  const [cards, setCards] = useState<CardWithQuantity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCollection = async () => {
      setLoading(true); // Start loading
      try {
        if (!session?.user?.email) {
          console.log("No session found. User not logged in.");
          setLoading(false);
          return;
        }

        // Fetch collection data along with the user and related card details
        const res = await fetch("/api/collection");
        if (!res.ok) {
          console.error(
            "Failed to fetch collection:",
            res.status,
            res.statusText
          );
          setLoading(false);
          return;
        }

        const collectionData = await res.json();

        // Fetch card details from Pokémon TCG API using Promise.all
        const cardsWithDetails = await Promise.all(
          collectionData.map(async (item: CollectionItem) => {
            const apiUrl = `https://api.pokemontcg.io/v2/cards/${item.cardId}`;
            const apiRes = await fetch(apiUrl, {
              headers: { "X-Api-Key": process.env.NEXT_PUBLIC_TCG_API || "" },
            });

            if (!apiRes.ok) {
              console.error(
                `Failed to fetch card details for ${item.cardId}:`,
                apiRes.status,
                apiRes.statusText
              );
              return null;
            }

            const apiData = await apiRes.json();
            return { ...apiData.data, quantity: item.quantity };
          })
        );

        const validCards = cardsWithDetails.filter(
          (card): card is CardWithQuantity => card !== null
        );
        setCards(validCards);
      } catch (error) {
        console.error("Failed to fetch collection:", error);
      } finally {
        setLoading(false); // set loading to false in finally
      }
    };

    fetchCollection();
  }, [session?.user?.email]);

  if (!session?.user) {
    return <div className="text-center text-red-500">Please log in first.</div>;
  }

  if (loading) {
    return <div className="text-center">Loading your collection...</div>;
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-4 text-center">Your Collection</h1>
      {cards.length === 0 ? (
        <p className="text-center">No cards in your collection yet.</p>
      ) : (
        <CardList cards={cards} />
      )}
    </div>
  );
}
