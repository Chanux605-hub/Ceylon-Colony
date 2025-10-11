import express from "express";
import {
  addHarvest,
  getHarvests,
  getHarvestsByFarm,   
  updateHarvest,
  deleteHarvest,
  getHarvestByMonth,
  getHarvestByFarm,
  getHarvestByFarmAdvanced,
  getMonthlyHarvestTotal,
  getHarvestInsights,
} from "../controllers/harvestController.js";

const router = express.Router();

// Add harvest
router.post("/add", addHarvest);

// Get all harvests
router.get("/", getHarvests);

// Get harvests by farmId
router.get("/farm/:farmId", getHarvestsByFarm);

// Update harvest by id
router.put("/:id", updateHarvest);

// Delete harvest by id
router.delete("/:id", deleteHarvest);

// Get harvests for the current month
router.get("/by-month", getHarvestByMonth);

// Get harvests for a specific farm
router.get("/by-farm", getHarvestByFarm);

// Get advanced harvests by farm (with hive & farm names)
router.get("/by-farm-advanced", getHarvestByFarmAdvanced);

//get total harvest
router.get("/monthly-total", getMonthlyHarvestTotal);

// Get overall harvest insights
router.get("/insights", getHarvestInsights);

export default router;
