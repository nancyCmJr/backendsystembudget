const express = require("express");
const router = express.Router();
const controller = require("../controllers/presupuestosController");

router.get("/", controller.obtenerPresupuestos);

router.post("/", controller.crearPresupuesto);

router.put("/:id", controller.actualizarPresupuesto);

router.delete("/:id", controller.eliminarPresupuesto);

module.exports = router;
