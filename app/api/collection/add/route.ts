// app/api/collection/add/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectToDatabase } from "@/lib/mongodb";
import Collection from "@/models/Collection"; // Import the model
import type { ICollection } from "@/models/Collection"; // Import the interface
import User from "@/models/User"; // Import User model

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    await connectToDatabase();

    const { cardId } = await request.json();

    console.log(session.user.email);

    // Get User ID by email
    const user = await User.findOne({ email: session.user.email });

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const userId = user._id;

    // Check if the card is already in the collection
    let collectionItem = await Collection.findOne({ userId, cardId });

    if (collectionItem) {
      // If it exists, increment the quantity
      collectionItem.quantity += 1;
      await collectionItem.save();
    } else {
      // If it doesn't exist, create a new collection item
      const newCollectionItem: ICollection = {
        // use interface
        userId,
        cardId,
        quantity: 1, // Set the quantity (required by the interface)
      } as ICollection;
      collectionItem = new Collection(newCollectionItem); // Pass as argument
      await collectionItem.save();
    }

    return NextResponse.json(
      { message: "Card added to collection" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error adding to collection:", error);
    return NextResponse.json(
      { message: "Failed to add card to collection" },
      { status: 500 }
    );
  }
}
