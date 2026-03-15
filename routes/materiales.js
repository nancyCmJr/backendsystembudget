const express = require("express");
const router = express.Router();

const materialesController = require("../controllers/materialesController");

router.get("/", materialesController.getMateriales);

router.post("/", materialesController.addMaterial);

router.get("/search", materialesController.searchMateriales);

module.exports = router;
