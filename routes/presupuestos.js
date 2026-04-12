const express = require('express');
const router = express.Router();
const controller = require('../controllers/presupuestosController');
const auth = require('../middleware/authMiddleware');

router.post('/', auth, controller.crearPresupuesto);
router.get('/', auth, controller.obtenerPresupuestos);
router.get('/:id', auth, controller.obtenerPresupuestoPorId);
router.put('/:id', auth, controller.actualizarPresupuesto);
router.delete('/:id', auth, controller.eliminarPresupuesto);

module.exports = router;