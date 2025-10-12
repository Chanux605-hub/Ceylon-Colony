import express from "express";
//import userAuth from "../middleware/userAuth.js"; //   if you want farm creation tied to logged-in user
import { getAllFarms, getFarmById, registerFarm } from "../controllers/farmController.js"; 

const farmRouter = express.Router();

// Register a new farm 
farmRouter.post("/register", registerFarm); 
//get farm details
farmRouter.get("/", getAllFarms);
farmRouter.get('/:id', getFarmById);


export default farmRouter;
