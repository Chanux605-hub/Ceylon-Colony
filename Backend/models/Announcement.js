import mongoose from "mongoose";

const announcementSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    date: { type: String, required: true },   // store in ISO date format if possible
    time: { type: String, required: true },   // or use Date with combined datetime
    flyerUrl: { type: String },               // Cloudinary or uploads folder
    status: { type: String, enum: ["draft", "published"], default: "published" },
    createdBy: {
      userId: { type: String },
      username: { type: String },
    },
  },
  { timestamps: true }
);

export default mongoose.model("Announcement", announcementSchema);
