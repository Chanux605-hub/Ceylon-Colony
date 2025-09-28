import express from "express";
import {
  addHarvest,
  getHarvests,
  getHarvestsByFarm,   
  updateHarvest,
  deleteHarvest,
  getMonthlyHarvestTotal,
  getHarvestByMonth,
  getHarvestByFarm,
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

// Additional route for monthly total harvest
router.get("/monthly-total", getMonthlyHarvestTotal);

// Get harvests for the current month
router.get("/by-month", getHarvestByMonth);

// Get harvests for a specific farm
router.get("/by-farm", getHarvestByFarm);

export default router;
