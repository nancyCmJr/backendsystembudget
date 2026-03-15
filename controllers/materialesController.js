const Material = require("../models/material");
const preciosService = require("../services/preciosService");

exports.getMateriales = async (req, res) => {

  try {

    const materiales = await Material.getAll();

    res.json(materiales);

  } catch (error) {

    res.status(500).json({ error: "Error obteniendo materiales" });

  }

};


exports.addMaterial = async (req, res) => {

  try {

    const { name, price } = req.body;

    const material = await Material.create(name, price);

    res.status(201).json(material);

  } catch (error) {

    res.status(500).json({ error: "Error agregando material" });

  }

};


exports.searchMateriales = async (req, res) => {

  try {

    const query = req.query.q;

    const resultados = await preciosService.buscarEnHomeDepot(query);

    res.json(resultados);

  } catch (error) {

    res.status(500).json({ error: "Error buscando materiales" });

  }

};
