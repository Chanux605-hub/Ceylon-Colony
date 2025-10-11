import mongoose from "mongoose";
import harvestModel from "../models/harvestModel.js";
import hiveModel from "../models/hiveModel.js";
import farmModel from "../models/farmModel.js";


// Add Harvest 
export const addHarvest = async (req, res) => {
  try {
    const { farmId, hiveId, date, quantity, quality, notes } = req.body;

    // validation
    if (!farmId || !hiveId || !date || !quantity || !quality) {
      return res.status(400).json({
        success: false,
        message: "Please provide farmId, hiveId, date, quantity, and quality",
      });
    }

    // auto generate unique harvestId
    const harvestId = `HAR-${Date.now()}`;

    const newHarvest = await harvestModel.create({
      harvestId,
      farmId,
      hiveId,
      date,
      quantity,
      quality,
      notes,
    });

    return res.status(201).json({
      success: true,
      message: "Harvest record added successfully",
      harvest: newHarvest,
    });
  } catch (err) {
    console.error("Error adding harvest:", err);
    return res.status(500).json({
      success: false,
      message: "Server error while adding harvest",
    });
  }
};

// Get all harvests with farm + hive info
export const getHarvests = async (req, res) => {
  try {
    const harvests = await harvestModel.find().lean();

    // join manually
    const farms = await farmModel.find().lean();
    const hives = await hiveModel.find().lean();

    const mapped = harvests.map((h) => {
      const farm = farms.find((f) => f.farmId === h.farmId);
      const hive = hives.find(
        (v) => v._id?.toString() === h.hiveId || v.hiveId === h.hiveId
      );
      return {
        ...h,
        farmName: farm ? farm.farmName : h.farmId,
        hiveName: hive ? hive.hiveName : h.hiveId,
      };
    });

    res.json({ success: true, harvests: mapped });
  } catch (err) {
    res
      .status(500)
      .json({ success: false, message: "Error fetching harvests" });
  }
};

// Get harvests by farmId
export const getHarvestsByFarm = async (req, res) => {
  try {
    const { farmId } = req.params;
    const harvests = await harvestModel.find({ farmId });
    res.json({ success: true, harvests });
  } catch (err) {
    res
      .status(500)
      .json({ success: false, message: "Error fetching harvests" });
  }
};

// Update harvest
export const updateHarvest = async (req, res) => {
  try {
    const { id } = req.params;
    const harvest = await harvestModel.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    res.json({ success: true, harvest });
  } catch (err) {
    res
      .status(500)
      .json({ success: false, message: "Error updating harvest" });
  }
};

// Delete harvest
export const deleteHarvest = async (req, res) => {
  try {
    const { id } = req.params;
    await harvestModel.findByIdAndDelete(id);
    res.json({ success: true, message: "Harvest deleted" });
  } catch (err) {
    res
      .status(500)
      .json({ success: false, message: "Error deleting harvest" });
  }
};


// ✅ HARVEST BY MONTH (filters correctly by year)
export const getHarvestByMonth = async (req, res) => {
  try {
    const { year } = req.query;

    let matchStage = {};
    if (year) {
      const start = new Date(`${year}-01-01T00:00:00Z`);
      const end = new Date(`${parseInt(year) + 1}-01-01T00:00:00Z`);
      matchStage.date = { $gte: start, $lt: end };
    }

    const data = await harvestModel.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: { year: { $year: "$date" }, month: { $month: "$date" } },
          total: { $sum: "$quantity" },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } },
      {
        $project: {
          _id: 0,
          month: {
            $concat: [
              { $toString: "$_id.month" },
              "-",
              { $toString: "$_id.year" },
            ],
          },
          total: 1,
        },
      },
    ]);

    res.status(200).json({ success: true, data });
  } catch (error) {
    console.error("Error in getHarvestByMonth:", error);
    res
      .status(500)
      .json({ success: false, message: "Error fetching harvest by month" });
  }
};

// ✅ HARVEST BY FARM (filters correctly by year)
export const getHarvestByFarm = async (req, res) => {
  try {
    const { year } = req.query;

    let matchStage = {};
    if (year) {
      const start = new Date(`${year}-01-01T00:00:00Z`);
      const end = new Date(`${parseInt(year) + 1}-01-01T00:00:00Z`);
      matchStage.date = { $gte: start, $lt: end };
    }

    const data = await harvestModel.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: "$farmId",
          total: { $sum: "$quantity" },
        },
      },
      { $sort: { total: -1 } },
    ]);

    res.status(200).json({ success: true, data });
  } catch (error) {
    console.error("Error in getHarvestByFarm:", error);
    res
      .status(500)
      .json({ success: false, message: "Error fetching harvest by farm" });
  }
};

