import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import { connectDB } from "./config/db.js";
import farmRouter from "./routes/farmRoutes.js";
import hiveRouter from "./routes/hiveRoutes.js";
import workshopRouter from "./routes/workshopRoutes.js";
import participantRoutes from "./routes/participantRoutes.js";
import postRoutes from "./routes/postRoutes.js";

dotenv.config();

const app = express();
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
];

// Middleware
app.use(
  cors({
    origin: allowedOrigins,
    methods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

app.use(express.json({ limit: "50mb" }));               
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

// Routes
app.use("/api/farms", farmRouter);
app.use("/api/hives", hiveRouter);
app.use("/api/workshops", workshopRouter);
app.use("/api/participants", participantRoutes);
app.use("/api", postRoutes);

app.get("/health", (req, res) => res.json({ ok: true }));

// ✅ Catch-all 404 must be LAST
app.use((req, res) => {
  console.log("Request came in:", req.method, req.url);
  res.status(404).json({ message: "Not Found" });
});

// Connect to DB
connectDB();

const port = process.env.PORT || 3000;
  app.listen(port, () =>
    console.log(`✅ API listening on http://localhost:${port}`)
);










