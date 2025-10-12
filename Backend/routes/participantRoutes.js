import express from "express";
import {
  createParticipant,
  getParticipants,
  getParticipantById,
  updateParticipant,
  deleteParticipant,
} from "../controllers/participantController.js";
import Participant from "../models/Participant.js";

const router = express.Router();

// Existing CRUD routes
router.post("/", createParticipant);
router.get("/", getParticipants);
router.get("/:id", getParticipantById);
router.patch("/:id", updateParticipant);
router.delete("/:id", deleteParticipant);

// NEW: Cancel Booking
router.put("/:id/cancel", async (req, res) => {
  try {
    const participant = await Participant.findByIdAndUpdate(
      req.params.id,
      { status: "Cancelled" },
      { new: true }
    );

    if (!participant) {
      return res.status(404).json({ message: "Participant not found" });
    }

    res.json({
      success: true,
      message: "Booking cancelled successfully",
      participant,
    });
  } catch (err) {
    console.error("❌ Cancel booking error:", err);
    res.status(500).json({ error: err.message });
  }
});

export default router;
