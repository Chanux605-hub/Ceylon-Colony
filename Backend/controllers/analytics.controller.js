// Backend/controllers/analytics.controller.js
import mongoose from "mongoose";
import OrderDetails from "../models/orderDetailsModel.js"; // this is the one you used in /api/orderdetails/create
import Inventory from "../models/Inventory.js";
import Product from "../models/Product.js";

function getDateRange(req) {
  // default: last 30 days
  const end = req.query.end ? new Date(req.query.end) : new Date();
  const start = req.query.start
    ? new Date(req.query.start)
    : new Date(end.getTime() - 29 * 24 * 60 * 60 * 1000);

  // normalize day boundaries
  start.setHours(0, 0, 0, 0);
  end.setHours(23, 59, 59, 999);
  return { start, end };
}

// ---------- /api/analytics/daily-income ----------
export const dailyIncome = async (req, res) => {
  try {
    const data = await OrderDetails.aggregate([
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$date" } // use schema `date`
          },
          value: { $sum: "$amount" },
          orders: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    console.log("📊 Daily Income raw:", data);

    res.json(
      data.map(d => ({
        date: d._id,
        value: d.value,
        orders: d.orders
      }))
    );
  } catch (err) {
    console.error("dailyIncome error:", err);
    res.status(500).json({ error: "Failed to calculate daily income" });
  }
};

// ---------- /api/analytics/movements (OUT only from orders) ----------
export async function movementsOut(req, res) {
  try {
    const { start, end } = getDateRange(req);

    const rows = await OrderDetails.aggregate([
      { $match: { createdAt: { $gte: start, $lte: end } } },
      { $unwind: "$items" },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          OUT: { $sum: "$items.quantity" },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // recharts shape (keep IN=0 for stacked bar)
    res.json(rows.map(r => ({ date: r._id, IN: 0, OUT: r.OUT })));
  } catch (err) {
    console.error("movementsOut error:", err);
    res.status(500).json({ message: "Failed to load movements" });
  }
}

// ---------- /api/analytics/stock-status (inventory snapshot) ----------
export async function stockStatus(_req, res) {
  try {
    const docs = await Inventory.find({}, "productId name category stock reorder").lean();
    res.json(docs);
  } catch (err) {
    console.error("stockStatus error:", err);
    res.status(500).json({ message: "Failed to load stock status" });
  }
}

// ---------- /api/analytics/top-movers ----------
export async function topMovers(req, res) {
  try {
    const limit = Math.max(1, Number(req.query.limit || 5));
    const { start, end } = getDateRange(req);

    const rows = await OrderDetails.aggregate([
      { $match: { createdAt: { $gte: start, $lte: end } } },
      { $unwind: "$items" },
      {
        $group: {
          _id: "$items.productId", // note: this is likely a string in order items
          units: { $sum: "$items.quantity" },
        },
      },
      { $sort: { units: -1 } },
      { $limit: limit },
      {
        $lookup: {
          from: "products",
          let: { pid: "$_id" },
          pipeline: [
            { $match: { $expr: { $eq: ["$_id", { $toObjectId: "$$pid" }] } } },
            { $project: { name: 1 } },
          ],
          as: "prod",
        },
      },
      {
        $project: {
          _id: 0,
          productId: "$_id",
          name: { $ifNull: [{ $arrayElemAt: ["$prod.name", 0] }, "Unknown"] },
          units: 1,
        },
      },
    ]);

    res.json(rows);
  } catch (err) {
    console.error("topMovers error:", err);
    res.status(500).json({ message: "Failed to load top movers" });
  }
}

// ---------- /api/analytics/bottom-movers ----------
export async function bottomMovers(req, res) {
  try {
    const limit = Math.max(1, Number(req.query.limit || 5));
    const { start, end } = getDateRange(req);

    const rows = await OrderDetails.aggregate([
      { $match: { createdAt: { $gte: start, $lte: end } } },
      { $unwind: "$items" },
      {
        $group: {
          _id: "$items.productId",
          units: { $sum: "$items.quantity" },
        },
      },
      { $sort: { units: 1 } },
      { $limit: limit },
      {
        $lookup: {
          from: "products",
          let: { pid: "$_id" },
          pipeline: [
            { $match: { $expr: { $eq: ["$_id", { $toObjectId: "$$pid" }] } } },
            { $project: { name: 1 } },
          ],
          as: "prod",
        },
      },
      {
        $project: {
          _id: 0,
          productId: "$_id",
          name: { $ifNull: [{ $arrayElemAt: ["$prod.name", 0] }, "Unknown"] },
          units: 1,
        },
      },
    ]);

    res.json(rows);
  } catch (err) {
    console.error("bottomMovers error:", err);
    res.status(500).json({ message: "Failed to load bottom movers" });
  }
}

// ---------- /api/analytics/abc (revenue by product) ----------
export async function abcRevenue(req, res) {
  try {
    const { start, end } = getDateRange(req);

    const rows = await OrderDetails.aggregate([
      { $match: { createdAt: { $gte: start, $lte: end } } },
      { $unwind: "$items" },
      {
        $group: {
          _id: "$items.productId",
          revenue: { $sum: { $multiply: ["$items.price", "$items.quantity"] } },
        },
      },
      { $sort: { revenue: -1 } },
      {
        $lookup: {
          from: "products",
          let: { pid: "$_id" },
          pipeline: [
            { $match: { $expr: { $eq: ["$_id", { $toObjectId: "$$pid" }] } } },
            { $project: { name: 1, sku: 1 } },
          ],
          as: "prod",
        },
      },
      {
        $project: {
          _id: 0,
          productId: "$_id",
          sku: { $ifNull: [{ $arrayElemAt: ["$prod.sku", 0] }, "-" ] },
          name: { $ifNull: [{ $arrayElemAt: ["$prod.name", 0] }, "Unknown"] },
          revenue: 1,
        },
      },
    ]);

    res.json(rows);
  } catch (err) {
    console.error("abcRevenue error:", err);
    res.status(500).json({ message: "Failed to load abc revenue" });
  }
}

// ---------- /api/analytics/kpis ----------
export async function kpis(req, res) {
  try {
    const { start, end } = getDateRange(req);

    // 1) On-hand units & value
    const withPrice = await Inventory.aggregate([
      {
        $lookup: {
          from: "products",
          localField: "productId",
          foreignField: "_id",
          as: "prod",
        },
      },
      { $unwind: { path: "$prod", preserveNullAndEmptyArrays: true } },
      {
        $project: {
          stock: 1,
          price: { $ifNull: ["$prod.price", 0] },
        },
      },
      {
        $group: {
          _id: null,
          onHandUnits: { $sum: "$stock" },
          onHandValue: { $sum: { $multiply: ["$stock", "$price"] } },
        },
      },
    ]);

    const onHandUnits = withPrice[0]?.onHandUnits || 0;
    const onHandValue = withPrice[0]?.onHandValue || 0;

    // 2) Total OUT last 30 days (units)
    const outRows = await OrderDetails.aggregate([
      { $match: { createdAt: { $gte: start, $lte: end } } },
      { $unwind: "$items" },
      {
        $group: {
          _id: null,
          units: { $sum: "$items.quantity" },
        },
      },
    ]);
    const totalOut = outRows[0]?.units || 0;
    const days = Math.max(1, Math.round((end - start) / (24 * 60 * 60 * 1000)) + 1);
    const avgDailyOut = totalOut / days;
    const doi = avgDailyOut > 0 ? Math.round(onHandUnits / avgDailyOut) : 0;

    // 3) Stockout rate (share of products with stock <= 0)
    const invCounts = await Inventory.aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          zero: { $sum: { $cond: [{ $lte: ["$stock", 0] }, 1, 0] } },
        },
      },
    ]);
    const totalItems = invCounts[0]?.total || 0;
    const zeroItems = invCounts[0]?.zero || 0;
    const stockoutRate = totalItems ? ((zeroItems / totalItems) * 100).toFixed(1) + "%" : "0%";

    // 4) Dead items (stock>0, no sales in last 90 days)
    const since = new Date(Date.now() - 89 * 24 * 60 * 60 * 1000);
    since.setHours(0, 0, 0, 0);
    const soldLast90 = await OrderDetails.aggregate([
      { $match: { createdAt: { $gte: since } } },
      { $unwind: "$items" },
      { $group: { _id: "$items.productId" } },
    ]);
    const soldSet = new Set(soldLast90.map(r => String(r._id)));
    const invDocs = await Inventory.find({}, "productId stock").lean();
    const deadItems = invDocs.filter(d => d.stock > 0 && !soldSet.has(String(d.productId))).length;

    res.json({
      onHandUnits,
      onHandValue,
      stockoutRate,
      doi,
      deadItems,
    });
  } catch (err) {
    console.error("kpis error:", err);
    res.status(500).json({ message: "Failed to load KPIs" });
  }
}