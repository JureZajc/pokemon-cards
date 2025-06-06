"use client";

import React, { useState, useEffect } from "react";
import CardList from "../card-sets/components/CardList";
import { useSearchParams, useRouter } from "next/navigation";
import { Card } from "@/app/card-sets/components/interfaces/Card";

export default function SearchPageClient() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState(searchParams.get("q") || "");
  const [searchResults, setSearchResults] = useState<Card[]>([]);
  const [localSearchTerm, setLocalSearchTerm] = useState(searchTerm);

  useEffect(() => {
    const fetchSearchResults = async () => {
      if (!searchTerm) {
        setSearchResults([]);
        return;
      }

      try {
        const response = await fetch(`/api/search?q=${searchTerm}`);
        if (!response.ok) {
          throw new Error(
            `Failed to fetch search results: ${response.status} ${response.statusText}`
          );
        }
        const data = await response.json();
        setSearchResults(data);
      } catch (error) {
        console.error("Error fetching search results:", error);
        setSearchResults([]);
      }
    };

    fetchSearchResults();
  }, [searchTerm]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setLocalSearchTerm(event.target.value);
  };

  const handleSearchSubmit = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      const newUrl = new URL(window.location.href);
      newUrl.searchParams.set("q", localSearchTerm);
      router.push(newUrl.toString());
      setSearchTerm(localSearchTerm);
    }
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-4 text-center">Search for Cards</h1>
      <div className="flex justify-center mb-4">
        <input
          type="text"
          placeholder="Enter card name"
          className="shadow appearance-none border rounded w-full py-2 px-3 text-white leading-tight focus:outline-none focus:shadow-outline"
          value={localSearchTerm}
          onChange={handleSearchChange}
          onKeyDown={handleSearchSubmit}
        />
      </div>
      <CardList cards={searchResults} />
    </div>
  );
}
