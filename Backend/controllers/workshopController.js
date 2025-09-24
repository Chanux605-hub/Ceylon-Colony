import Workshop from "../models/Workshop.js";

// CREATE
export const create = async (req, res) => {
  try {
    // Auto-generate unique workshopId
    const workshopId = `WS-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    const doc = await Workshop.create({
      ...req.body,
      workshopId,   // ensure it's always set
    });

    res.status(201).json(doc);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// READ ALL
export const list = async (_req, res) => {
  const docs = await Workshop.find().sort({ date: 1, time: 1, createdAt: -1 });
  res.json(docs);
};

// READ ONE
export const get = async (req, res) => {
  try {
    const doc = await Workshop.findById(req.params.id);
    if (!doc) return res.status(404).json({ error: "Not found" });
    res.json(doc);
  } catch {
    res.status(400).json({ error: "Invalid id" });
  }
};

// UPDATE
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

// DELETE
export const remove = async (req, res) => {
  try {
    const doc = await Workshop.findByIdAndDelete(req.params.id);
    if (!doc) return res.status(404).json({ error: "Not found" });
    res.json({ ok: true });
  } catch {
    res.status(400).json({ error: "Invalid id" });
  }
};

// ---- NEW: Status helpers ----
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