import mongoose from "mongoose";

const counterSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  seq: { type: Number, default: 100 }, // start at 100
});

export default mongoose.model("Counter", counterSchema);