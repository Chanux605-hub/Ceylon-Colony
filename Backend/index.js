import express from "express";
import cors from "cors";
import bodyParser from "body-parser";

import connection from "./config/db.js"; 
import farmRouter from "./routes/farmRoutes.js";
import hiveRouter from "./routes/hiveRoutes.js";
<<<<<<< HEAD
=======

//gima's crud
import productRouter from "./routes/product.routes.js"; // or productRoutes.js depending on your filename

>>>>>>> origin/Gima

const app = express();
const allowOrigins =['http://localhost:5173']

// Middleware
app.use(cors());
<<<<<<< HEAD
app.use(bodyParser.json());

// Routes
app.use("/api/farms", farmRouter);
app.use("/api/hives", hiveRouter)

// Connect to DB
connection();   

const PORT = process.env.PORT || 3000;
=======
//app.use(bodyParser.json());

app.use(express.json({ limit: "50mb" }));              
app.use(express.urlencoded({ extended: true, limit: "50mb" }));


// Routes
app.use("/api/farms", farmRouter);
app.use("/api/hives", hiveRouter)


app.use("/api/products", productRouter);

// Connect to DB
connection();   

const PORT = process.env.PORT || 4000;
>>>>>>> origin/Gima
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
