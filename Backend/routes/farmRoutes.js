import express from "express";
//import userAuth from "../middleware/userAuth.js"; //   if you want farm creation tied to logged-in user
import { registerFarm } from "../controllers/FarmController.js"; 

const farmRouter = express.Router();

// Register a new farm (POST request)
farmRouter.post("/register", registerFarm); 


export default farmRouter;
