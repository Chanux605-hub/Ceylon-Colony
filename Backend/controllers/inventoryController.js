import Inventory from "../models/Inventory.js";
import Product from "../models/Product.js";

// GET /api/inventory - Get all inventory items with product details
export async function getAllInventory(req, res, next) {
  try {
    const { status, lowStock, page = 1, limit = 20 } = req.query;
    
    const filter = {};
    if (status) filter.stockStatus = status;
    if (lowStock === "true") filter.isLowStock = true;
    
    const pageNum = Math.max(1, Number(page));
    const pageSize = Math.max(1, Number(limit));
    const skip = (pageNum - 1) * pageSize;
    
    const [items, total] = await Promise.all([
      Inventory.find(filter)
        .populate("productId", "name category price imageUrl status")
        .sort({ lastUpdated: -1 })
        .skip(skip)
        .limit(pageSize),
      Inventory.countDocuments(filter)
    ]);
    
    res.json({
      items,
      total,
      page: pageNum,
      limit: pageSize,
      pagination: {
        totalPages: Math.ceil(total / pageSize),
        hasNext: pageNum < Math.ceil(total / pageSize),
        hasPrev: pageNum > 1
      }
    });
  } catch (err) {
    next(err);
  }
}

// GET /api/inventory/:id - Get specific inventory item
export async function getInventoryById(req, res, next) {
  try {
    const inventory = await Inventory.findById(req.params.id)
      .populate("productId", "name category price imageUrl status description");
    
    if (!inventory) {
      return res.status(404).json({ message: "Inventory item not found" });
    }
    
    res.json(inventory);
  } catch (err) {
    next(err);
  }
}

// GET /api/inventory/product/:productId - Get inventory by product ID
export async function getInventoryByProductId(req, res, next) {
  try {
    const inventory = await Inventory.findOne({ productId: req.params.productId })
      .populate("productId", "name category price imageUrl status");
    
    if (!inventory) {
      return res.status(404).json({ message: "Inventory not found for this product" });
    }
    
    res.json(inventory);
  } catch (err) {
    next(err);
  }
}

// POST /api/inventory - Create new inventory item (usually auto-created)
export async function createInventory(req, res, next) {
  try {
    const { productId, currentStock = 0, lowStockThreshold = 10, highStockThreshold = 100, location = "Warehouse", notes = "" } = req.body;
    
    if (!productId) {
      return res.status(400).json({ message: "Product ID is required" });
    }
    
    // Check if product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    
    // Check if inventory already exists for this product
    const existingInventory = await Inventory.findOne({ productId });
    if (existingInventory) {
      return res.status(400).json({ message: "Inventory already exists for this product" });
    }
    
    const inventory = await Inventory.create({
      productId,
      currentStock,
      lowStockThreshold,
      highStockThreshold,
      location,
      notes
    });
    
    const populatedInventory = await Inventory.findById(inventory._id)
      .populate("productId", "name category price imageUrl status");
    
    res.status(201).json(populatedInventory);
  } catch (err) {
    next(err);
  }
}

// PUT /api/inventory/:id - Update inventory item
export async function updateInventory(req, res, next) {
  try {
    const { currentStock, lowStockThreshold, highStockThreshold, location, notes } = req.body;
    
    const updates = {};
    if (currentStock !== undefined) updates.currentStock = Math.max(0, Number(currentStock));
    if (lowStockThreshold !== undefined) updates.lowStockThreshold = Math.max(0, Number(lowStockThreshold));
    if (highStockThreshold !== undefined) updates.highStockThreshold = Math.max(0, Number(highStockThreshold));
    if (location !== undefined) updates.location = location;
    if (notes !== undefined) updates.notes = notes;
    
    const inventory = await Inventory.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true, runValidators: true }
    ).populate("productId", "name category price imageUrl status");
    
    if (!inventory) {
      return res.status(404).json({ message: "Inventory item not found" });
    }
    
    res.json(inventory);
  } catch (err) {
    next(err);
  }
}

