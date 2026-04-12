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

app.use("/api/auth", require("./routes/auth"));
app.use("/api/presupuestos", require("./routes/presupuestos"));
app.use("/api/materiales", require("./routes/materiales"));
app.use('/api/clientes', require('./routes/clientes'))
app.use('/api/sync', require('./routes/sync'));
app.use('/api/precios', require('./routes/precios'));

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Servidor corriendo en puerto " + PORT);
});

const errorHandler = require('./middleware/errorHandler');

app.use(errorHandler);

const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 60 * 1000, // 1 min
  max: 10 // max 10 requests
});

app.use('/api/precios', limiter);