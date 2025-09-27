import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import Product from "../models/Product.js";
import Inventory from "../models/Inventory.js";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const currency = "usd";
const deliveryCharge = 5;
const frontend_URL = "http://localhost:5173";

async function reduceStockForItems(items) {
  for (const item of items) {
    // Find the product
    const product = await Product.findById(item.productId);
    if (!product || !product.inventoryId) continue;

    // Find linked inventory
    const inventory = await Inventory.findById(product.inventoryId);
    if (!inventory) continue;

    if (inventory.stock < item.quantity) {
      throw new Error(`Not enough stock for ${product.name}`);
    }

    inventory.stock -= item.quantity;
    await inventory.save();
  }
}


// Stripe order
const placeOrder = async (req, res) => {
  try {
    const newOrder = new orderModel({
      userId: req.body.userId,
      items: req.body.items,
      amount: req.body.amount,
      address: req.body.address,
    });
    await newOrder.save();
    await userModel.findByIdAndUpdate(req.body.userId, { cartData: {} });

    const line_items = req.body.items.map((item) => ({
      price_data: {
        currency: currency,
        product_data: {
          name: item.name,
        },
        unit_amount: item.price * 100,
      },
      quantity: item.quantity,
    }));

    line_items.push({
      price_data: {
        currency: currency,
        product_data: {
          name: "Delivery Charge",
        },
        unit_amount: deliveryCharge * 100,
      },
      quantity: 1,
    });

    const session = await stripe.checkout.sessions.create({
      success_url: `${frontend_URL}/verify?success=true&orderId=${newOrder._id}`,
      cancel_url: `${frontend_URL}/verify?success=false&orderId=${newOrder._id}`,
      line_items: line_items,
      mode: "payment",
    });

    res.json({ success: true, session_url: session.url });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};

const placeOrderCod = async (req, res) => {
  try {
    const newOrder = new orderModel({
      userId: req.body.userId,
      items: req.body.items,
      amount: req.body.amount,
      address: req.body.address,
      payment: true,
    });

    await newOrder.save();

    // 🔹 Reduce stock immediately
    await reduceStockForItems(req.body.items);

    await userModel.findByIdAndUpdate(req.body.userId, { cartData: {} });
    res.json({ success: true, message: "Order Placed Successfully!" });
  } catch (error) {
    console.error("❌ COD error:", error);
    res.json({ success: false, message: error.message || "Error placing order" });
  }
};

// Admin: list all
const listOrders = async (req, res) => {
  try {
    const orders = await orderModel.find({});
    res.json({ success: true, data: orders });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};

// User: list own
const userOrders = async (req, res) => {
  try {
    const orders = await orderModel.find({ userId: req.body.userId });
    res.json({ success: true, data: orders });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};

// Admin: update status
const updateStatus = async (req, res) => {
  try {
    await orderModel.findByIdAndUpdate(req.body.orderId, {
      status: req.body.status,
    });
    res.json({ success: true, message: "Status Updated" });
  } catch (error) {
    res.json({ success: false, message: "Error" });
  }
};

const verifyOrder = async (req, res) => {
  const { orderId, success } = req.body;
  try {
    if (success === "true") {
      const order = await orderModel.findById(orderId);
      if (order) {
        order.payment = true;
        await order.save();

        // 🔹 Reduce stock now that payment succeeded
        await reduceStockForItems(order.items);
      }
      res.json({ success: true, message: "Paid" });
    } else {
      await orderModel.findByIdAndDelete(orderId);
      res.json({ success: false, message: "Not Paid" });
    }
  } catch (error) {
    res.json({ success: false, message: "Not Verified" });
  }
};

export { placeOrder, listOrders, userOrders, updateStatus, verifyOrder, placeOrderCod };
