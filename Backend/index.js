// backend/server.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import nodemailer from "nodemailer"; // ✅ Added for email test
import cron from "node-cron"; // ✅ used for scheduled notifications

// DB
import { connectDB } from "./config/db.js";

// Routes (your side)
import farmRouter from "./routes/farmRoutes.js";
import hiveRouter from "./routes/hiveRoutes.js";
import farmAnalyticsRoutes from "./routes/farmAnalyticsRoutes.js";
import inventoryRoutes from "./routes/inventory.routes.js";
import orderDetailsRouter from "./routes/orderDetailsRouter.js";
import analyticsRouter from "./routes/analytics.routes.js";
import workshopRouter from "./routes/workshopRoutes.js";
import blogRouter from "./routes/blogRoutes.js";
import harvestRoutes from "./routes/harvestRoutes.js";
import productRouter from "./routes/product.routes.js";
import notificationRoutes from "./routes/notificationRoutes.js";
import commentRoutes from "./routes/commentRoutes.js";

// Controller for notifications
import { checkAndSendNotifications } from "./controllers/notificationController.js";

// Routes (Chanuka’s side)
import postRoutes from "./routes/postRoutes.js";
import announcementRoutes from "./routes/announcementRoutes.js";
import userRoutes from "./routes/authRoutes.js";
import authRoutes from "./routes/auth.routes.js";


dotenv.config();

const app = express();

// ✅ Advanced CORS
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  "http://localhost:5175",
];
app.use(
  cors({
    origin: allowedOrigins,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

// ✅ Middleware
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

// ✅ Static file serving
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

// 🔹 Your Routes
app.use("/api/farms", farmRouter);
app.use("/api/hives", hiveRouter);
app.use("/api/workshops", workshopRouter);
app.use("/api/blogs", blogRouter);
app.use("/api/harvests", harvestRoutes);
app.use("/api/products", productRouter);
app.use("/api/inventory", inventoryRoutes);
app.use("/api/analytics", analyticsRouter);
app.use("/api/farm-analytics", farmAnalyticsRoutes);
app.use("/api/orderdetails", orderDetailsRouter);
app.use("/api/comments", commentRoutes);

// 🔹 Notification Routes
app.use("/api/notifications", notificationRoutes);

// ✅ Cron: check daily at 8 AM
cron.schedule("0 8 * * *", () => {
  console.log("🔔 Running daily notification check...");
  checkAndSendNotifications()
    .then(() => console.log("✅ Daily notification check completed."))
    .catch((err) => console.error("❌ Cron check failed:", err));
});

// ✅ Auto-run notification check once when server starts
checkAndSendNotifications()
  .then(() => console.log("🔔 Initial notification check executed on startup"))
  .catch((err) => console.error("❌ Initial notification check failed:", err));

// ✅ Gmail SMTP setup
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: process.env.SMTP_SECURE === "true", // true for 465
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// ✅ Gmail SMTP test route (for quick check)
app.get("/test-email", async (req, res) => {
  try {
    await transporter.sendMail({
      from: `"Ceylon Colony" <${process.env.SMTP_USER}>`,
      to: process.env.SMTP_USER,
      subject: "✅ Gmail SMTP Test",
      html: "<p>Your Gmail SMTP setup works perfectly! 🎉</p>",
    });
    res.json({ success: true, message: "Test email sent successfully!" });
  } catch (err) {
    console.error("Email test failed:", err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// 🔹 Chanuka’s Routes
app.use("/api", postRoutes);
app.use("/api/admin/announcements", announcementRoutes);
app.use("/api/auth", userRoutes);
app.use("/api/auth", authRoutes);

// ✅ Health Check
app.get("/health", (req, res) => res.json({ ok: true }));

// ✅ Catch-all 404
app.use((req, res) => {
  console.log("Request came in:", req.method, req.url);
  res.status(404).json({ message: "Not Found" });
});

// ✅ Connect DB + Start Server
connectDB().then(() => {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () =>
    console.log(`✅ API listening on http://localhost:${PORT}`)
  );
});
