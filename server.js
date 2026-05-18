const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const rateLimit = require('express-rate-limit');

const conectarDB = require("./config/database");
const errorHandler = require('./middleware/errorHandler');

dotenv.config();

const app = express();

// ==============================
// CONEXIÓN A MONGO
// ==============================
conectarDB();

// ==============================
// MIDDLEWARES
// ==============================
app.use(cors());
app.use(express.json());

// ==============================
// RATE LIMIT PARA PRECIOS
// ==============================
const preciosLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 10,
  message: {
    error: 'Demasiadas solicitudes de precios. Intenta nuevamente en un minuto.'
  }
});

// ==============================
// RUTAS
// ==============================
app.use("/api/auth", require("./routes/auth"));
app.use("/api/presupuestos", require("./routes/presupuestos"));
app.use("/api/materiales", require("./routes/materiales"));
app.use("/api/clientes", require("./routes/clientes"));
app.use("/api/sync", require("./routes/sync"));

app.use("/api/precios", preciosLimiter);
app.use("/api/precios", require("./routes/precios"));

// ==============================
// MANEJO DE ERRORES
// ==============================
app.use(errorHandler);

// ==============================
// SERVIDOR
// ==============================
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Servidor corriendo en puerto " + PORT);
});