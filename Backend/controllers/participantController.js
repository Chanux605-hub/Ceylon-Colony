import Participant from "../models/Participant.js";
import Workshop from "../models/Workshop.js";

/* ==============================================================
   ✅ Create new participant (auto-booking when user clicks "Book & Pay")
   ============================================================== */
export const createParticipant = async (req, res) => {
  try {
    const { userId, workshopId, fullName, email, phone } = req.body;

    if (!userId || !workshopId) {
      return res.status(400).json({ error: "User ID and Workshop ID are required" });
    }

    const workshop = await Workshop.findById(workshopId);
    if (!workshop) return res.status(404).json({ error: "Workshop not found" });

    const exists = await Participant.findOne({ userId, workshopId });
    if (exists) return res.status(400).json({ error: "Already booked this workshop" });

    const participant = await Participant.create({
      userId,
      workshopId,
      fullName,
      email,
      phone,
      status: "Registered",
      attendance: "Pending", // ✅ default state
    });

    // increment seat count
    workshop.seatsTaken = (workshop.seatsTaken || 0) + 1;
    await workshop.save();

    res.status(201).json(participant);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

/* ==============================================================
   ✅ Get all participants (Admin dashboard)
   ============================================================== */
export const getParticipants = async (req, res) => {
  try {
    const participants = await Participant.find()
      .populate("userId", "fullName email phone")
      .populate("workshopId", "title date location");

    res.json(participants);
  } catch (err) {
    console.error("❌ Fetch participants error:", err);
    res.status(500).json({ error: err.message });
  }
};

/* ==============================================================
   ✅ Get single participant by ID (used for payment/status)
   ============================================================== */
export const getParticipantById = async (req, res) => {
  try {
    const { id } = req.params;
    const participant = await Participant.findById(id)
      .populate("userId", "fullName email phone")
      .populate("workshopId", "title date location");

    if (!participant)
      return res.status(404).json({ error: "Participant not found" });

    res.json(participant);
  } catch (err) {
    console.error("❌ Get participant error:", err);
    res.status(500).json({ error: err.message });
  }
};

/* ==============================================================
   ✅ Update participant (for marking payment, attendance, etc.)
   ============================================================== */
export const updateParticipant = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    // ✅ Only allow valid fields to be updated
    const allowedFields = ["status", "attendance", "certificateId"];
    const filteredUpdates = Object.keys(updates)
      .filter((key) => allowedFields.includes(key))
      .reduce((obj, key) => {
        obj[key] = updates[key];
        return obj;
      }, {});

    const updated = await Participant.findByIdAndUpdate(id, filteredUpdates, {
      new: true,
    })
      .populate("userId", "fullName email phone")
      .populate("workshopId", "title date location");

    if (!updated)
      return res.status(404).json({ error: "Participant not found" });

    res.json(updated);
  } catch (err) {
    console.error("❌ Update participant error:", err);
    res.status(500).json({ error: err.message });
  }
};

/* ==============================================================
   ✅ Delete participant (Admin)
   ============================================================== */
export const deleteParticipant = async (req, res) => {
  try {
    const { id } = req.params;
    const participant = await Participant.findByIdAndDelete(id);

    if (!participant)
      return res.status(404).json({ error: "Participant not found" });

    // 🔹 Decrement seats if the workshop exists
    const workshop = await Workshop.findById(participant.workshopId);
    if (workshop && workshop.seatsTaken > 0) {
      workshop.seatsTaken -= 1;
      await workshop.save();
    }

    res.json({ success: true });
  } catch (err) {
    console.error("❌ Delete participant error:", err);
    res.status(500).json({ error: err.message });
  }
};
