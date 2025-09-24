import express from "express";
<<<<<<< HEAD
//import userAuth from "../middleware/userAuth.js"; //   if you want farm creation tied to logged-in user
import { getAllFarms, getFarmById, registerFarm } from "../controllers/farmController.js"; 

const farmRouter = express.Router();

// Register a new farm 
farmRouter.post("/register", registerFarm); 
//get farm details
farmRouter.get("/", getAllFarms);
farmRouter.get('/:id', getFarmById);

=======
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
>>>>>>> origin/Luhith

export default farmRouter;
