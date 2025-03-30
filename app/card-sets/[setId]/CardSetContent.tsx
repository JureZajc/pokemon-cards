"use client";

import React, { useState, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import CardList from "../components/CardList";
import { Card } from "../components/interfaces/Card";

export default function CardSetContent({ cards }: { cards: Card[] }) {
  const searchParams = useSearchParams();
  const name = searchParams.get("name") || "Unknown Set";

  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("price");
  const [sortOrder, setSortOrder] = useState("asc"); // ✅ Sorting order

  const filteredCards = useMemo(() => {
    let filtered = cards;

    if (search) {
      filtered = filtered.filter((card) =>
        card.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    filtered.sort((a, b) => {
      let valueA, valueB;

      if (sortBy === "price") {
        valueA = a.cardmarket?.prices?.averageSellPrice || 0;
        valueB = b.cardmarket?.prices?.averageSellPrice || 0;
      } else if (sortBy === "type") {
        valueA = a.supertype;
        valueB = b.supertype;
      }

      if ((valueA ?? 0) < (valueB ?? 0)) return sortOrder === "asc" ? -1 : 1;
      if ((valueA ?? 0) > (valueB ?? 0)) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [search, sortBy, sortOrder, cards]);

  // ✅ Toggles sorting order between asc and desc
  const toggleSortOrder = () => {
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-4 text-center">
        Cards in Set: {decodeURIComponent(name)}
      </h1>

      {/* Search & Sort Controls */}
      <div className="flex justify-between items-center mb-4">
        {/* Search Input */}
        <input
          type="text"
          placeholder="Search cards..."
          className="border p-2 rounded w-1/2"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {/* Sorting Controls */}
        <div className="flex items-center">
          <label htmlFor="sortBy" className="sr-only">
            Sort By
          </label>
          <select
            id="sortBy"
            className="border p-2 rounded mr-2"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="price">Sort by Price</option>
            <option value="type">Sort by Type</option>
          </select>

          {/* Toggle Sort Order Button */}
          <button onClick={toggleSortOrder} className="p-2 border rounded">
            {sortOrder === "asc" ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 3a1 1 0 01.707.293l4 4a1 1 0 01-1.414 1.414L11 6.414V17a1 1 0 11-2 0V6.414L6.707 8.707A1 1 0 015.293 7.293l4-4A1 1 0 0110 3z"
                  clipRule="evenodd"
                />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 17a1 1 0 01-.707-.293l-4-4a1 1 0 111.414-1.414L9 13.586V3a1 1 0 112 0v10.586l2.293-2.293a1 1 0 111.414 1.414l-4 4A1 1 0 0110 17z"
                  clipRule="evenodd"
                />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Card List */}
      <CardList cards={filteredCards} />
    </div>
  );
}
