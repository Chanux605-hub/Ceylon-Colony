import express from "express";
import Participant from "../models/Participant.js";

const router = express.Router();

// Create new participant
router.post("/", async (req, res) => {
  try {
    const participant = new Participant(req.body);
    await participant.save();
    res.status(201).json(participant);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get all participants
router.get("/", async (req, res) => {
  try {
    const participants = await Participant.find().populate("workshopId", "title date");
    res.json(participants);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete participant
router.delete("/:id", async (req, res) => {
  try {
    await Participant.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

export default router;
