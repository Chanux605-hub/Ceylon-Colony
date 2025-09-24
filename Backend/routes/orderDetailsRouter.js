import express from "express";
import { createOrderDetails, listAllOrders, getUserOrders } from "../controllers/orderDetailsController.js";

const orderDetailsRouter = express.Router();

// anyone can place order
orderDetailsRouter.post("/create", createOrderDetails);

// admin only (later secure with auth if needed)
orderDetailsRouter.get("/all", listAllOrders);

// logged-in users only (optional auth later)
orderDetailsRouter.post("/myorders", getUserOrders);

export default orderDetailsRouter;
