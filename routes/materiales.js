const express = require('express');
const router = express.Router();
const controller = require('../controllers/materialesController');
const auth = require('../middleware/authMiddleware');

router.post('/', auth, controller.crearMaterial);
router.get('/', auth, controller.obtenerMateriales);
router.put('/:id', auth, controller.actualizarMaterial);
router.delete('/:id', auth, controller.eliminarMaterial);

module.exports = router;