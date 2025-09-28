import express from "express";
import cors from "cors";
//import bodyParser from "body-parser";

import connection from "./config/db.js"; 
import farmRouter from "./routes/farmRoutes.js";
import hiveRouter from "./routes/hiveRoutes.js";
import farmAnalyticsRoutes from "./routes/farmAnalyticsRoutes.js";


import inventoryRoutes from "./routes/inventory.routes.js";
import orderDetailsRouter from "./routes/orderDetailsRouter.js";
import analyticsRouter from "./routes/analytics.routes.js";



import workshopRouter from "./routes/workshopRoutes.js";
import blogRouter from "./routes/blogRoutes.js";
import harvestRoutes from "./routes/harvestRoutes.js";

//gima's crud
import productRouter from "./routes/product.routes.js"; // or productRoutes.js depending on your filename


const app = express();
const allowOrigins =['http://localhost:5173']

// Middleware
app.use(cors());
//app.use(bodyParser.json());

app.use(express.json({ limit: "50mb" }));              
app.use(express.urlencoded({ extended: true, limit: "50mb" }));


// Routes
app.use("/api/farms", farmRouter);

app.use("/api/hives", hiveRouter)

app.use("/api/hives", hiveRouter);
app.use("/api/workshops", workshopRouter);
app.use("/api/blogs", blogRouter);
app.use("/api/harvests", harvestRoutes);
app.use("/api/products", productRouter);
app.use("/api/products", productRouter);
app.use("/api/inventory", inventoryRoutes);
app.use("/api/analytics", analyticsRouter);
app.use("/api/farm-analytics", farmAnalyticsRoutes);

app.use("/api/orderdetails", orderDetailsRouter);



// Catch-all 404 must be LAST
app.use((req, res) => {
  console.log("Request came in:", req.method, req.url);
  res.status(404).json({ message: "Not Found" });
});

// Connect to DB
connection();   

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
