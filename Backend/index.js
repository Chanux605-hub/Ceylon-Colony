import express from "express";
import cors from "cors";


import connection from "./config/db.js"; 



// workshops
import workshopRouter from "./routes/workshop.routes.js";


const app = express();
const allowOrigins =['http://localhost:5173']

// Middleware
app.use(cors());
//app.use(bodyParser.json());

app.use(express.json({ limit: "50mb" }));              
app.use(express.urlencoded({ extended: true, limit: "50mb" }));


// Routes





app.use("/api/workshops", workshopRouter);

// Connect to DB
connection();   

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});