// PATCH /api/inventory/:id/stock - Update only stock level
export async function updateStock(req, res, next) {
  try {
    const { currentStock, action, quantity } = req.body;
    
    const inventory = await Inventory.findById(req.params.id);
    if (!inventory) {
      return res.status(404).json({ message: "Inventory item not found" });
    }
    
    let newStock = inventory.currentStock;
    
    if (currentStock !== undefined) {
      newStock = Math.max(0, Number(currentStock));
    } else if (action && quantity !== undefined) {
      const qty = Math.max(0, Number(quantity));
      switch (action) {
        case "add":
        case "restock":
          newStock = inventory.currentStock + qty;
          inventory.lastRestocked = new Date();
          break;
        case "subtract":
        case "sell":
          newStock = Math.max(0, inventory.currentStock - qty);
          break;
        case "set":
          newStock = qty;
          break;
        default:
          return res.status(400).json({ message: "Invalid action. Use: add, subtract, set" });
      }
    } else {
      return res.status(400).json({ message: "Either currentStock or action+quantity required" });
    }
    
    inventory.currentStock = newStock;
    await inventory.save();
    
    const updatedInventory = await Inventory.findById(inventory._id)
      .populate("productId", "name category price imageUrl status");
    
    res.json(updatedInventory);
  } catch (err) {
    next(err);
  }
}

// DELETE /api/inventory/:id - Delete inventory item
export async function deleteInventory(req, res, next) {
  try {
    const inventory = await Inventory.findByIdAndDelete(req.params.id);
    if (!inventory) {
      return res.status(404).json({ message: "Inventory item not found" });
    }
    
    res.json({ message: "Inventory item deleted successfully" });
  } catch (err) {
    next(err);
  }
}

// GET /api/inventory/low-stock - Get all low stock items
export async function getLowStockItems(req, res, next) {
  try {
    const items = await Inventory.find({ isLowStock: true })
      .populate("productId", "name category price imageUrl status")
      .sort({ currentStock: 1 });
    
    res.json({ items, count: items.length });
  } catch (err) {
    next(err);
  }
}

// GET /api/inventory/out-of-stock - Get all out of stock items
export async function getOutOfStockItems(req, res, next) {
  try {
    const items = await Inventory.find({ isOutOfStock: true })
      .populate("productId", "name category price imageUrl status")
      .sort({ lastUpdated: -1 });
    
    res.json({ items, count: items.length });
  } catch (err) {
    next(err);
  }
}

// GET /api/inventory/stats - Get inventory statistics
export async function getInventoryStats(req, res, next) {
  try {
    const [
      totalItems,
      lowStockCount,
      outOfStockCount,
      totalStockValue,
      categoryStats
    ] = await Promise.all([
      Inventory.countDocuments(),
      Inventory.countDocuments({ isLowStock: true }),
      Inventory.countDocuments({ isOutOfStock: true }),
      Inventory.aggregate([
        {
          $lookup: {
            from: "products",
            localField: "productId",
            foreignField: "_id",
            as: "product"
          }
        },
        {
          $unwind: "$product"
        },
        {
          $group: {
            _id: null,
            totalValue: {
              $sum: { $multiply: ["$currentStock", "$product.price"] }
            }
          }
        }
      ]),
      Inventory.aggregate([
        {
          $lookup: {
            from: "products",
            localField: "productId",
            foreignField: "_id",
            as: "product"
          }
        },
        {
          $unwind: "$product"
        },
        {
          $group: {
            _id: "$product.category",
            count: { $sum: 1 },
            totalStock: { $sum: "$currentStock" }
          }
        },
        { $sort: { count: -1 } }
      ])
    ]);
    
    res.json({
      totalItems,
      lowStockCount,
      outOfStockCount,
      totalStockValue: totalStockValue[0]?.totalValue || 0,
      categoryStats
    });
  } catch (err) {
    next(err);
  }
}
