import Farm from "../models/farmModel.js";
import Hive from "../models/hiveModel.js";
import Harvest from "../models/harvestModel.js";

// @desc Get analytics for all farms of a farmer
// @route GET /api/farm-analytics/:ownerId?year=2024&month=6
// @access Public/Private
export const getFarmerAnalytics = async (req, res) => {
  try {
    const { ownerId } = req.params;
    const { year, month } = req.query; // ✅ take year/month from query

    // ✅ Build date filter if year/month provided
    let dateFilter = {};
    if (year && month) {
      const start = new Date(year, month - 1, 1); // first day of month
      const end = new Date(year, month, 1);       // first day of next month
      dateFilter.date = { $gte: start, $lt: end };
    }

    // ✅ Get all farms of this farmer
    const farms = await Farm.find({ ownerId });
    if (!farms.length) {
      return res.json({
        success: true,
        overall: { totalHarvest: 0, avgPerFarm: 0 },
        farms: [],
        hives: [],
      });
    }

    // ✅ Farm-level productivity
    const farmData = await Promise.all(
      farms.map(async (farm) => {
        const harvests = await Harvest.find({
          farmId: farm.farmId,
          ...dateFilter,
        });

        const totalHarvest = harvests.reduce(
          (sum, h) => sum + (h.quantity || 0),
          0
        );

        return {
          farmId: farm.farmId,
          farmName: farm.farmName,
          totalHarvest,
        };
      })
    );

    // ✅ Hive-level productivity
    const hives = await Hive.find({
      farmId: { $in: farms.map((f) => f.farmId) },
    });

    let hiveData = await Promise.all(
      hives.map(async (hive) => {
        const harvests = await Harvest.find({
          $or: [
            { hiveId: hive.hiveId },          // match Hive string code
            { hiveId: hive._id.toString() },  // match Mongo ObjectId
          ],
          ...dateFilter,
        });

        const totalHarvest = harvests.reduce(
          (sum, h) => sum + (h.quantity || 0),
          0
        );

        return {
          hiveId: hive.hiveId,
          hiveName: hive.hiveName,
          farmId: hive.farmId,
          harvest: totalHarvest,
        };
      })
    );

    // 🚀 Remove hives with 0 harvest
    hiveData = hiveData.filter(h => h.harvest > 0);


    // ✅ Overall stats
    const overallHarvest = farmData.reduce((sum, f) => sum + f.totalHarvest, 0);
    const avgPerFarm =
      farmData.length > 0 ? overallHarvest / farmData.length : 0;

    // ✅ Response
    res.json({
      success: true,
      overall: { totalHarvest: overallHarvest, avgPerFarm },
      farms: farmData,
      hives: hiveData,
    });
  } catch (err) {
    console.error("Farm Analytics error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
