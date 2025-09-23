import Product from "../models/Product.js";

// GET /api/products
export async function list(req, res, next) {
  try {
    const { q, category, sort = "createdAt:desc", page = 1, limit = 12 } = req.query;


    const [sortField, sortDir] = String(sort).split(":");
    const filter = {};

    
    if (q) filter.name = { $regex: q, $options: "i" };
    if (category) filter.category = category;

    const pageNum = Math.max(1, Number(page));
    const pageSize = Math.max(1, Number(limit));
    const skip = (pageNum - 1) * pageSize;

    const [items, total] = await Promise.all([
      Product.find(filter)
        .populate("inventoryId", "stock reorder")
        .sort({ [sortField || "createdAt"]: sortDir === "asc" ? 1 : -1 })
        .skip(skip)
        .limit(pageSize),
      Product.countDocuments(filter),
    ]);

    res.json({ items, total, page: pageNum, limit: pageSize });
  } catch (err) {
    next(err);
  }
}

// GET /api/products/:id
export async function getOne(req, res, next) {
  try {
    const doc = await Product.findById(req.params.id)
      .populate("inventoryId", "stock reorder");
    if (!doc) return res.status(404).json({ message: "Not found" });
    res.json(doc);
  } catch (err) {
    next(err);
  }
}

// POST /api/products
export async function create(req, res, next) {
  try {
    const b = req.body || {};
    if (!b.name || b.price === undefined) {
      return res.status(400).json({ message: "name and price are required" });
    }

    const doc = await Product.create({
      name: b.name?.trim(),
      category: b.category || "",
      weight: b.weight || "",
      price: Number(b.price),
      status: b.status || "Active",
      imageUrl: (b.imageUrl || "").trim(),
      images: Array.isArray(b.images) ? b.images.filter(it => it && it.url) : [],
      description: b.description || "",
      tags: Array.isArray(b.tags) ? b.tags : [],
      sku: b.sku || "",
      inStock: typeof b.inStock === "boolean" ? b.inStock : true,
      stock: b.stock !== undefined ? Math.max(0, Number(b.stock)) : 0,
      attributes: b.attributes || {},
      rating: b.rating || {},
      bestseller: !!b.bestseller,
      inventoryId: b.inventoryId || null,
    });

    res.status(201).json(doc);
  } catch (err) {
    next(err);
  }
}

// PUT /api/products/:id
export async function update(req, res, next) {
  try {
    const updates = { ...req.body };
    if (updates.price !== undefined) updates.price = Number(updates.price);
    if (updates.stock !== undefined) updates.stock = Math.max(0, Number(updates.stock));
    if (updates.inventoryId === "") updates.inventoryId = null;

    const doc = await Product.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    }).populate("inventoryId", "stock reorder");

    if (!doc) return res.status(404).json({ message: "Not found" });
    res.json(doc);
  } catch (err) {
    next(err);
  }
}

// DELETE /api/products/:id
export async function remove(req, res, next) {
  try {
    const doc = await Product.findByIdAndDelete(req.params.id);
    if (!doc) return res.status(404).json({ message: "Not found" });
    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
}
