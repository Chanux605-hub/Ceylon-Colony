import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name:     { type: String, required: true, trim: true },
    category: { type: String, trim: true },
    weight:   { type: String, trim: true },
    price:    { type: Number, required: true, min: 0 },
    status:   { type: String, default: "Active", trim: true },
    imageUrl: { type: String, trim: true }
  },
  { timestamps: true }
);

productSchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: (_doc, ret) => { delete ret._id; }
});

const Product = mongoose.model("Product", productSchema);
export default Product;
