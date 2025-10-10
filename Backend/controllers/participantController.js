import Participant from "../models/Participant.js";

// CREATE participant
export const createParticipant = async (req, res) => {
  try {
    const { workshopId } = req.body; // only enforce workshopId

    if (!workshopId) {
      return res.status(400).json({ error: "WorkshopId is required" });
    }

    const participant = new Participant(req.body);
    await participant.save();

    res.status(201).json(participant);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// GET all participants
export const getParticipants = async (req, res) => {
  try {
    const participants = await Participant.find()
      .populate("workshopId", "title date")
      .populate("userId", "name email username"); // ✅ link user info
    res.json(participants);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET single participant
export const getParticipantById = async (req, res) => {
  try {
    const participant = await Participant.findById(req.params.id)
      .populate("workshopId", "title date")
      .populate("userId", "name email username");
    if (!participant) return res.status(404).json({ error: "Participant not found" });
    res.json(participant);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// UPDATE participant
export const updateParticipant = async (req, res) => {
  try {
    const participant = await Participant.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!participant) {
      return res.status(404).json({ error: "Participant not found" });
    }
    res.json(participant);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// DELETE participant
export const deleteParticipant = async (req, res) => {
  try {
    const participant = await Participant.findByIdAndDelete(req.params.id);
    if (!participant) {
      return res.status(404).json({ error: "Participant not found" });
    }
    res.json({ success: true, message: "Participant deleted" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
