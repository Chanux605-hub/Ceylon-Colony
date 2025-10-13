import mongoose from "mongoose";

// allowed quality levels for harvest
const HARVEST_QUALITIES = ["High", "Medium", "Low"];

const harvestSchema = new mongoose.Schema(
  {
    harvestId: {
      type: String,
      required: true,
      unique: true,
      index: true,
      trim: true,
    },

    // relations
    farmId: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    hiveId: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },

    date: {
      type: Date,
      required: true,
      default: Date.now,
    },

    quantity: {
      type: Number,
      required: true,
      min: 0,
    },

    quality: {
      type: String,
      enum: HARVEST_QUALITIES,
      required: true,
    },

    notes: {
      type: String,
      trim: true,
    },

    nextInspectionDate: {
      type: Date,
      required: false, // optional but useful
    },
  },
  { timestamps: true } // auto-manages createdAt & updatedAt
);

const harvestModel =
  mongoose.models.Harvest || mongoose.model("Harvest", harvestSchema);

export default harvestModel;
export { HARVEST_QUALITIES };
