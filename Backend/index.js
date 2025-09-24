import express from "express";
import cors from "cors";
<<<<<<< HEAD
//import bodyParser from "body-parser";
=======
>>>>>>> origin/Luhith

import connection from "./config/db.js"; 
import farmRouter from "./routes/farmRoutes.js";
import hiveRouter from "./routes/hiveRoutes.js";
<<<<<<< HEAD

import inventoryRoutes from "./routes/inventoryRoutes.js";



//gima's crud
import productRouter from "./routes/product.routes.js"; // or productRoutes.js depending on your filename


const app = express();
const allowOrigins =['http://localhost:5173']

// Middleware
app.use(cors());
//app.use(bodyParser.json());

app.use(express.json({ limit: "50mb" }));              
=======
import workshopRouter from "./routes/workshopRoutes.js";
import blogRouter from "./routes/blogRoutes.js";

// gima's crud
import productRouter from "./routes/product.routes.js";

// order routes
import orderDetailsRouter from "./routes/orderDetailsRouter.js"; 

const app = express();
const allowOrigins = ['http://localhost:5173'];

// Middleware

app.use(cors());

app.use(cors({ origin: allowOrigins }));
app.use(express.json({ limit: "50mb" }));               
>>>>>>> origin/Luhith
app.use(express.urlencoded({ extended: true, limit: "50mb" }));


// Routes
app.use("/api/farms", farmRouter);
<<<<<<< HEAD
app.use("/api/hives", hiveRouter)


app.use("/api/products", productRouter);
app.use("/api/inventory", inventoryRoutes);

// Connect to DB
connection();   

const PORT = process.env.PORT || 3000;
=======
app.use("/api/hives", hiveRouter);
app.use("/api/workshops", workshopRouter);
app.use("/api/blogs", blogRouter);

// Catch-all 404 must be LAST
app.use((req, res) => {
  console.log("Request came in:", req.method, req.url);
  res.status(404).json({ message: "Not Found" });
});


app.use("/api/products", productRouter);
app.use("/api/orderdetails", orderDetailsRouter); // ✅ Added

// Connect to DB
connection();

const PORT = 3000;
>>>>>>> origin/Luhith
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
