const express = require('express');
const router = express.Router();

const syncController = require('../controllers/syncController');
const auth = require('../middleware/authMiddleware');

router.post('/clientes', auth, syncController.syncClientes);
router.post('/materiales', auth, syncController.syncMateriales);
router.post('/presupuesto', auth, syncController.syncPresupuesto);

module.exports = router;