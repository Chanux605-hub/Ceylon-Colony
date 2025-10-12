import notificationModel from "../models/notificationModel.js";
import harvestModel from "../models/harvestModel.js";
import farmModel from "../models/farmModel.js";
import hiveModel from "../models/hiveModel.js";
import userModel from "../models/User.js";
import nodemailer from "nodemailer";

/* -------------------- EMAIL SETUP -------------------- */
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: process.env.SMTP_SECURE === "true",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

const sendEmail = async (to, subject, html) => {
  if (!to) return;
  try {
    await transporter.sendMail({
      from: `"Ceylon Colony" <${process.env.SMTP_USER}>`,
      to,
      subject,
      html,
    });
    console.log(`📧 Email sent to ${to}: ${subject}`);
  } catch (err) {
    console.error("❌ Email failed:", err.message);
  }
};

/* -------------------- MAIN CHECK FUNCTION -------------------- */
export const checkAndSendNotifications = async () => {
  console.log("🔍 Checking overdue inspections and today's harvests...");

  const now = new Date();
  const startOfDay = new Date(now.setHours(0, 0, 0, 0));
  const endOfDay = new Date(now.setHours(23, 59, 59, 999));

  const harvests = await harvestModel.find().lean();
  const farms = await farmModel.find().lean();
  const hives = await hiveModel.find().lean();

  for (const h of harvests) {
    try {
      const farm = farms.find((f) => f.farmId === h.farmId);
      const hive = hives.find(
        (v) => v._id?.toString() === h.hiveId || v.hiveId === h.hiveId
      );
      const farmer = await userModel.findOne({ userId: farm?.ownerId });
      const farmerEmail = farmer?.email;

      /* 🐝 Inspection Overdue */
      if (h.nextInspectionDate && new Date(h.nextInspectionDate) < new Date()) {
        const msg = `Hive <b>${hive?.hiveName}</b> in farm <b>${
          farm?.farmName
        }</b> has missed its inspection date (<b>${new Date(
          h.nextInspectionDate
        ).toLocaleDateString()}</b>). Please inspect it immediately.`;

        // check if duplicate
        const existing = await notificationModel.findOne({
          farmerId: farm.ownerId,
          title: "Inspection Overdue",
          relatedHive: hive?.hiveName,
          message: { $regex: new Date(h.nextInspectionDate).toLocaleDateString() },
        });
        if (!existing) {
          await notificationModel.create({
            farmerId: farm.ownerId,
            type: "Alert",
            title: "Inspection Overdue",
            message: msg,
            relatedHive: hive?.hiveName,
            relatedFarm: farm?.farmName,
          });
          await sendEmail(farmerEmail, "🐝 Inspection Overdue", msg);
        }
      }

      /* 🍯 Harvest Today */
      const harvestDate = new Date(h.date);
      if (harvestDate >= startOfDay && harvestDate <= endOfDay) {
        const msg = `Harvest is scheduled today for hive <b>${hive?.hiveName}</b> in farm <b>${farm?.farmName}</b>.`;

        const existing = await notificationModel.findOne({
          farmerId: farm.ownerId,
          title: "Harvest Scheduled Today",
          relatedHive: hive?.hiveName,
        });
        if (!existing) {
          await notificationModel.create({
            farmerId: farm.ownerId,
            type: "Reminder",
            title: "Harvest Scheduled Today",
            message: msg,
            relatedHive: hive?.hiveName,
            relatedFarm: farm?.farmName,
          });
          await sendEmail(farmerEmail, "🍯 Harvest Reminder", msg);
        }
      }
    } catch (err) {
      console.error("Error in loop:", err.message);
    }
  }

  console.log("✅ Notification check completed.");
};

/* -------------------- FETCH -------------------- */
export const getNotificationsByFarmer = async (req, res) => {
  try {
    const { farmerId } = req.params;
    const notifications = await notificationModel
      .find({ farmerId })
      .sort({ createdAt: -1 });
    res.json({ success: true, notifications });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/* -------------------- MARK ONE OR MANY -------------------- */
export const markAsRead = async (req, res) => {
  try {
    const { id } = req.params;
    const { isRead } = req.body;
    const notif = await notificationModel.findByIdAndUpdate(
      id,
      { isRead: isRead ?? true },
      { new: true }
    );
    res.json({ success: true, notification: notif });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const markMultipleAsRead = async (req, res) => {
  try {
    const { ids, isRead } = req.body;
    await notificationModel.updateMany(
      { _id: { $in: ids } },
      { $set: { isRead } }
    );
    res.json({ success: true, message: "Notifications updated." });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/* -------------------- DELETE -------------------- */
export const deleteNotification = async (req, res) => {
  try {
    const { id } = req.params;
    await notificationModel.findByIdAndDelete(id);
    res.json({ success: true, message: "Notification deleted." });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/* -------------------- UNREAD COUNT -------------------- */
export const getUnreadCount = async (req, res) => {
  try {
    const { farmerId } = req.params;
    const count = await notificationModel.countDocuments({
      farmerId,
      isRead: false,
    });
    res.json({ success: true, count });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
