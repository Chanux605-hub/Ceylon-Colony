// backend/controllers/workshopController.js
import Workshop from "../models/Workshop.js";
import Participant from "../models/Participant.js";

// ✅ CREATE WORKSHOP
export const create = async (req, res) => {
  try {
    const workshopId = `WS-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    const doc = await Workshop.create({
      ...req.body,
      workshopId,
    });

    res.status(201).json(doc);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// ✅ READ ALL WORKSHOPS
export const list = async (_req, res) => {
  const docs = await Workshop.find().sort({ date: 1, time: 1, createdAt: -1 });
  res.json(docs);
};

// ✅ READ SINGLE WORKSHOP
export const get = async (req, res) => {
  try {
    const doc = await Workshop.findById(req.params.id);
    if (!doc) return res.status(404).json({ error: "Not found" });
    res.json(doc);
  } catch {
    res.status(400).json({ error: "Invalid id" });
  }
};

// ✅ UPDATE WORKSHOP
export const update = async (req, res) => {
  try {
    const doc = await Workshop.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!doc) return res.status(404).json({ error: "Not found" });
    res.json(doc);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// ✅ DELETE WORKSHOP
export const remove = async (req, res) => {
  try {
    const doc = await Workshop.findByIdAndDelete(req.params.id);
    if (!doc) return res.status(404).json({ error: "Not found" });
    res.json({ ok: true });
  } catch {
    res.status(400).json({ error: "Invalid id" });
  }
};

// ✅ CHANGE WORKSHOP STATUS
export const setStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const allowed = ["Draft", "Published", "Cancelled", "Completed"];
    if (!allowed.includes(status)) {
      return res.status(400).json({ error: "Invalid status" });
    }

    const doc = await Workshop.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );

    if (!doc) return res.status(404).json({ error: "Not found" });
    res.json(doc);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// ✅ Cancel Workshop (Admin/Organizer)
export const cancel = async (req, res) => {
  try {
    const doc = await Workshop.findByIdAndUpdate(
      req.params.id,
      { status: "Cancelled" },
      { new: true, runValidators: true }
    );
    if (!doc) return res.status(404).json({ error: "Not found" });
    res.json(doc);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// ✅ USER-SIDE: Get workshops booked by a specific user
export const getUserWorkshops = async (req, res) => {
  try {
    const { userId } = req.params;
    console.log("🔍 Fetching workshops for userId:", userId);

    const participants = await Participant.find({
      $or: [{ userId }, { user: userId }],
    })
      .populate("workshopId")
      .sort({ joinedAt: -1 });

    console.log("✅ Participants found:", participants.length);
    res.json({ participants }); // ✅ consistent response for frontend
  } catch (err) {
    console.error("❌ Error fetching user workshops:", err);
    res.status(500).json({ error: err.message });
  }
};
