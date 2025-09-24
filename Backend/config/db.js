import mongoose from "mongoose";
import dotenv from "dotenv";
<<<<<<< HEAD
dotenv.config();

const dburl =
  "mongodb+srv://Chanux:12345@cluster0.j6tlgyi.mongodb.net/ceylon_colony?retryWrites=true&w=majority&appName=Cluster0";
=======

dotenv.config();



const dburl= "mongodb+srv://Chanux:12345@cluster0.j6tlgyi.mongodb.net/ceylon_colony?retryWrites=true&w=majority&appName=Cluster0"
>>>>>>> origin/Luhith

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