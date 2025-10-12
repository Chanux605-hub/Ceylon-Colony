// backend/controllers/postController.js
import Post from "../models/Post.js";
import { cloudinary } from "../config/cloudinary.js"; // ESM import

// Create (customer/admin)
export const createPost = async (req, res) => {
  try {
    const { contentType, title, description, productId, tags, userId, username, avatarUrl = "" } = req.body;
    if (!userId || !username) return res.status(400).json({ message: "Missing author info" });

    let mediaUrl = "", posterUrl = "", mediaType = null;
    if (req.file) {
      mediaUrl = req.file.path;
      mediaType = req.file.mimetype.startsWith("video/") ? "video" : "image";
      if (mediaType === "video") {
        const publicId = req.file.filename;
        posterUrl = cloudinary.url(publicId, {
          resource_type: "video",
          format: "jpg",
          transformation: [
            { width: 480, height: 854, crop: "fill", gravity: "auto" },
            { start_offset: "1" }
          ],
        });
      }
    }

    // Auto-approve only reviews
    const status = contentType === "review" ? "approved" : "pending";

    const doc = await Post.create({
      contentType, mediaType, mediaUrl, posterUrl, title, description,
      tags: tags ? JSON.parse(tags) : [], productId,
      author: { userId, username, avatarUrl },
      status,
    });
    res.status(201).json(doc);
  } catch (e) {
    res.status(500).json({ message: "Failed to create post", error: e.message });
  }
};

// Public carousel (approved + public)
export const listShorts = async (req, res) => {
  try {
    const { tag, productId, limit = 30 } = req.query;
    const q = { contentType: "short", mediaType: "video", status: "approved", isPublic: true };
    if (tag) q.tags = { $in: [tag.replace(/^#/, "")] };
    if (productId) q.productId = productId;
    const items = await Post.find(q).sort({ views: -1, createdAt: -1 }).limit(Number(limit));
    res.json(items.map(p => ({
      id: p._id.toString(),
      src: p.mediaUrl,
      poster: p.posterUrl,
      tags: p.tags,
      productId: p.productId,
      views: p.views,
      title: p.title || p.description?.slice(0, 60) || "Short",
    })));
  } catch (e) {
    res.status(500).json({ message: "Failed to list shorts", error: e.message });
  }
};

export const addView = async (req, res) => {
  try {
    const doc = await Post.findByIdAndUpdate(req.params.id, { $inc: { views: 1 } }, { new: true });
    if (!doc) return res.status(404).json({ message: "Not found" });
    res.json({ views: doc.views });
  } catch {
    res.status(500).json({ message: "Failed to add view" });
  }
};

// Increment likes
export const addLike = async (req, res) => {
  try {
    const doc = await Post.findByIdAndUpdate(
      req.params.id,
      { $inc: { likes: 1 } },
      { new: true }
    );
    if (!doc) return res.status(404).json({ message: "Not found" });
    res.json({ likes: doc.likes });
  } catch (e) {
    res.status(500).json({ message: "Failed to add like", error: e.message });
  }
};


// Admin list
export const adminListPosts = async (req, res) => {
  try {
    const { page = 1, limit = 20, search = "", status, contentType, productId, tag, sortBy = "createdAt", order = "desc" } = req.query;
    const q = {};
    if (status) q.status = status;
    if (contentType) q.contentType = contentType;
    if (productId) q.productId = productId;
    if (tag) q.tags = { $in: [tag] };
    if (search) {
      q.$or = [
        { title: new RegExp(search, "i") },
        { description: new RegExp(search, "i") },
        { "author.username": new RegExp(search, "i") },
      ];
    }
    const sort = { [sortBy]: order === "asc" ? 1 : -1 };
    const [items, total] = await Promise.all([
      Post.find(q).sort(sort).skip((page - 1) * limit).limit(Number(limit)),
      Post.countDocuments(q),
    ]);
    res.json({ items, page: Number(page), pages: Math.ceil(total / limit), total });
  } catch (e) {
    res.status(500).json({ message: "Failed to list posts", error: e.message });
  }
};

export const adminUpdateStatus = async (req, res) => {
  try {
    const { status, isPublic } = req.body;
    const update = {};
    if (status) update.status = status;
    if (typeof isPublic === "boolean") update.isPublic = isPublic;
    const doc = await Post.findByIdAndUpdate(req.params.id, update, { new: true });
    if (!doc) return res.status(404).json({ message: "Not found" });
    res.json(doc);
  } catch (e) {
    res.status(500).json({ message: "Failed to update", error: e.message });
  }
};

export const adminDeletePost = async (req, res) => {
  try {
    await Post.findByIdAndDelete(req.params.id);
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ message: "Failed to delete", error: e.message });
  }
};

export const adminStats = async (req, res) => {
  try {
    const [byType, byProduct, topTags, uploadsByDay] = await Promise.all([
      Post.aggregate([{ $group: { _id: "$contentType", count: { $sum: 1 } } }]),
      Post.aggregate([{ $group: { _id: "$productId", count: { $sum: 1 } } }]),
      Post.aggregate([
        { $unwind: "$tags" },
        { $group: { _id: "$tags", count: { $sum: 1 } } },
        { $sort: { count: -1 } }, { $limit: 10 },
      ]),
      Post.aggregate([
        { $match: { createdAt: { $gte: new Date(Date.now() - 1000*60*60*24*30) } } },
        { $group: { _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } }, count: { $sum: 1 } } },
        { $sort: { _id: 1 } },
      ]),
    ]);
    res.json({ byType, byProduct, topTags, uploadsByDay });
  } catch (e) {
    res.status(500).json({ message: "Failed to compute stats", error: e.message });
  }
};
