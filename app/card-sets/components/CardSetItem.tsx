// app/card-sets/components/CardSetItem.tsx
import React from "react";
import Image from "next/image";
import Link from "next/link"; // Import Link
import { CardSet } from "./interfaces/CardSet"; // Import CardSet interface

interface CardSetItemProps {
  set: CardSet;
}

export default function CardSetItem({ set }: CardSetItemProps) {
  // Format release date to DD.MM.YYYY
  const releaseDate = new Date(set.releaseDate).toLocaleDateString("en-GB");

  return (
    <Link
      href={`/card-sets/${set.id}?name=${encodeURIComponent(set.name)}`} // Include set name in URL
      className="bg-white rounded-lg shadow-md p-4 flex flex-col items-center"
    >
      <Image
        src={set.images.logo}
        alt={`${set.name} Logo`}
        width={160}
        height={80}
        unoptimized={true}
        className="h-20 w-auto mb-2"
      />
      <h2 className="text-xl font-bold text-gray-800">{set.name}</h2>
      <p className="text-gray-600">Cards: {set.printedTotal}</p>
      <p className="text-gray-600">Release Date: {releaseDate}</p>
    </Link>
  );
}
