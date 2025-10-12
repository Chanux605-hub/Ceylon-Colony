// backend/db.js
import mongoose from "mongoose";

export async function connectDB() {
  const uri = process.env.MONGO_URI;
  const dbName = process.env.MONGO_DB || "ceylon_colony";

  if (!uri) {
    console.error("MONGO_URI is missing in .env");
    process.exit(1);
  }

  try {
    mongoose.set("strictQuery", true);
    await mongoose.connect(uri, { dbName });
    console.log("MongoDB connected");
  } catch (e) {
    console.error("MongoDB connection error:", e.message);
    process.exit(1);
  }
}
