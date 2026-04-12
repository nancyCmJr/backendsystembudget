const express = require('express');
const router = express.Router();
const controller = require('../controllers/preciosController');

router.post('/', controller.obtenerPrecios);
router.post('/comparar', controller.compararPrecios);
router.post('/forzar', controller.forzarActualizacion);
router.delete('/cache', controller.limpiarCache);

module.exports = router;