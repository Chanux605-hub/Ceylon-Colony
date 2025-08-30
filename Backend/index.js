// backend/server.js
const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { connectDB } = require("./config/db");
const postRoutes = require("./routes/postRoutes");

const app = express();

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
];

app.use(cors({
  origin: allowedOrigins,
  methods: ["GET","POST","PATCH","DELETE","OPTIONS"],
  allowedHeaders: ["Content-Type","Authorization"],
  credentials: true,
}));


app.use(express.json());
app.use("/api", postRoutes);

app.get("/health", (req, res) => res.json({ ok: true }));

connectDB().then(() => {
  const port = process.env.PORT || 4000;
  app.listen(port, () => console.log("API listening on", port));
});
