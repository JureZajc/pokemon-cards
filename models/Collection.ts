import mongoose, { Schema, Document } from "mongoose";

export interface ICollection extends Document {
  // Explicitly export the interface
  userId: mongoose.Schema.Types.ObjectId;
  cardId: string;
  quantity: number;
}

const CollectionSchema: Schema = new Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "User" },
  cardId: { type: String, required: true },
  quantity: { type: Number, required: true, default: 1 },
});

export default mongoose.models.Collection<ICollection> ||
  mongoose.model<ICollection>("Collection", CollectionSchema);
