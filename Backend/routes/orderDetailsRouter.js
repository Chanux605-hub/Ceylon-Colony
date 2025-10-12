import express from "express";
import { createOrderDetails, listAllOrders, getUserOrders, getOrderById, updateOrderStatus } from "../controllers/orderDetailsController.js";

const orderDetailsRouter = express.Router();

// anyone can place order
orderDetailsRouter.post("/create", createOrderDetails);

// admin only (later secure with auth if needed)
orderDetailsRouter.get("/all", listAllOrders);
orderDetailsRouter.put("/update/:id", updateOrderStatus);

// logged-in users only (optional auth later)
orderDetailsRouter.post("/myorders", getUserOrders);
orderDetailsRouter.get("/:id", getOrderById);

export default orderDetailsRouter;
