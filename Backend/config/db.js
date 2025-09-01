import mongoose from "mongoose";
<<<<<<< HEAD

const dburl =
  "mongodb+srv://Chanux:12345@cluster0.j6tlgyi.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0/ceylon_colony";
=======
import dotenv from "dotenv";
dotenv.config();

const dburl =
  "mongodb+srv://Chanux:12345@cluster0.j6tlgyi.mongodb.net/ceylon_colony?retryWrites=true&w=majority&appName=Cluster0";
>>>>>>> origin/Gima

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