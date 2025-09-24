import express from "express";
<<<<<<< HEAD
import { registerHive } from "../controllers/hiveController.js";
=======
import { registerHive, getAllHives, getHiveStats, getHiveAlerts } from "../controllers/hiveController.js";
>>>>>>> origin/Luhith

const hiveRouter = express.Router();

// Register a new hive 
hiveRouter.post("/register", registerHive);
<<<<<<< HEAD
=======
hiveRouter.get("/", getAllHives);
hiveRouter.get("/stats", getHiveStats);
hiveRouter.get("/alerts", getHiveAlerts);
>>>>>>> origin/Luhith

export default hiveRouter;
