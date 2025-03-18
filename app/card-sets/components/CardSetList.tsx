// app/card-sets/components/CardSetList.tsx
import React from "react";
import CardSetItem from "./CardSetItem";
import { CardSet } from "./interfaces/CardSet";

interface CardSetListProps {
  cardSets: CardSet[];
}

export default function CardSetList({ cardSets }: CardSetListProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {cardSets.map((set) => (
        <CardSetItem key={set.id} set={set} />
      ))}
    </div>
  );
}
