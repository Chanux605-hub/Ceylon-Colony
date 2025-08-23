import express from "express";
import { registerHive } from "../controllers/hiveController.js";

const hiveRouter = express.Router();

// Register a new hive 
hiveRouter.post("/register", registerHive);

export default hiveRouter;
