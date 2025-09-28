import express from "express";
import { uploadFlyers } from "../config/cloudinary.js";
import {
  createAnnouncement,
  listAnnouncements,
  getAnnouncement,
  updateAnnouncement,
  deleteAnnouncement,
} from "../controllers/announcementController.js";

const router = express.Router();

// Admin endpoints
router.post("/", uploadFlyers.single("flyer"), createAnnouncement);
router.patch("/:id", updateAnnouncement);
router.delete("/:id", deleteAnnouncement);

// Public endpoint (Community.jsx fetches this)
router.get("/", listAnnouncements);
router.get("/:id", getAnnouncement);

export default router;
