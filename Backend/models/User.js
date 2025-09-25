import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    userId: { type: String, unique: true }, // e.g., U100, U101
    name: { type: String, required: true },
    address: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    avatarUrl: { type: String, default: "" },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
