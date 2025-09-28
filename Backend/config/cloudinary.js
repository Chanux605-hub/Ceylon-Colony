// backend/config/cloudinary.js
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import multer from "multer";
import dotenv from "dotenv";

dotenv.config();

// ✅ Use env variables (safer than hardcoding)
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || "db85cz6n5",
  api_key: process.env.CLOUDINARY_API_KEY || "346278295516763",
  api_secret: process.env.CLOUDINARY_API_SECRET || "9sNKw6P-n6FXlI7T7MezZQhJTjw",
});

// 🔹 Default storage (for posts/media)
const storage = new CloudinaryStorage({
  cloudinary,
  params: (req, file) => ({
    folder: "ceylon_colony/posts",
    resource_type: file.mimetype.startsWith("video/") ? "video" : "image",
    public_id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
  }),
});

// 🔹 Separate storage for flyers
const flyerStorage = new CloudinaryStorage({
  cloudinary,
  params: (req, file) => ({
    folder: "ceylon_colony/flyers",
    resource_type: "image", // flyers are images
    public_id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
  }),
});

export const upload = multer({ storage });
export const uploadFlyers = multer({ storage: flyerStorage });
export { cloudinary };
