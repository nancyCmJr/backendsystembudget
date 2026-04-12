const mongoose = require('mongoose');


// SUBDOCUMENTOS

const materialSchema = new mongoose.Schema({
  nombre: String,
  cantidad: Number,
  precio: Number,
  subtotal: Number
});

const manoObraSchema = new mongoose.Schema({
  descripcion: String,
  cantidad: Number,
  precio: Number,
  subtotal: Number
});

const gastoSchema = new mongoose.Schema({
  descripcion: String,
  monto: Number
});


// PRESUPUESTO

const presupuestoSchema = new mongoose.Schema(
  {
    cliente: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Cliente'
    },

    fecha: {
      type: Date,
      default: Date.now
    },

    total: {
      type: Number,
      default: 0
    },

    descripcion: String,

    estado: {
      type: String,
      default: "pendiente"
    },

    sync: {
      type: Boolean,
      default: false
    },

    local_id: {
      type: String,
      unique: true,
      sparse: true
    },

    materiales: [materialSchema],
    mano_obra: [manoObraSchema],
    gastos: [gastoSchema],

    usuario: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Presupuesto', presupuestoSchema);