import express from "express";
import {
  registerHive,
  getAllHives,
  getHiveStats,
  getHiveAlerts,
  getHivesByFarm,
  updateHive,
  getHiveById,
  deleteHive
} from "../controllers/hiveController.js";

const hiveRouter = express.Router();

// Register a new hive
hiveRouter.post("/register", registerHive);

// Get all hives
hiveRouter.get("/", getAllHives);

//  Get hives belonging to a specific farm
hiveRouter.get("/farm/:farmId", (req, res, next) => {
  console.log("➡️ Hive route hit with farmId:", req.params.farmId);
  next();
}, getHivesByFarm);

// Hive statistics
hiveRouter.get("/stats", getHiveStats);

// Hive alerts
hiveRouter.get("/alerts", getHiveAlerts);

//update hive
hiveRouter.put("/:id", updateHive);

// Get hive by ID
hiveRouter.get("/:id", getHiveById);

// Delete hive by ID
hiveRouter.delete("/:id", deleteHive);


export default hiveRouter;
