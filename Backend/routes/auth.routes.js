import express from "express";
import {
  sendOtpEmail,
  sendOtpPhone,
  verifyOtp,
  resetPassword,
} from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/forgot-password/email", sendOtpEmail);
router.post("/forgot-password/phone", sendOtpPhone);
router.post("/verify-otp", verifyOtp);
router.post("/reset-password", resetPassword);

export default router;
