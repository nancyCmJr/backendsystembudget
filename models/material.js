const mongoose = require("mongoose");

const MaterialSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true
  },
  precio: {
    type: Number,
    required: true
  },
  categoria: {
    type: String
  },
  tienda: {
    type: String
  }
});

module.exports = mongoose.model("Material", MaterialSchema);