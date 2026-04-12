const express = require('express');
const router = express.Router();
const controller = require('../controllers/clientesController');
const auth = require('../middleware/authMiddleware');

router.post('/', auth, controller.crearCliente);
router.get('/', auth, controller.obtenerClientes);
router.put('/:id', auth, controller.actualizarCliente);
router.delete('/:id', auth, controller.eliminarCliente);

module.exports = router;