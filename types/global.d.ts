import mongoose from "mongoose";

declare global {
  interface Global {
    mongoose?: {
      conn: typeof mongoose | null;
      promise: Promise<typeof mongoose> | null;
    };
  }
}
