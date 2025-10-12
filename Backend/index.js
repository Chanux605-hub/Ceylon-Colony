// backend/server.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";

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
import participantRoutes from "./routes/participantRoutes.js";
import blogRouter from "./routes/blogRoutes.js";
import harvestRoutes from "./routes/harvestRoutes.js";
import productRouter from "./routes/product.routes.js";




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

// Middleware
app.use(
  cors({
    origin: allowedOrigins,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

app.use(express.json({ limit: "50mb" }));               
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

// ✅ Static file serving
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

// 🔹 Your Routes
app.use("/api/farms", farmRouter);
app.use("/api/hives", hiveRouter);
app.use("/api/workshops", workshopRouter);
app.use("/api/participants", participantRoutes);



app.get("/health", (req, res) => res.json({ ok: true }));
app.use("/api/blogs", blogRouter);
app.use("/api/harvests", harvestRoutes);
app.use("/api/products", productRouter);
app.use("/api/inventory", inventoryRoutes);

app.use("/api/analytics", analyticsRouter);
app.use("/api/farm-analytics", farmAnalyticsRoutes);


app.use("/api/orderdetails", orderDetailsRouter);


// 🔹 Chanuka’s Routes
app.use("/api", postRoutes);
app.use("/api/admin/announcements", announcementRoutes);
app.use("/api/auth", userRoutes);
app.use("/api/password", authRoutes);

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
