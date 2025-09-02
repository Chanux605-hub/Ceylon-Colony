import express from "express";
import cors from "cors";
import bodyParser from "body-parser";

import connection from "./config/db.js"; 
import farmRouter from "./routes/farmRoutes.js";
import hiveRouter from "./routes/hiveRoutes.js";

const app = express();
const allowOrigins =['http://localhost:5173']

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Routes
app.use("/api/farms", farmRouter);
app.use("/api/hives", hiveRouter)

// Connect to DB
connection();   

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
