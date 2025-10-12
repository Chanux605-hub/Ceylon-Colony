import express from "express";
import {
  checkAndSendNotifications,
  getNotificationsByFarmer,
  markAsRead,
  markMultipleAsRead,
  deleteNotification,
  getUnreadCount,
} from "../controllers/notificationController.js";

const router = express.Router();

router.get("/farmer/:farmerId", getNotificationsByFarmer);
router.patch("/:id/read", markAsRead);
router.patch("/multiple/read", markMultipleAsRead);
router.delete("/:id", deleteNotification);
router.get("/farmer/:farmerId/unread-count", getUnreadCount);

// manual trigger (optional)
router.get("/run/check", async (req, res) => {
  await checkAndSendNotifications();
  res.json({ success: true, message: "Notification check completed." });
});

export default router;
