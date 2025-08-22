import farmModel from "../models/FarmModel.js";

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
