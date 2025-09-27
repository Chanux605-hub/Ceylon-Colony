import mongoose from "mongoose";
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
      farmId, // can be ObjectId or custom string
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

// Hive statistics
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

// Hive alerts
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

//  Get hives by farmId or Mongo _id
export const getHivesByFarm = async (req, res) => {
  try {
    const { farmId } = req.params;

    let hives = [];

    // Try matching if farmId is stored as string
    hives = await hiveModel.find({ farmId: farmId });

    // If still nothing, and farmId is a valid ObjectId, try as ObjectId
    if ((!hives || hives.length === 0) && mongoose.Types.ObjectId.isValid(farmId)) {
      hives = await hiveModel.find({ farmId: new mongoose.Types.ObjectId(farmId) });
    }

    res.json({ success: true, hives });
  } catch (error) {
    console.error("Error fetching hives:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update hive
export const updateHive = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedHive = await hiveModel.findByIdAndUpdate(id, req.body, { new: true });

    if (!updatedHive) {
      return res.status(404).json({ success: false, message: "Hive not found" });
    }

    res.json({ success: true, message: "Hive updated successfully", hive: updatedHive });
  } catch (error) {
    console.error("Error updating hive:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Get hive by ID
export const getHiveById = async (req, res) => {
  try {
    const { id } = req.params;
    const hive = await hiveModel.findById(id);

    if (!hive) {
      return res.status(404).json({ success: false, message: "Hive not found" });
    }

    res.json({ success: true, hive });
  } catch (error) {
    console.error("Error fetching hive by ID:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};


// Delete hive
export const deleteHive = async (req, res) => {
  try {
    const { id } = req.params;

    let deletedHive = null;

    // If valid MongoDB ObjectId → delete by _id
    if (mongoose.Types.ObjectId.isValid(id)) {
      deletedHive = await hiveModel.findByIdAndDelete(id);
    }

    // If not found, try matching hiveId string
    if (!deletedHive) {
      deletedHive = await hiveModel.findOneAndDelete({ hiveId: id });
    }

    if (!deletedHive) {
      return res.status(404).json({ success: false, message: "Hive not found" });
    }

    res.json({ success: true, message: "Hive deleted successfully" });
  } catch (error) {
    console.error("Error deleting hive:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

