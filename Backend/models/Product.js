import mongoose from "mongoose";

// Sub-schema for product images
const imageSchema = new mongoose.Schema(
  {
    url: { type: String, trim: true, required: true }, // must have a URL
    alt: { type: String, trim: true, default: "" },    // optional alt text
  },
  { _id: false }
);

// Sub-schema for ratings
const ratingSchema = new mongoose.Schema(
  {
    average: { type: Number, default: 0, min: 0, max: 5 },
    count: { type: Number, default: 0, min: 0 },
  },
  { _id: false }
);

// Main Product schema
const productSchema = new mongoose.Schema(
  {
    // Basic info
    name: { type: String, required: true, trim: true },
    category: { type: String, trim: true },
    weight: { type: String, trim: true },
    price: { type: Number, required: true, min: 1 },
    status: {
      type: String,
      enum: ["Active", "Draft", "Archived"],
      default: "Active",
      trim: true,
    },

    // Primary image
    imageUrl: { type: String, trim: true },

    // Extra details
    images: { type: [imageSchema], default: [] },
    description: { type: String, default: "" },
    tags: { type: [String], default: [] },
    sku: { type: String, trim: true, default: "" },

    // Stock info
    inStock: { type: Boolean, default: true },
    stock: { type: Number, default: 0, min: 0 },

    // Extras
    attributes: { type: mongoose.Schema.Types.Mixed, default: {} },
    rating: { type: ratingSchema, default: () => ({}) },
    bestseller: { type: Boolean, default: false },

    // ✅ Link product to Inventory
    inventoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Inventory",
      default: null,
    },
  },
  { timestamps: true }
);

// Transform output when converting to JSON
productSchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: (_doc, ret) => {
    if (ret._id) {
      ret.id = ret._id.toString(); // expose id
    }
    delete ret._id; // hide _id
  },
});

const Product = mongoose.model("Product", productSchema);
export default Product;