// backend/server.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import path from "path";

// Existing app routes
import farmRouter from "./routes/farmRoutes.js";
import hiveRouter from "./routes/hiveRoutes.js";
import productRouter from "./routes/product.routes.js";
import orderDetailsRouter from "./routes/orderDetailsRouter.js"; 

// Chanuka branch routes (keep if present in repo)
import postRoutes from "./routes/postRoutes.js";
import announcementRoutes from "./routes/announcementRoutes.js";
import userRoutes from "./routes/authRoutes.js"; 
import authRoutes from "./routes/auth.routes.js";

// Additional routes
import analyticsRouter from "./routes/analytics.routes.js";
//import workshopRouter from "./routes/workshopRoutes.js";
//import blogRouter from "./routes/blogRoutes.js";
//import harvestRoutes from "./routes/harvestRoutes.js";
import inventoryRoutes from "./routes/inventoryRoutes.js";



const app = express();
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
];

app.use(
  cors({
    origin: allowedOrigins,
    methods: ["GET", "POST", "PUT","PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

// Core routes from both branches
app.use("/api", postRoutes);
app.use("/api/admin/announcements", announcementRoutes);
app.use("/api/auth", userRoutes);
app.use("/api/auth", authRoutes);

// Existing feature routes
app.use("/api/farms", farmRouter);
app.use("/api/hives", hiveRouter);
//app.use("/api/workshops", workshopRouter);
//app.use("/api/blogs", blogRouter);
//app.use("/api/harvests", harvestRoutes);



// register routes
app.use("/api/products", productRouter);
app.use("/api/orderdetails", orderDetailsRouter);
app.use("/api/analytics", analyticsRouter);
app.use("/api/inventory", inventoryRoutes);

app.get("/health", (req, res) => res.json({ ok: true }));

connectDB().then(() => {
  const port = process.env.PORT || 3000;
  app.listen(port, () =>
    console.log(`✅ API listening on http://localhost:${port}`)
  );
});


// Catch-all 404 must be LAST
app.use((req, res) => {
  console.log("Request came in:", req.method, req.url);
  res.status(404).json({ message: "Not Found" });
});
