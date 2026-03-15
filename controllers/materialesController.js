const Material = require("../models/material");

exports.obtenerMateriales = async (req, res) => {
  try {
    const materiales = await Material.find();
    res.json(materiales);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al obtener materiales" });
  }
};

exports.crearMaterial = async (req, res) => {
  try {
    const nuevo = new Material(req.body);
    await nuevo.save();
    res.json(nuevo);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al crear material" });
  }
};

exports.actualizarMaterial = async (req, res) => {
  try {
    const material = await Material.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json(material);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al actualizar material" });
  }
};

exports.eliminarMaterial = async (req, res) => {
  try {
    await Material.findByIdAndDelete(req.params.id);
    res.json({ mensaje: "Material eliminado" });
  } catch (error) {
    res.status(500).json({ mensaje: "Error al eliminar material" });
  }
};