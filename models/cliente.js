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
      trim: true,
      default: ''
    },

    direccion: {
      type: String,
      trim: true,
      default: ''
    },

    email: {
      type: String,
      trim: true,
      lowercase: true,
      default: ''
    },

    local_id: {
      type: String
    },

    sync: {
      type: Boolean,
      default: true
    },

    deleted: {
      type: Boolean,
      default: false
    },

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

clienteSchema.index(
  { local_id: 1, usuario: 1 },
  {
    unique: true,
    partialFilterExpression: {
      local_id: { $type: 'string' }
    }
  }
);

module.exports = mongoose.model('Cliente', clienteSchema);