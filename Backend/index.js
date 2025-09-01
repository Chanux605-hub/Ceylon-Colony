// backend/server.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import postRoutes from "./routes/postRoutes.js";

dotenv.config();

const app = express();

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
];

app.use(
  cors({
    origin: allowedOrigins,
    methods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

app.use(express.json());
app.use("/api", postRoutes);

app.get("/health", (req, res) => res.json({ ok: true }));

connectDB().then(() => {
  const port = process.env.PORT || 3000;
  app.listen(port, () =>
    console.log(`✅ API listening on http://localhost:${port}`)
  );
});
