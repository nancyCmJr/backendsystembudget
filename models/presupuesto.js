const mongoose = require("mongoose");

const PresupuestoSchema = new mongoose.Schema({
  cliente: String,
  direccion: String,
  materiales: Array,
  mano_obra: Number,
  gastos: Number,
  total: Number,
  fecha: Date
});

module.exports = mongoose.model("Presupuesto", PresupuestoSchema);