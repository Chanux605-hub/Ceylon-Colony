// backend/config/cloudinary.js
const { v2: cloudinary } = require("cloudinary");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const multer = require("multer");
require("dotenv").config();

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

const upload = multer({ storage });

module.exports = { cloudinary, upload };
