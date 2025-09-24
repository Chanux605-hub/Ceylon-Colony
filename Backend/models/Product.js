import mongoose from "mongoose";

<<<<<<< HEAD
// Sub-schema for product images
const imageSchema = new mongoose.Schema(
  {
    url: { type: String, trim: true, required: true }, // must have a URL
    alt: { type: String, trim: true, default: "" },    // optional alt text
=======
const imageSchema = new mongoose.Schema(
  {
    url: { type: String, trim: true, required: true },
    alt: { type: String, trim: true, default: "" },
>>>>>>> origin/Luhith
  },
  { _id: false }
);

<<<<<<< HEAD
// Sub-schema for ratings
=======
>>>>>>> origin/Luhith
const ratingSchema = new mongoose.Schema(
  {
    average: { type: Number, default: 0, min: 0, max: 5 },
    count: { type: Number, default: 0, min: 0 },
  },
  { _id: false }
);

<<<<<<< HEAD
// Main Product schema
const productSchema = new mongoose.Schema(
  {
    // Basic info
    name: { type: String, required: true, trim: true },
    category: { type: String, trim: true },
    weight: { type: String, trim: true },
    price: { type: Number, required: true, min: 0 },
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
=======
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
>>>>>>> origin/Luhith
  },
  { timestamps: true }
);

<<<<<<< HEAD
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
=======
productSchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: (_doc, ret) => { delete ret._id; }
>>>>>>> origin/Luhith
});

const Product = mongoose.model("Product", productSchema);
export default Product;
