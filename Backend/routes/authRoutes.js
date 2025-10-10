// backend/routes/authRoutes.js
import express from "express";
import { signup, login, getMe, updateProfile, uploadAvatar, deleteAccount } from "../controllers/authController.js";
import { protect } from "../middleware/auth.js";
import upload from "../middleware/profileUpload.js";

const router = express.Router();

router.post("/signup", signup);   // ✅ /api/auth/signup
router.post("/login", login);     // ✅ /api/auth/login

// ✅ New routes
router.get("/me", protect, getMe);
router.put("/update", protect, updateProfile);
router.post("/avatar", protect, upload.single("avatar"), uploadAvatar);
router.delete("/delete-account", protect, deleteAccount);

export default router;
