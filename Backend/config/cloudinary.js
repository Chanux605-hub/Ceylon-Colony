// backend/config/cloudinary.js
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import multer from "multer";
import dotenv from "dotenv";

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary,
  params: (req, file) => ({
    folder: "ceylon_colony/posts",
    resource_type: file.mimetype.startsWith("video/") ? "video" : "image",
    public_id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
  }),
});

// 🔹 Storage for flyers (new)
const flyerStorage = new CloudinaryStorage({
  cloudinary,
  params: (req, file) => ({
    folder: "ceylon_colony/flyers",  // keep flyers in a separate folder
    resource_type: "image",          // flyers are always images
    public_id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
  }),
});

export const upload = multer({ storage });
export const uploadFlyers = multer({ storage: flyerStorage });
export { cloudinary };