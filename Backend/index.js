import express from "express";
import cors from "cors";
import bodyParser from "body-parser";

import connection from "./config/db.js";   // ✅ will now import the function
import farmRouter from "./routes/farmRoutes.js";

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Routes
app.use("/api/farms", farmRouter);

// Connect to DB
connection();   // ✅ now works

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
