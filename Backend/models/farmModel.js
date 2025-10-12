import mongoose from "mongoose";

const HIVE_TYPES = ["Langstroth", "Top-bar", "Warre", "Traditional Box"];
const STATUSES = ["Active", "Inactive", "Under Maintenance"];

const farmSchema = new mongoose.Schema(
  {
    farmId: {
      type: String,
      required: true,
      unique: true,
      index: true,
      trim: true,
    },

    // ✅ Foreign key link to user (farm owner)
    ownerId: {
      type: String,
      required: true,
      trim: true,
    },

    farmName: {
      type: String,
      required: true,
      trim: true,
    },

    owner: {
      type: String,
      required: true,
      trim: true,
    },

    phone: {
      type: String,
      required: true,
      trim: true,
      match: /^([+]?\d[\d\s-]{6,})$/,
    },

    email: {
      type: String,
      trim: true,
      lowercase: true,
      match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    },

    address: {
      type: String,
      required: true,
      trim: true,
    },

    district: {
      type: String,
      required: true,
      trim: true,
    },

    size: { type: Number, min: 0 },
    numHives: { type: Number, min: 0 },
    hiveTypes: { type: [String], enum: HIVE_TYPES, default: [] },
    flora: { type: String, trim: true },

    dateEstablished: { type: Date },
    status: { type: String, enum: STATUSES, default: "Active" },
    expectedAnnualYield: { type: Number, min: 0 },
  },
  { timestamps: true }
);

const farmModel = mongoose.models.Farm || mongoose.model("Farm", farmSchema);

export default farmModel;
export { HIVE_TYPES, STATUSES };
