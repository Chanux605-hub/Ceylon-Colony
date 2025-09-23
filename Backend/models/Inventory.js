import mongoose from "mongoose";

const inventorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    category: { type: String, trim: true },
    source: { type: String, enum: ["In-house", "Outsourced"], default: "In-house" }, // ✅ new
    stock: { type: Number, default: 0, min: 0 },
    reorder: { type: Number, default: 0, min: 0 },
    img: { type: String, trim: true, default: "" }, // ✅ new
  },
  { timestamps: true }
);

inventorySchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: (_doc, ret) => {
    ret.id = ret._id.toString();
    delete ret._id;
  },
});

const Inventory = mongoose.model("Inventory", inventorySchema);
export default Inventory;
