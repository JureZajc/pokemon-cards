'use client';

import React, {useEffect, useState} from "react";
import CardSetList from "./components/CardSetList";
import {CardSet} from "./components/interfaces/CardSet";

export default function CardSetsClient() {
    const [cardSets, setCardSets] = useState<CardSet[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchCardSets() {
            try {
                setLoading(true);
                setError(null);

                const response = await fetch('/api/card-sets');

                if (!response.ok) {
                    throw new Error(`Failed to fetch card sets: ${response.status}`);
                }

                const data = await response.json();
                setCardSets(data);
            } catch (err) {
                console.error('Error fetching card sets:', err);
                setError('Failed to load card sets. Please try again later.');
            } finally {
                setLoading(false);
            }
        }

        fetchCardSets();
    }, []);

    if (loading) {
        return (
            <div className="container mx-auto py-8">
                <h1 className="text-3xl font-bold mb-4 text-center">Pokémon Card Sets</h1>
                <div className="text-center py-8">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    <p className="mt-4 text-gray-600">Loading card sets...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container mx-auto py-8">
                <h1 className="text-3xl font-bold mb-4 text-center">Pokémon Card Sets</h1>
                <div className="text-center py-8">
                    <p className="text-red-600 mb-4">{error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto py-8">
            <h1 className="text-3xl font-bold mb-4 text-center">Pokémon Card Sets</h1>
            {cardSets.length === 0 ? (
                <div className="text-center py-8">
                    <p className="text-gray-600 mb-4">No card sets available at the moment.</p>
                    <p className="text-sm text-gray-500">Please try refreshing the page.</p>
                </div>
            ) : (
                <CardSetList cardSets={cardSets}/>
            )}
        </div>
    );
}
