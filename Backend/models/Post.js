// backend/models/Post.js
import mongoose from "mongoose";

const AuthorSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  username: { type: String, required: true },
  avatarUrl: { type: String, default: "" },
}, { _id: false });

const PostSchema = new mongoose.Schema({
  contentType: { type: String, enum: ["short", "image", "review"], required: true },
  mediaType:   { type: String, enum: ["video", "image", null], default: null },
  mediaUrl:    { type: String, default: "" },
  posterUrl:   { type: String, default: "" },
  title:       { type: String, default: "" },
  description: { type: String, default: "" },
  tags:        [{ type: String }],
  productId:   { type: String, default: "" },

  author: { type: AuthorSchema, required: true },

  // moderation + visibility
  status: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: function () {
      return this.contentType === "review" ? "approved" : "pending";
    },
  },

  isPublic: { type: Boolean, default: true },

  // engagement
  views:         { type: Number, default: 0 },
  likes:         { type: Number, default: 0 },
  commentsCount: { type: Number, default: 0 },
}, { timestamps: true });

export default mongoose.model("Post", PostSchema);
