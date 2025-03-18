// app/api/search/route.ts
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const searchTerm = searchParams.get("q");

    if (!searchTerm) {
      return NextResponse.json(
        { message: "Search term is required" },
        { status: 400 }
      );
    }

    const apiKey = process.env.TCG_API;
    if (!apiKey) {
      throw new Error("TCG_API key is not defined in environment variables.");
    }

    // Fetch all cards matching name like this https://api.pokemontcg.io/v2/cards?q=name:Charizard
    const apiUrl = `https://api.pokemontcg.io/v2/cards?q=name:${searchTerm}`;

    const res = await fetch(apiUrl, {
      headers: {
        "X-Api-Key": apiKey,
      },
    });

    if (!res.ok) {
      throw new Error(
        `Failed to fetch search results: ${res.status} ${res.statusText}`
      );
    }

    const data = await res.json();
    return NextResponse.json(data.data);
  } catch (error) {
    console.error("Error fetching search results:", error);
    return NextResponse.json(
      { message: "Failed to fetch search results" },
      { status: 500 }
    );
  }
}
