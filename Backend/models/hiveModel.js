import mongoose from "mongoose";

// allowed enums
const HIVE_TYPES = ["Langstroth", "Top-bar", "Warre", "Traditional Box"];
const MATERIALS = ["Wood", "Plastic", "Clay", "Other"];
const STATUSES = ["Active", "Dormant", "Needs Attention", "Retired"];
const STRENGTHS = ["Strong", "Medium", "Weak"];
const COLONY_SOURCES = ["Swarm", "Split", "Purchased", "Other"];

const hiveSchema = new mongoose.Schema(
  {
    // auto-generated in frontend
    hiveId: {
      type: String,
      required: true,
      unique: true,
      index: true,
      trim: true,
    },

    // link hive to farm
    farmId: {
      type: String, // or mongoose.Schema.Types.ObjectId if you want relation
      required: true,
      trim: true,
      ref: "Farm",
    },

    // Hive Basic Info
    hiveName: { type: String, required: true, trim: true },
    location: { type: String, trim: true }, // location within farm

    hiveType: { type: String, enum: HIVE_TYPES, required: true },
    material: { type: String, enum: MATERIALS, required: true },
    dateEstablished: { type: Date },

    // Bee Colony Info
    beeSpecies: { type: String, trim: true },
    queenId: { type: String, trim: true },
    colonyStrength: { type: String, enum: STRENGTHS },
    colonySource: { type: [String], enum: COLONY_SOURCES, default: [] },

    // Operational Info
    status: { type: String, enum: STATUSES, default: "Active" },
    expectedYield: { type: Number, min: 0 },
    flora: { type: String, trim: true },

    // Inspections
    lastInspection: { type: Date },
    nextInspection: { type: Date },
    notes: { type: String, trim: true },

    // Audit
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
  { timestamps: true } // auto-manages createdAt & updatedAt
);

const hiveModel =
  mongoose.models.Hive || mongoose.model("Hive", hiveSchema);

export default hiveModel;
export { HIVE_TYPES, MATERIALS, STATUSES, STRENGTHS, COLONY_SOURCES };
