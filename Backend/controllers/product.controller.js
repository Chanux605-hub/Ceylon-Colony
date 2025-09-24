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
    const doc = await Product.findById(req.params.id);
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
      // catalogue
      name: b.name?.trim(),
      category: b.category || "",
      weight: b.weight || "",
      price: Number(b.price),
      status: b.status || "Active",
      imageUrl: (b.imageUrl || "").trim(),

      // details (optional)
      images: Array.isArray(b.images)
        ? b.images
            .filter((it) => it && it.url)
            .map((it) => ({ url: String(it.url), alt: String(it.alt || "") }))
        : [],
      description: b.description || "",
      tags: Array.isArray(b.tags) ? b.tags.map((t) => String(t).trim()).filter(Boolean) : [],
      sku: b.sku || "",
      inStock: typeof b.inStock === "boolean" ? b.inStock : true,
      stock: b.stock !== undefined ? Math.max(0, Number(b.stock)) : 0,
      attributes: b.attributes && typeof b.attributes === "object" ? b.attributes : {},
      rating: b.rating && typeof b.rating === "object" ? b.rating : undefined,
      bestseller: !!b.bestseller,
    });

    res.status(201).json(doc);
  } catch (err) {
    next(err);
  }
}

// PUT /api/products/:id
// PATCH /api/products/:id
export async function update(req, res, next) {
  try {
    const b = req.body || {};
    const updates = {};

    // catalogue
    if (b.name !== undefined) updates.name = b.name?.trim();
    if (b.category !== undefined) updates.category = b.category || "";
    if (b.weight !== undefined) updates.weight = b.weight || "";
    if (b.price !== undefined) updates.price = Number(b.price);
    if (b.status !== undefined) updates.status = b.status || "Active";
    if (b.imageUrl !== undefined) updates.imageUrl = (b.imageUrl || "").trim();

    // details
    if (b.images !== undefined) {
      updates.images = Array.isArray(b.images)
        ? b.images
            .filter((it) => it && it.url)
            .map((it) => ({ url: String(it.url), alt: String(it.alt || "") }))
        : [];
    }
    if (b.description !== undefined) updates.description = b.description || "";
    if (b.tags !== undefined) {
      updates.tags = Array.isArray(b.tags) ? b.tags.map((t) => String(t).trim()).filter(Boolean) : [];
    }
    if (b.sku !== undefined) updates.sku = b.sku || "";
    if (b.inStock !== undefined) updates.inStock = !!b.inStock;
    if (b.stock !== undefined) updates.stock = Math.max(0, Number(b.stock));
    if (b.attributes !== undefined) {
      updates.attributes = b.attributes && typeof b.attributes === "object" ? b.attributes : {};
    }
    if (b.rating !== undefined) {
      updates.rating = b.rating && typeof b.rating === "object" ? b.rating : { average: 0, count: 0 };
    }
    if (b.bestseller !== undefined) updates.bestseller = !!b.bestseller;

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
