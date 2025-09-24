// models/Workshop.js
import mongoose from "mongoose";

const workshopSchema = new mongoose.Schema(
  {
    workshopId: { type: String, unique: true }, // <-- important!
    title: { type: String, required: true, trim: true },
    date: { type: String, required: true },
    time: { type: String, required: true },
    duration: { type: String, required: true },
    level: { type: String, enum: ["Beginner", "Intermediate", "All Levels"], required: true },
    location: { type: String, required: true },
    price: { type: String, required: true }, // now string instead of number
    capacity: { type: Number, required: true, min: 1 },
    seatsTaken: { type: Number, default: 0, min: 0 },
    coverUrl: { type: String, default: "" },
    blurb: { type: String, default: "" },
    status: { type: String, enum: ["Draft", "Published", "Cancelled", "Completed"], default: "Draft" },
  },
  { timestamps: true }
);

export default mongoose.model("Workshop", workshopSchema);
