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
