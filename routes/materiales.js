const express = require("express");
const router = express.Router();
const controller = require("../controllers/materialesController");

router.get("/", controller.obtenerMateriales);

router.post("/", controller.crearMaterial);

router.put("/:id", controller.actualizarMaterial);

router.delete("/:id", controller.eliminarMaterial);

module.exports = router;