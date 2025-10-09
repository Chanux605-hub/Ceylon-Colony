// backend/middleware/authMiddleware.js
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const JWT_SECRET = process.env.JWT_SECRET || "supersecret";

export const protect = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1]; // "Bearer <token>"
    if (!token) {
      return res.status(401).json({ error: "No token provided" });
    }

    const decoded = jwt.verify(token, JWT_SECRET);

    // ✅ Lookup user in DB
    const user = await User.findById(decoded.id).select("_id email role");
    if (!user) {
      return res.status(401).json({ error: "User not found" });
    }

    req.user = user; // attach fresh user info
    next();
  } catch (err) {
    res.status(401).json({ error: "Unauthorized", details: err.message });
  }
};
