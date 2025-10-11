import express from "express";
import {
  createParticipant,
  getParticipants,
  getParticipantById,
  updateParticipant,
  deleteParticipant,
} from "../controllers/participantController.js";

const router = express.Router();

// 🟡 Protect all participant routes
router.post("/", createParticipant);
router.get("/", getParticipants);
router.get("/:id", getParticipantById);
router.patch("/:id", updateParticipant);
router.delete("/:id", deleteParticipant);

export default router;
