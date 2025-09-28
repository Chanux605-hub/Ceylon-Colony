import express from "express";
import { 
  getAllFarms, 
  getFarmById, 
  registerFarm, 
  updateFarmStatus, 
  getFarmsByOwner, 
  updateFarm, 
  deleteFarm
} from "../controllers/farmController.js";

const farmRouter = express.Router();

// Register a new farm
farmRouter.post("/register", registerFarm);

// Get all farms
farmRouter.get("/", getAllFarms);

// Get all farms for a specific owner
farmRouter.get("/owner/:ownerId", getFarmsByOwner);

// Get a single farm by ID or farmId
farmRouter.get("/:id", getFarmById);

// Update farm status
farmRouter.put("/:id/status", updateFarmStatus);

// Update farm details
farmRouter.put("/:id", updateFarm);

// Delete a farm
farmRouter.delete("/:id", deleteFarm);

export default farmRouter;
