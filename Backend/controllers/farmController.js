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

    // Validate required fields
    if (!farmId || !farmName || !owner || !phone || !address || !district) {
      return res.status(400).json({
        success: false,
        message: "Please fill all required fields",
      });
    }

    // Create farm document
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

    return res.status(201).json({
      success: true,
      message: "Farm registered successfully",
      farm: newFarm,
    });
  } catch (error) {
    console.error("Error registering farm:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Get all farms
 */
export const getAllFarms = async (req, res) => {
  try {
    const farms = await farmModel.find();
    res.status(200).json({ success: true, farms });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Get a single farm by ID
 */
export const getFarmById = async (req, res) => {
  try {
    const farm = await farmModel.findById(req.params.id);
    if (!farm) {
      return res.status(404).json({ success: false, message: "Farm not found" });
    }
    res.status(200).json({ success: true, farm });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Update farm status (Active / Inactive / Under Maintenance)
 */
export const updateFarmStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // Validate allowed status values
    if (!["Active", "Inactive", "Under Maintenance"].includes(status)) {
      return res.status(400).json({ success: false, message: "Invalid status value" });
    }

    const farm = await farmModel.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!farm) {
      return res.status(404).json({ success: false, message: "Farm not found" });
    }

    res.status(200).json({ success: true, message: "Farm status updated", farm });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
