const mongoose = require('mongoose');

// ==============================
// SUBDOCUMENTOS
// ==============================
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

// ==============================
// PRESUPUESTO
// ==============================
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

    descripcion: {
      type: String,
      default: ''
    },

    estado: {
      type: String,
      default: "pendiente"
    },

    sync: {
      type: Boolean,
      default: true
    },

    deleted: {
      type: Boolean,
      default: false
    },

    local_id: {
      type: String
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

presupuestoSchema.index(
  { local_id: 1, usuario: 1 },
  {
    unique: true,
    partialFilterExpression: {
      local_id: { $type: 'string' }
    }
  }
);

module.exports = mongoose.model('Presupuesto', presupuestoSchema);