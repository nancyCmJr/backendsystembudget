const mongoose = require('mongoose');

const clienteSchema = new mongoose.Schema(
  {
    nombre: {
      type: String,
      required: true,
      trim: true
    },

    telefono: {
      type: String,
      trim: true
    },

    direccion: {
      type: String,
      trim: true
    },

    email: {
      type: String,
      trim: true,
      lowercase: true
    },

    // para evitar duplicados en sincronización
    local_id: {
      type: String,
      unique: true,
      sparse: true
    },

    // Control de sincronización
    sync: {
      type: Boolean,
      default: true
    },

    usuario: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    }
  },
  {
    timestamps: true // createdAt y updatedAt automáticamente
  }
);

module.exports = mongoose.model('Cliente', clienteSchema);