// Backend/routes/analytics.routes.js
import express from "express";
import {
  dailyIncome,
  movementsOut,
  stockStatus,
  topMovers,
  bottomMovers,
  abcRevenue,
  kpis,
} from "../controllers/analytics.controller.js";

const router = express.Router();

router.get("/daily-income", dailyIncome);
router.get("/movements", movementsOut);
router.get("/stock-status", stockStatus);
router.get("/top-movers", topMovers);
router.get("/bottom-movers", bottomMovers);
router.get("/abc", abcRevenue);
router.get("/kpis", kpis);

export default router;