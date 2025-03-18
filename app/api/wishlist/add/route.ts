import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route"; // Adjust path as needed
import { connectToDatabase } from "@/lib/mongodb";
import Wishlist from "@/models/Wishlist";
import type { IWishlist } from "@/models/Wishlist";
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

    // Check if the card is already in the wishlist
    let wishlistItem = await Wishlist.findOne({ userId, cardId });

    if (wishlistItem) {
      return NextResponse.json(
        { message: "Card is already in wishlist" },
        { status: 400 }
      );
    }

    // Create a new wishlist item
    const newWishlistItem: IWishlist = {
      userId,
      cardId,
    } as IWishlist;

    wishlistItem = new Wishlist(newWishlistItem);
    await wishlistItem.save();

    return NextResponse.json(
      { message: "Card added to wishlist" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error adding to wishlist:", error);
    return NextResponse.json(
      { message: "Failed to add card to wishlist" },
      { status: 500 }
    );
  }
}
