const express = require("express");
const dbConnection = require("./config/db");

const app = express();

//db connection
dbConnection();

app.get("/", (req, res) => res.send("Hello Server is Running.."));

const PORT =3000;

app.listen(PORT, () => console.log(`Server running on PORT ${PORT}`));