import express from "express";
import cors from "cors";

import connection from "./config/db.js"; 
import farmRouter from "./routes/farmRoutes.js";
import hiveRouter from "./routes/hiveRoutes.js";
import workshopRouter from "./routes/workshopRoutes.js";
import blogRouter from "./routes/blogRoutes.js";

// gima's crud
import productRouter from "./routes/product.routes.js";

// order routes
import orderDetailsRouter from "./routes/orderDetailsRouter.js"; 

const app = express();
<<<<<<< HEAD
const allowOrigins = ['http://localhost:5173'];
=======
const allowOrigins = ["http://localhost:5173"];
>>>>>>> ae3ad73e01efe8e97025e5cc782f54f0176240fa

// Middleware

app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

<<<<<<< HEAD
// Routes
app.use("/api/farms", farmRouter);
app.use("/api/hives", hiveRouter);
=======
=======
app.use(cors({ origin: allowOrigins }));
app.use(express.json({ limit: "50mb" }));               
app.use(express.urlencoded({ extended: true, limit: "50mb" }));


// Routes
app.use("/api/farms", farmRouter);
app.use("/api/hives", hiveRouter);
app.use("/api/workshops", workshopRouter);
app.use("/api/blogs", blogRouter);

// Catch-all 404 must be LAST
app.use((req, res) => {
  console.log("Request came in:", req.method, req.url);
  res.status(404).json({ message: "Not Found" });
});


>>>>>>> ae3ad73e01efe8e97025e5cc782f54f0176240fa
app.use("/api/products", productRouter);
app.use("/api/orderdetails", orderDetailsRouter); // ✅ Added

// Connect to DB
connection();

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
