import Product from "../models/Product.js";

// GET /api/products
export async function list(req, res, next) {
  try {
    const {
      q,
      category,
      sort = "createdAt:desc",
      page = 1,
      limit = 12,
    } = req.query;

    const [sortField, sortDir] = String(sort).split(":");
    const filter = {};
    if (q) filter.name = { $regex: q, $options: "i" };
    if (category) filter.category = category;

    const pageNum = Math.max(1, Number(page));
    const pageSize = Math.max(1, Number(limit));
    const skip = (pageNum - 1) * pageSize;

    const [items, total] = await Promise.all([
      Product.find(filter)
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

export async function getOne(req, res, next) {
  try {
    const doc = await Product.findById(req.params.id);
    if (!doc) return res.status(404).json({ message: "Not found" });
    res.json(doc);
  } catch (err) {
    next(err);
  }
}

export async function create(req, res, next) {
  try {
    const body = req.body || {};
    if (!body.name || body.price === undefined) {
      return res.status(400).json({ message: "name and price are required" });
    }
    const doc = await Product.create({
      name: body.name,
      category: body.category || "",
      weight: body.weight || "",
      price: Number(body.price),
      status: body.status || "Active",
      imageUrl: (body.imageUrl || "").trim(),
    });
    res.status(201).json(doc);
  } catch (err) {
    next(err);
  }
}

export async function update(req, res, next) {
  try {
    const body = req.body || {};
    const updates = {
      ...(body.name !== undefined ? { name: body.name } : {}),
      ...(body.category !== undefined ? { category: body.category } : {}),
      ...(body.weight !== undefined ? { weight: body.weight } : {}),
      ...(body.price !== undefined ? { price: Number(body.price) } : {}),
      ...(body.status !== undefined ? { status: body.status } : {}),
      ...(body.imageUrl !== undefined ? { imageUrl: body.imageUrl } : {}),
    };

    const doc = await Product.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    });
    if (!doc) return res.status(404).json({ message: "Not found" });
    res.json(doc);
  } catch (err) {
    next(err);
  }
}

export async function remove(req, res, next) {
  try {
    const doc = await Product.findByIdAndDelete(req.params.id);
    if (!doc) return res.status(404).json({ message: "Not found" });
    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
}
