import express from "express";
import { registerHive, getAllHives, getHiveStats, getHiveAlerts } from "../controllers/hiveController.js";

const hiveRouter = express.Router();

// Register a new hive 
hiveRouter.post("/register", registerHive);
hiveRouter.get("/", getAllHives);
hiveRouter.get("/stats", getHiveStats);
hiveRouter.get("/alerts", getHiveAlerts);

export default hiveRouter;
