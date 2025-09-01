import express from "express";
import cors from "cors";

import connection from "./config/db.js"; 
import farmRouter from "./routes/farmRoutes.js";
import hiveRouter from "./routes/hiveRoutes.js";
import workshopRouter from "./routes/workshopRoutes.js";

const app = express();
const allowOrigins = ["http://localhost:5173"];

// Middleware
app.use(cors({ origin: allowOrigins }));
app.use(express.json({ limit: "50mb" }));               
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

// Routes
app.use("/api/farms", farmRouter);
app.use("/api/hives", hiveRouter);
app.use("/api/workshops", workshopRouter);

// ✅ Catch-all 404 must be LAST
app.use((req, res) => {
  console.log("Request came in:", req.method, req.url);
  res.status(404).json({ message: "Not Found" });
});

// Connect to DB
connection();

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
