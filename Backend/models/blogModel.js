import mongoose from "mongoose";

const CATEGORIES = ["Health", "Recipes", "Beekeeping", "News", "Workshops"];
const STATUSES = ["Draft", "Published", "Archived"];

const blogSchema = new mongoose.Schema(
  {
    blogId: {
      type: String,
      required: true,
      unique: true,
      index: true,
      trim: true,
    },

    // TEMP: use String until you connect real User/Admin model
    authorId: {
      type: String,
      required: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    content: {
      type: String,
      required: true,
    },

    coverImage: {
      type: String, // URL or file path
      trim: true,
    },

    category: {
      type: String,
      enum: CATEGORIES,
      default: "News",
    },

    tags: {
      type: [String],
      default: [],
    },

    status: {
      type: String,
      enum: STATUSES,
      default: "Draft",
    },

    publishedAt: {
      type: Date,
    },
  },
  { timestamps: true } // createdAt & updatedAt
);

const blogModel = mongoose.models.Blog || mongoose.model("Blog", blogSchema);

export default blogModel;
export { CATEGORIES, STATUSES };
