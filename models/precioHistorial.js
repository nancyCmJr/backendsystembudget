const mongoose = require('mongoose');

const precioHistorialSchema = new mongoose.Schema({
  material: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Material'
  },

  nombre: String, // redundante para consultas rápidas

  tienda: String, // "home_depot", "coel", etc.

  precio: Number,

  zona: String, // Puebla, CDMX, etc.

  fecha: {
    type: Date,
    default: Date.now
  }
});

precioHistorialSchema.index({ nombre: 1, zona: 1, fecha: -1 });

module.exports = mongoose.model('PrecioHistorial', precioHistorialSchema);