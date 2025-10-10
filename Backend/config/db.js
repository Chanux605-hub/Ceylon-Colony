// backend/db.js
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

export async function connectDB() {
  // fallback to hardcoded URI (for now), but prefer env
  const uri =
    process.env.MONGO_URI ||
    "mongodb+srv://Chanux:12345@cluster0.j6tlgyi.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

  const dbName = process.env.MONGO_DB || "ceylon_colony";

  try {
    mongoose.set("strictQuery", true);
    await mongoose.connect(uri, { dbName });
    console.log(`✅ MongoDB connected to database: ${dbName}`);
  } catch (e) {
    console.error("❌ MongoDB connection error:", e.message);
    process.exit(1);
  }
}
