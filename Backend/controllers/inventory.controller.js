// Backend/controllers/inventory.controller.js
import Inventory from "../models/Inventory.js";

// GET /api/inventory
export async function list(req, res, next) {
  try {
    const docs = await Inventory.find().sort({ createdAt: -1 });
    res.json(docs);
  } catch (err) {
    next(err);
  }


}

// GET /api/inventory/:id
export async function getOne(req, res, next) {
  try {
    const doc = await Inventory.findById(req.params.id);
    if (!doc) return res.status(404).json({ message: "Not found" });
    res.json(doc);
  } catch (err) {
    next(err);
  }
}

// POST /api/inventory
export async function create(req, res, next) {
  try {
    const b = req.body || {};
    if (!b.name) return res.status(400).json({ message: "Name is required" });

    const doc = await Inventory.create({
      name: b.name.trim(),
      category: b.category || "",
      stock: b.stock !== undefined ? Math.max(0, Number(b.stock)) : 0,
      reorder: b.reorder !== undefined ? Number(b.reorder) : 0,
    });

    res.status(201).json(doc);
  } catch (err) {
    next(err);
  }
}

// PUT /api/inventory/:id
export async function update(req, res, next) {
  try {
    const updates = { ...req.body };
    if (updates.stock !== undefined) updates.stock = Math.max(0, Number(updates.stock));
    if (updates.reorder !== undefined) updates.reorder = Number(updates.reorder);

    const doc = await Inventory.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    });

    if (!doc) return res.status(404).json({ message: "Not found" });
    res.json(doc);
  } catch (err) {
    next(err);
  }
}

// DELETE /api/inventory/:id
export async function remove(req, res, next) {
  try {
    const doc = await Inventory.findByIdAndDelete(req.params.id);
    if (!doc) return res.status(404).json({ message: "Not found" });
    res.json({ ok: true, id: req.params.id });
  } catch (err) {
    next(err);
  }
}


// PATCH /api/inventory/:id/reduce
export async function reduceStock(req, res, next) {
  try {
    const qty = Math.max(1, Number(req.body.qty || 1));
    const doc = await Inventory.findById(req.params.id);
    if (!doc) return res.status(404).json({ message: "Not found" });

    if (doc.stock < qty) {
      return res.status(400).json({ message: "Not enough stock" });
    }

    doc.stock -= qty;
    await doc.save();
    res.json(doc);
  } catch (err) {
    next(err);
  }
}
