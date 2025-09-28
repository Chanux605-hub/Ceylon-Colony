import jwt from "jsonwebtoken";
import User from "../models/User.js";

const JWT_SECRET = process.env.JWT_SECRET || "supersecret";

export const protect = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ error: "Not authorized" });

    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = await User.findById(decoded.id).select("_id email");
    if (!req.user) return res.status(401).json({ error: "User not found" });
    next();
  } catch (err) {
    res.status(401).json({ error: "Invalid token" });
  }
};
