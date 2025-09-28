import User from "../models/User.js";
import bcrypt from "bcryptjs";
import nodemailer from "nodemailer";
import twilio from "twilio";

// setup nodemailer
const transporter = nodemailer.createTransport({
  service: "gmail", // or your provider
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// setup twilio (optional)
const smsClient = twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN);

// helper to generate OTP
function generateOtp() {
  return Math.floor(100000 + Math.random() * 900000).toString(); // 6 digit
}

// ---------- Send OTP via Email ----------
export const sendOtpEmail = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: "User not found" });

    const otp = generateOtp();
    user.resetOtp = otp;
    user.resetOtpExpiry = Date.now() + 5 * 60 * 1000; // 5 min
    await user.save();

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Ceylon Colony - Password Reset OTP",
      text: `Your OTP is ${otp}. It is valid for 5 minutes.`,
    });

    res.json({ success: true, message: "OTP sent to email" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ---------- Send OTP via Phone ----------
export const sendOtpPhone = async (req, res) => {
  try {
    const { phone } = req.body;
    const user = await User.findOne({ phone });
    if (!user) return res.status(404).json({ error: "User not found" });

    const otp = generateOtp();
    user.resetOtp = otp;
    user.resetOtpExpiry = Date.now() + 5 * 60 * 1000;
    await user.save();

    await smsClient.messages.create({
      body: `Your Ceylon Colony OTP is ${otp}`,
      from: process.env.TWILIO_PHONE, // your Twilio number
      to: phone,
    });

    res.json({ success: true, message: "OTP sent to phone" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ---------- Verify OTP ----------
export const verifyOtp = async (req, res) => {
  try {
    const { otp } = req.body;
    const user = await User.findOne({
      resetOtp: otp,
      resetOtpExpiry: { $gt: Date.now() },
    });

    if (!user) return res.status(400).json({ error: "Invalid or expired OTP" });

    res.json({ success: true, email: user.email });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// RESET PASSWORD (after OTP verified)
export const resetPassword = async (req, res) => {
  try {
    const { email, newPassword } = req.body;

    console.log("🟡 Incoming reset request for:", email, newPassword); // DEBUG

    if (!email || !newPassword) {
      return res.status(400).json({ error: "Email and new password are required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      console.log("❌ No user found with email:", email);
      return res.status(404).json({ error: "User not found" }); }

    // verify OTP was issued and still valid
    if (!user.resetOtp || !user.resetOtpExpiry || user.resetOtpExpiry < Date.now()) {
      return res.status(400).json({ error: "OTP verification required" });
    }

    // optional debug check
    console.log("🔹 Old password hash:", user.password);

    user.password = newPassword;
    user.resetOtp = undefined;
    user.resetOtpExpiry = undefined;
    await user.save();

    console.log("✅ Password updated successfully for:", user.email);
    console.log("🔹 New password hash:", user.password);

    res.json({ message: "Password reset successful" });
  } catch (err) {
    console.error("❌ Error resetting password:", err.message);
    res.status(500).json({ error: err.message });
  }
};




