import mongoose from "mongoose";
import farmModel from "../models/farmModel.js";

/**
 * Register a new farm
 */
export const registerFarm = async (req, res) => {
  try {
    const {
      farmId,
      farmName,
      owner,
      ownerId,
      phone,
      email,
      address,
      district,
      size,
      numHives,
      hiveTypes,
      flora,
      dateEstablished,
      status,
      expectedAnnualYield,
    } = req.body;

    // ✅ Validation
    if (!farmId || !farmName || !owner || !phone || !address || !district) {
      return res.json({
        success: false,
        message: "Please fill all required fields",
      });
    }

    // ✅ Create farm
    const newFarm = await farmModel.create({
      farmId,
      farmName,
      owner,
      ownerId,
      phone,
      email,
      address,
      district,
      size,
      numHives,
      hiveTypes,
      flora,
      dateEstablished,
      status,
      expectedAnnualYield,
    });

    return res.json({
      success: true,
      message: "Farm registered successfully",
      farm: newFarm,
    });
  } catch (error) {
    console.error("❌ Error registering farm:", error);
    return res.json({ success: false, message: error.message });
  }
};

/**
 * Get all farms
 */
export const getAllFarms = async (req, res) => {
  try {
    const farms = await farmModel.find();
    res.json({ success: true, farms });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Get a single farm by ID or farmId
 */
export const getFarmById = async (req, res) => {
  try {
    const { id } = req.params;
    let farm;

    if (mongoose.Types.ObjectId.isValid(id)) {
      farm = await farmModel.findById(id);
    }

    if (!farm) {
      farm = await farmModel.findOne({ farmId: id });
    }

    if (!farm) {
      return res.status(404).json({ success: false, message: "Farm not found" });
    }

    res.status(200).json({ success: true, farm });
  } catch (error) {
    console.error("❌ Error fetching farm:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Update farm status
 */
export const updateFarmStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const allowedStatuses = ["Active", "Inactive", "Under Maintenance"];
    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: "Invalid status value" });
    }

    let farm;
    if (mongoose.Types.ObjectId.isValid(id)) {
      farm = await farmModel.findByIdAndUpdate(id, { status }, { new: true });
    } else {
      farm = await farmModel.findOneAndUpdate({ farmId: id }, { status }, { new: true });
    }

    if (!farm) {
      return res.status(404).json({ success: false, message: "Farm not found" });
    }

    res.status(200).json({ success: true, message: "Farm status updated", farm });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Get all farms belonging to a specific owner
 */
export const getFarmsByOwner = async (req, res) => {
  try {
    const { ownerId } = req.params;
    const farms = await farmModel.find({ ownerId });

    if (!farms || farms.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No farms found for this owner",
      });
    }

    res.status(200).json({ success: true, farms });
  } catch (error) {
    console.error("❌ Error fetching farms by owner:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Update farm details
 */
export const updateFarm = async (req, res) => {
  try {
    const { id } = req.params;
    let updatedFarm;

    if (mongoose.Types.ObjectId.isValid(id)) {
      updatedFarm = await farmModel.findByIdAndUpdate(id, req.body, { new: true });
    } else {
      updatedFarm = await farmModel.findOneAndUpdate({ farmId: id }, req.body, { new: true });
    }

    if (!updatedFarm) {
      return res.json({ success: false, message: "Farm not found" });
    }

    res.json({ success: true, message: "Farm updated successfully", farm: updatedFarm });
  } catch (err) {
    console.error("❌ Error updating farm:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

/**
 * Delete a farm
 */
export const deleteFarm = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: "Invalid farm ID" });
    }

    const deletedFarm = await farmModel.findByIdAndDelete(id);

    if (!deletedFarm) {
      return res.status(404).json({ success: false, message: "Farm not found" });
    }

    res.json({ success: true, message: "Farm deleted successfully" });
  } catch (error) {
    console.error("❌ Error deleting farm:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};


