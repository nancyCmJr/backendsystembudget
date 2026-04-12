const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const auth = require('../middleware/authMiddleware');

// REGISTRO
router.post('/register', async (req, res) => {
  try {
    const { email, password } = req.body;

    //Validaciones
    if (!email || !password) {
      return res.status(400).json({ message: 'Datos incompletos' });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: 'Mínimo 6 caracteres' });
    }

    const existe = await User.findOne({ email });
    if (existe) {
      return res.status(400).json({ message: 'Usuario ya existe' });
    }

    const hashed = await bcrypt.hash(password, 10);

    const user = new User({
      email,
      password: hashed
    });

    await user.save();

    res.json({ message: 'Usuario creado' });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// LOGIN
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Datos incompletos' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Usuario no existe' });
    }

    const valido = await bcrypt.compare(password, user.password);
    if (!valido) {
      return res.status(400).json({ message: 'Contraseña incorrecta' });
    }

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      token,
      userId: user._id
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// OBTENER USUARIO ACTUAL
router.get('/me', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


module.exports = router;