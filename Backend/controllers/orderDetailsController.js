
import orderDetailsModel from "../models/orderDetailsModel.js";
import Inventory from "../models/Inventory.js";


export const createOrderDetails = async (req, res) => {
  try {
    const { userId, items, amount, address, paymentMethod } = req.body;
       console.log("📦 Incoming Order Data:", req.body);  // 👈 add this

    if (!items || items.length === 0) {
      return res.status(400).json({ success: false, message: "No items in order" });
    }

    // 1️⃣ Save new order
    const newOrder = new orderDetailsModel({
      userId: userId || "guest",
      items,
      amount,
      address,
      paymentMethod,
    });

    await newOrder.save();

    // 2️⃣ Reduce stock in Inventory
    for (const item of items) {
      const inv = await Inventory.findOne({ productId: item.productId });
      if (inv) {
        inv.stock = Math.max(0, inv.stock - item.quantity);
        await inv.save();
      }
    }

    res.json({ success: true, message: "Order placed successfully", order: newOrder });
  } catch (error) {
    console.error("❌ Error creating order:", error);
    res.status(500).json({ success: false, message: "Error placing order" });
  }
};


// Get all orders (for admin)
export const listAllOrders = async (req, res) => {
  try {
    const orders = await orderDetailsModel.find().sort({ date: -1 });
    res.json({ success: true, data: orders });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching orders" });
  }
};

// Get user-specific orders
export const getUserOrders = async (req, res) => {
  try {
    const { userId } = req.body;
    const orders = await orderDetailsModel.find({ userId }).sort({ date: -1 });
    res.json({ success: true, data: orders });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching user orders" });
  }
};
