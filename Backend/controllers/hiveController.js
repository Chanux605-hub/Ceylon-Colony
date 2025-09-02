import hiveModel from "../models/hiveModel.js";

export const registerHive = async (req, res) => {
  try {
    const {
      hiveId,
      hiveName,
      farmId,
      location,
      hiveType,
      material,
      dateEstablished,
      beeSpecies,
      queenId,
      colonyStrength,
      colonySource,
      status,
      expectedYield,
      flora,
      lastInspection,
      nextInspection,
      notes,
    } = req.body;

    // check required fields
    if (!hiveId || !hiveName || !farmId || !hiveType || !material || !status) {
      return res.json({
        success: false,
        message: "Please fill all required fields",
      });
    }

    // create hive
    const newHive = await hiveModel.create({
      hiveId,
      hiveName,
      farmId,
      location,
      hiveType,
      material,
      dateEstablished,
      beeSpecies,
      queenId,
      colonyStrength,
      colonySource,
      status,
      expectedYield,
      flora,
      lastInspection,
      nextInspection,
      notes,
    });

    return res.json({
      success: true,
      message: "Hive registered successfully",
      hive: newHive,
    });
  } catch (error) {
    console.error("Error registering hive:", error);
    return res.json({ success: false, message: error.message });
  }
};


// Get all hives
export const getAllHives = async (req, res) => {
  try {
    const hives = await hiveModel.find();
    return res.json({ success: true, hives });
  } catch (error) {
    console.error("Error fetching hives:", error);
    return res.json({ success: false, message: error.message });
  }
};

// Hive statistics (overview counts)
export const getHiveStats = async (req, res) => {
  try {
    const total = await hiveModel.countDocuments();
    const productive = await hiveModel.countDocuments({ status: "Active" });
    const lowProductive = await hiveModel.countDocuments({ status: "Needs Attention" });

    return res.json({
      success: true,
      stats: { total, productive, lowProductive },
    });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

// Hives that need alerts
export const getHiveAlerts = async (req, res) => {
  try {
    const overdueInspections = await hiveModel.find({
      nextInspection: { $lt: new Date() },
    });

    const lowProductive = await hiveModel.find({ status: "Needs Attention" });

    return res.json({
      success: true,
      alerts: {
        overdueInspections,
        lowProductive,
      },
    });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};