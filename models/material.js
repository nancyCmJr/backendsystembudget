const mongoose = require("mongoose");

const MaterialSchema = new mongoose.Schema(
  {
    nombre: {
      type: String,
      required: true,
      trim: true
    },

    precio: {
      type: Number,
      required: true,
      default: 0
    },

    unidad: {
      type: String,
      default: "pieza"
    },

    origen: {
      type: String,
      default: "local"
    },

    categoria: {
      type: String,
      default: ""
    },

    tienda: {
      type: String,
      default: ""
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

MaterialSchema.index(
  { local_id: 1, usuario: 1 },
  {
    unique: true,
    partialFilterExpression: {
      local_id: { $type: 'string' }
    }
  }
);

module.exports = mongoose.model("Material", MaterialSchema);