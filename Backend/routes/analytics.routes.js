import express from "express";
import {
  getDashboard,
  getSalesAnalytics,
  getProductAnalytics,
  getUserAnalytics
} from "../controllers/analytics.controller.js";

const router = express.Router();

// Dashboard analytics
router.get("/dashboard", getDashboard);

// Sales analytics
router.get("/sales", getSalesAnalytics);

// Product analytics
router.get("/products", getProductAnalytics);

// User analytics
router.get("/users", getUserAnalytics);

export default router;
