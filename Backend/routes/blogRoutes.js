import express from "express";
import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import { cloudinary } from "../config/cloudinary.js";
import { addBlog, getAllBlogs, getBlogById, updateBlog , deleteBlog} from "../controllers/blogController.js";

const blogRouter = express.Router();

// Storage engine for Cloudinary
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "blogs",
    allowed_formats: ["jpg", "png", "jpeg"],
  },
});

const upload = multer({ storage });

// Add a new blog
blogRouter.post("/add", upload.single("coverImage"), addBlog);

// Get all blogs
blogRouter.get("/", getAllBlogs);

// Get single blog
blogRouter.get("/:id", getBlogById);

//update blog
blogRouter.put("/update/:id", upload.single("coverImage"), updateBlog);

// Delete blog
blogRouter.delete("/delete/:id", deleteBlog);

export default blogRouter;
