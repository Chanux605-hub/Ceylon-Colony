// backend/routes/postRoutes.js
import { Router } from "express";
import { upload } from "../config/cloudinary.js";
import {
  createPost,
  listShorts,
  addView,
  adminListPosts,
  adminUpdateStatus,
  adminDeletePost,
  adminStats,
  addLike, 
} from "../controllers/postController.js";

const router = Router();

// Public
router.post("/posts", upload.single("media"), createPost);
router.get("/shorts", listShorts);
router.patch("/posts/:id/view", addView);

// Admin (protect with auth later)
router.get("/admin/list", adminListPosts);
router.patch("/admin/posts/:id", adminUpdateStatus);
router.delete("/admin/posts/:id", adminDeletePost);
router.get("/admin/stats", adminStats);
router.patch("/posts/:id/like", addLike);

export default router;
