import express from "express";
// import userAuth from "../middleware/userAuth.js"; 
// (uncomment above if you want farm creation tied to logged-in user authentication)

import { 
  getAllFarms, 
  getFarmById, 
  registerFarm, 
  updateFarmStatus 
} from "../controllers/farmController.js";

const farmRouter = express.Router();

// Register a new farm
farmRouter.post("/register", registerFarm);

// Get all farms
farmRouter.get("/", getAllFarms);

// Get a single farm by ID
farmRouter.get("/:id", getFarmById);

// Update farm status (activate/deactivate/maintenance)
farmRouter.put("/:id/status", updateFarmStatus);

export default farmRouter;
