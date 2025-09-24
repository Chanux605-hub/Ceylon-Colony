import farmModel from "../models/farmModel.js";

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

    // check required fields
    if (!farmId || !farmName || !owner || !phone || !address || !district) {
      return res.json({
        success: false,
        message: "Please fill all required fields",
      });
    }

    // create farm
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
    console.error("Error registering farm:", error);
    return res.json({ success: false, message: error.message });
  }
};

//get all farm details
export const getAllFarms = async (req, res) => {
  try {
    const farms = await farmModel.find();
    res.json({ success: true, farms });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get farm by ID
export const getFarmById = async (req, res) => {
  try {
    const farm = await farmModel.findById(req.params.id);
    if (!farm) {
      return res.status(404).json({ success: false, message: "Farm not found" });
    }
    res.json({ success: true, farm });
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
