const Material = require("../models/material");
const preciosService = require("../services/preciosService");


// Obtener materiales guardados
exports.getMateriales = async (req, res) => {

  try {

    const materiales = await Material.find();

    res.json(materiales);

  } catch (error) {

    res.status(500).json({ error: "Error obteniendo materiales" });

  }

};



// Agregar material manualmente
exports.addMaterial = async (req, res) => {

  try {

    const { nombre, precio, categoria } = req.body;

    const material = new Material({
      nombre,
      precio,
      categoria,
      tienda: "manual"
    });

    await material.save();

    res.status(201).json(material);

  } catch (error) {

    res.status(500).json({ error: "Error agregando material" });

  }

};



// Buscar materiales en Home Depot
exports.searchMateriales = async (req, res) => {

  try {

    const query = req.query.q;

    const resultados = await preciosService.buscarEnHomeDepot(query);

    res.json(resultados);

  } catch (error) {

    res.status(500).json({ error: "Error buscando materiales" });

  }

};
