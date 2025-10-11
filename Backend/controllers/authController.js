import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import Counter from "../models/Counter.js";

const JWT_SECRET = process.env.JWT_SECRET || "supersecret";

// helper: get next userId
async function getNextUserId() {
  const counter = await Counter.findOneAndUpdate(
    { id: "userId" },
    { $inc: { seq: 1 } },
    { new: true, upsert: true }
  );
  return `U${counter.seq}`;
}

// SIGN UP
export const signup = async (req, res) => {
  try {
    const { name, address, email, phone, username, password, role } = req.body;

    const existing = await User.findOne({ $or: [{ email }, { username }] });
    if (existing) {
      return res.status(400).json({ error: "Email or username already taken" });
    }

    const userId = await getNextUserId();

    // ❌ REMOVE manual bcrypt.hash() — let model pre-save do it
    const user = await User.create({
      userId,
      name,
      address,
      email,
      phone,
      username,
      password, // pass plain password here
      role: role || "user",
    });

    res.status(201).json({
      message: "User created successfully",
      user: {
        userId: user.userId,
        name: user.name,
        address: user.address,
        email: user.email,
        phone: user.phone,
        username: user.username,
        role: user.role,
        avatarUrl: user.avatarUrl,
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// LOGIN
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      console.log("❌ No user found with email:", email);
      return res.status(400).json({ error: "Invalid credentials" });
    }

    console.log("🔹 Incoming login for:", email);
    console.log("🔹 Plain password:", password);
    console.log("🔹 Stored hash:", user.password);

    const isMatch = await bcrypt.compare(password, user.password);
    console.log("🔹 Password match result:", isMatch);

    if (!isMatch) return res.status(400).json({ error: "Invalid credentials" });

    const token = jwt.sign(
      { id: user._id, email: user.email },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    console.log("✅ Login successful for:", email);

    res.json({
      message: "Login successful",
      token,
      user: {
        userId: user.userId,
        name: user.name,
        address: user.address,
        email: user.email,
        phone: user.phone,
        username: user.username,
        role: user.role, // ✅ add this
        avatarUrl: user.avatarUrl,
      },
    });
  } catch (err) {
    console.error("❌ Login error:", err.message);
    res.status(500).json({ error: err.message });
  }
};

// GET CURRENT USER
export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json({ user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// UPDATE PROFILE
export const updateProfile = async (req, res) => {
  try {
    const fields = ["name", "username", "email", "phone", "address", "avatarUrl"];
    const updates = {};
    fields.forEach((f) => {
      if (req.body[f] !== undefined) updates[f] = req.body[f];
    });

    const user = await User.findByIdAndUpdate(req.user.id, updates, { new: true }).select("-password");

    res.json({ message: "Profile updated successfully", user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// UPLOAD PROFILE PICTURE
export const uploadAvatar = async (req, res) => {
  try {
    if (!req.file || !req.file.path) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    // Save new avatar URL to user
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { avatarUrl: req.file.path },
      { new: true }
    ).select("-password");

    res.json({ message: "Profile picture updated successfully", user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// DELETE ACCOUNT
export const deleteAccount = async (req, res) => {
  try {
    const userId = req.user.id; // comes from JWT middleware

    const user = await User.findByIdAndDelete(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({ message: "Account deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

