// backend/routes/authRoutes.js
import express from "express";
import { signup, login } from "../controllers/authController.js";

const router = express.Router();

router.post("/signup", signup);   // ✅ /api/auth/signup
router.post("/login", login);     // ✅ /api/auth/login

export default router;