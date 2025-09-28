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
