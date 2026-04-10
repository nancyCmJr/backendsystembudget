const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const conectarDB = require("./config/database");

dotenv.config();

const app = express();

// Conexión a Mongo
conectarDB();

// Middlewares
app.use(cors());
app.use(express.json());

// LOGIN 
app.use("/api/auth", require("./routes/auth"));
app.use("/api/presupuestos", require("./routes/presupuestos"));
app.use("/api/materiales", require("./routes/materiales"));

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Servidor corriendo en puerto " + PORT);
});