// backend/models/notificationModel.js
import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    farmerId: { type: String, required: true },
    type: { type: String, enum: ["Reminder", "Alert"], required: true },
    title: { type: String, required: true },
    message: { type: String, required: true },
    relatedHive: { type: String },
    relatedFarm: { type: String },
    isRead: { type: Boolean, default: false }, // ✅ new field
  },
  { timestamps: true }
);

export default mongoose.models.Notification ||
  mongoose.model("Notification", notificationSchema);
