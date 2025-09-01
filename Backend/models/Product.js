import mongoose from "mongoose";

const imageSchema = new mongoose.Schema(
  {
    url: { type: String, trim: true, required: true },
    alt: { type: String, trim: true, default: "" },
  },
  { _id: false }
);

const ratingSchema = new mongoose.Schema(
  {
    average: { type: Number, default: 0, min: 0, max: 5 },
    count: { type: Number, default: 0, min: 0 },
  },
  { _id: false }
);

const productSchema = new mongoose.Schema(
  {
    // --- catalogue (what you already had) ---
    name:     { type: String, required: true, trim: true },
    category: { type: String, trim: true },
    weight:   { type: String, trim: true },
    price:    { type: Number, required: true, min: 0 },
    status:   { type: String, default: "Active", trim: true },
    imageUrl: { type: String, trim: true }, // cover image for grids

    // --- details (new, all optional) ---
    images:      { type: [imageSchema], default: [] }, // gallery 3-4 images
    description: { type: String, default: "" },        // long copy
    tags:        { type: [String], default: [] },      // ["raw-honey", "gift"]
    sku:         { type: String, trim: true, default: "" },
    inStock:     { type: Boolean, default: true },     // or use stock: Number
    stock:       { type: Number, default: 0, min: 0 }, // optional precise stock
    attributes:  { type: mongoose.Schema.Types.Mixed, default: {} }, // free-form
    rating:      { type: ratingSchema, default: () => ({}) },
    bestseller:  { type: Boolean, default: false },
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
