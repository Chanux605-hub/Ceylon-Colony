import express from "express";
import {
  addHarvest,
  getHarvests,
  getHarvestsByFarm,   // ✅ import it here
  updateHarvest,
  deleteHarvest,
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

export default router;
