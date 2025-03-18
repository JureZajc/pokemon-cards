import mongoose, { Schema, Document } from "mongoose";

export interface IWishlist extends Document {
  // Explicitly export the interface
  userId: mongoose.Schema.Types.ObjectId;
  cardId: string;
}

const WishlistSchema: Schema = new Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "User" },
  cardId: { type: String, required: true },
});

export default mongoose.models.Wishlist<IWishlist> ||
  mongoose.model<IWishlist>("Wishlist", WishlistSchema);
