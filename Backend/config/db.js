import mongoose from "mongoose";

const dburl =
  "mongodb+srv://Chanux:12345@cluster0.j6tlgyi.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0/ceylon_colony";

mongoose.set("strictQuery", true)

async function connection() {
  try {
    await mongoose.connect(dburl);
    console.log("MongoDB Connected");
  } catch (e) {
    console.error("MongoDB Connection Error:", e.message);
    process.exit(1);
  }
}

export default connection;   