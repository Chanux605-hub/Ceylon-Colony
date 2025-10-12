import Product from "../models/Product.js";
import Order from "../models/orderModel.js";
import User from "../models/User.js";

// GET /api/analytics/dashboard
export async function getDashboard(req, res, next) {
  try {
    const [
      totalProducts,
      totalOrders,
      totalUsers,
      totalRevenue,
      recentOrders,
      topProducts
    ] = await Promise.all([
      Product.countDocuments(),
      Order.countDocuments(),
      User.countDocuments(),
      Order.aggregate([
        { $match: { status: { $ne: "cancelled" } } },
        { $group: { _id: null, total: { $sum: "$totalAmount" } } }
      ]),
      Order.find()
        .sort({ createdAt: -1 })
        .limit(5)
        .populate("userId", "name email")
        .select("orderNumber totalAmount status createdAt"),
      Product.find({ bestseller: true })
        .sort({ createdAt: -1 })
        .limit(5)
        .select("name price imageUrl category")
    ]);

    const revenue = totalRevenue.length > 0 ? totalRevenue[0].total : 0;

    res.json({
      stats: {
        totalProducts,
        totalOrders,
        totalUsers,
        totalRevenue: revenue
      },
      recentOrders,
      topProducts
    });
  } catch (err) {
    next(err);
  }
}

// GET /api/analytics/sales
export async function getSalesAnalytics(req, res, next) {
  try {
    const { period = "30d" } = req.query;
    
    let dateFilter = {};
    const now = new Date();
    
    switch (period) {
      case "7d":
        dateFilter = { createdAt: { $gte: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000) } };
        break;
      case "30d":
        dateFilter = { createdAt: { $gte: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000) } };
        break;
      case "90d":
        dateFilter = { createdAt: { $gte: new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000) } };
        break;
      case "1y":
        dateFilter = { createdAt: { $gte: new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000) } };
        break;
    }

    const salesData = await Order.aggregate([
      { $match: { ...dateFilter, status: { $ne: "cancelled" } } },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
            day: { $dayOfMonth: "$createdAt" }
          },
          totalSales: { $sum: "$totalAmount" },
          orderCount: { $sum: 1 }
        }
      },
      { $sort: { "_id.year": 1, "_id.month": 1, "_id.day": 1 } }
    ]);

    res.json({ salesData, period });
  } catch (err) {
    next(err);
  }
}

// GET /api/analytics/products
export async function getProductAnalytics(req, res, next) {
  try {
    const [
      categoryStats,
      priceStats,
      stockStats
    ] = await Promise.all([
      Product.aggregate([
        { $group: { _id: "$category", count: { $sum: 1 } } },
        { $sort: { count: -1 } }
      ]),
      Product.aggregate([
        {
          $group: {
            _id: null,
            avgPrice: { $avg: "$price" },
            minPrice: { $min: "$price" },
            maxPrice: { $max: "$price" }
          }
        }
      ]),
      Product.aggregate([
        {
          $group: {
            _id: null,
            totalStock: { $sum: "$stock" },
            lowStock: {
              $sum: {
                $cond: [{ $lt: ["$stock", 10] }, 1, 0]
              }
            }
          }
        }
      ])
    ]);

    res.json({
      categoryStats,
      priceStats: priceStats[0] || { avgPrice: 0, minPrice: 0, maxPrice: 0 },
      stockStats: stockStats[0] || { totalStock: 0, lowStock: 0 }
    });
  } catch (err) {
    next(err);
  }
}

// GET /api/analytics/users
export async function getUserAnalytics(req, res, next) {
  try {
    const [
      totalUsers,
      newUsers,
      activeUsers
    ] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({
        createdAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }
      }),
      User.countDocuments({
        lastLogin: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }
      })
    ]);

    res.json({
      totalUsers,
      newUsers,
      activeUsers
    });
  } catch (err) {
    next(err);
  }
}
