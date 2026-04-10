const mongoose = require("mongoose");

const PresupuestoSchema = new mongoose.Schema({
  cliente: String,
  descripcion: String,
  materiales: Array,
  manoObra: Number,
  gastos: Number,
  total: Number,
  fecha: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Presupuesto", PresupuestoSchema);
