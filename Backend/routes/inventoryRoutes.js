import express from "express";
import {
  getAllInventory,
  getInventoryById,
  getInventoryByProductId,
  createInventory,
  updateInventory,
  updateStock,
  deleteInventory,
  getLowStockItems,
  getOutOfStockItems,
  getInventoryStats
} from "../controllers/inventoryController.js";

const router = express.Router();

// Get all inventory items
router.get("/", getAllInventory);

// Get inventory statistics
router.get("/stats", getInventoryStats);

// Get low stock items
router.get("/low-stock", getLowStockItems);

// Get out of stock items
router.get("/out-of-stock", getOutOfStockItems);

// Get inventory by product ID
router.get("/product/:productId", getInventoryByProductId);

// Get specific inventory item
router.get("/:id", getInventoryById);

// Create new inventory item
router.post("/", createInventory);

// Update inventory item
router.put("/:id", updateInventory);

// Update stock level only
router.patch("/:id/stock", updateStock);

// Delete inventory item
router.delete("/:id", deleteInventory);

export default router;
