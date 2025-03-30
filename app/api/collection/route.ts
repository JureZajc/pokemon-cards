import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import Collection from "../../../models/Collection";
import { connectToDatabase } from "../../../lib/mongodb";
import User from "../../../models/User";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await connectToDatabase();

  try {
    const user = await User.findOne({ email: session.user.email });

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const userId = user._id;
    const collection = await Collection.find({
      userId: userId,
    }).lean();
    return NextResponse.json(collection);
  } catch (error) {
    console.error("Failed to fetch collection:", error);
    return NextResponse.json(
      { error: "Failed to fetch collection" },
      { status: 500 }
    );
  }
}
