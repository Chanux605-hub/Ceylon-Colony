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
    const { name, address, email, phone, username, password } = req.body;

    // check if already exists
    const existing = await User.findOne({ $or: [{ email }, { username }] });
    if (existing) {
      return res.status(400).json({ error: "Email or username already taken" });
    }

    // hash password
    const hashed = await bcrypt.hash(password, 10);

    // generate custom userId
    const userId = await getNextUserId();

    // create user
    const user = await User.create({
      userId,
      name,
      address,
      email,
      phone,
      username,
      password: hashed,
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
    if (!user) return res.status(400).json({ error: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: "Invalid credentials" });

    const token = jwt.sign(
      { id: user._id, email: user.email },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

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
        avatarUrl: user.avatarUrl,
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
