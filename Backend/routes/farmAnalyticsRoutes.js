import express from "express";
import { getFarmerAnalytics } from "../controllers/farmAnalyticsController.js";

const router = express.Router();

// GET /api/farm-analytics/:ownerId
router.get("/:ownerId", getFarmerAnalytics);

export default router;
