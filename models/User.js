const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },

  //opcional pero recomendado
  role: {
    type: String,
    default: 'user'
  }

}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);