// ✅ HARVEST BY FARM (filter by year and optional month) — fixed version
export const getHarvestByFarmAdvanced = async (req, res) => {
  try {
    const { year, month } = req.query;
    let matchStage = {};

    if (year && month && month !== "All") {
      // 🟢 specific month range (handles December properly)
      const start = new Date(Date.UTC(year, month - 1, 1, 0, 0, 0)); // month-1 since JS months are 0-based
      const end =
        month == 12
          ? new Date(Date.UTC(parseInt(year) + 1, 0, 1, 0, 0, 0)) // next year Jan 1
          : new Date(Date.UTC(year, month, 1, 0, 0, 0)); // next month 1st
      matchStage.date = { $gte: start, $lt: end };
    } else if (year && year !== "All") {
      // 🟢 entire year range
      const start = new Date(Date.UTC(year, 0, 1, 0, 0, 0));
      const end = new Date(Date.UTC(parseInt(year) + 1, 0, 1, 0, 0, 0));
      matchStage.date = { $gte: start, $lt: end };
    }

    const data = await harvestModel.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: "$farmId",
          total: { $sum: "$quantity" },
        },
      },
      { $sort: { total: -1 } },
    ]);

    res.status(200).json({ success: true, data });
  } catch (error) {
    console.error("Error in getHarvestByFarmAdvanced:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching harvest by farm",
    });
  }
};


// ✅ Get total harvest for the current month
export const getMonthlyHarvestTotal = async (req, res) => {
  try {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth(); // 0-based

    const start = new Date(year, month, 1);
    const end = new Date(year, month + 1, 1);

    const data = await harvestModel.aggregate([
      { $match: { date: { $gte: start, $lt: end } } },
      {
        $group: {
          _id: null,
          total: { $sum: "$quantity" },
          count: { $sum: 1 },
        },
      },
    ]);

    const total = data.length ? data[0].total : 0;
    const count = data.length ? data[0].count : 0;

    res.status(200).json({
      success: true,
      total,
      count,
    });
  } catch (error) {
    console.error("Error fetching monthly harvest total:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching monthly harvest total",
    });
  }
};



// Get overall harvest insights
//  GET /api/harvests/insights
// Admin
// ✅ Get overall harvest insights
//  GET /api/harvests/insights
export const getHarvestInsights = async (req, res) => {
  try {
    const currentYear = new Date().getFullYear();

    // 1️⃣ Total harvest for current year
    const yearlyData = await harvestModel.aggregate([
      {
        $match: {
          date: {
            $gte: new Date(`${currentYear}-01-01`),
            $lt: new Date(`${currentYear + 1}-01-01`),
          },
        },
      },
      { $group: { _id: null, totalHarvest: { $sum: "$quantity" } } },
    ]);
    const yearlyTotal = yearlyData.length ? yearlyData[0].totalHarvest : 0;

    // 2️⃣ Average harvest per farm
    const farmHarvests = await harvestModel.aggregate([
      { $group: { _id: "$farmId", total: { $sum: "$quantity" } } },
    ]);
    const avgPerFarm =
      farmHarvests.length > 0
        ? farmHarvests.reduce((a, b) => a + b.total, 0) / farmHarvests.length
        : 0;

    // 3️⃣ Best performing farm
    const topFarmAgg = await harvestModel.aggregate([
      { $group: { _id: "$farmId", total: { $sum: "$quantity" } } },
      { $sort: { total: -1 } },
      { $limit: 1 },
    ]);

    let bestFarm = "-";
    if (topFarmAgg.length) {
      const farmKey = topFarmAgg[0]._id;
      const topFarm = await farmModel.findOne({
        $or: [
          { farmId: farmKey },
          ...(mongoose.Types.ObjectId.isValid(farmKey)
            ? [{ _id: new mongoose.Types.ObjectId(farmKey) }]
            : []),
        ],
      });
      bestFarm = topFarm ? topFarm.farmName : farmKey;
    }

    // 4️⃣ Top productive hive — safe version (no BSON error)
    const topHiveAgg = await harvestModel.aggregate([
      { $group: { _id: "$hiveId", total: { $sum: "$quantity" } } },
      { $sort: { total: -1 } },
      { $limit: 1 },
    ]);

    let topHive = "-";
    if (topHiveAgg.length) {
      const hiveKey = topHiveAgg[0]._id;
      let hiveRecord = null;

      // ✅ only add ObjectId query if it's valid
      if (mongoose.Types.ObjectId.isValid(hiveKey)) {
        hiveRecord = await hiveModel.findOne({
          $or: [{ hiveId: hiveKey }, { _id: new mongoose.Types.ObjectId(hiveKey) }],
        });
      } else {
        hiveRecord = await hiveModel.findOne({ hiveId: hiveKey });
      }

      if (hiveRecord) {
        const farmRecord = await farmModel.findOne({
          $or: [
            { farmId: hiveRecord.farmId },
            ...(mongoose.Types.ObjectId.isValid(hiveRecord.farmId)
              ? [{ _id: new mongoose.Types.ObjectId(hiveRecord.farmId) }]
              : []),
          ],
        });

        const hiveDisplay = hiveRecord.hiveName || hiveRecord.hiveId || hiveKey;
        const farmDisplay = farmRecord?.farmName || hiveRecord.farmId || "-";
        topHive = `${hiveDisplay} (${farmDisplay})`;
      } else {
        topHive = hiveKey;
      }
    }

    // ✅ Return insights
    return res.json({
      success: true,
      data: { bestFarm, avgPerFarm, yearlyTotal, topHive },
    });
  } catch (err) {
    console.error("Error generating harvest insights:", err.message);
    return res.status(500).json({
      success: false,
      message: "Failed to generate harvest insights",
    });
  }
};

