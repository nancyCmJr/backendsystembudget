const Presupuesto = require("../models/presupuesto");

// Obtener todos los presupuestos
exports.obtenerPresupuestos = async (req, res) => {
  try {

    const presupuestos = await Presupuesto.find();

    res.json(presupuestos);

  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: "Error al obtener presupuestos" });
  }
};


// Crear nuevo presupuesto
exports.crearPresupuesto = async (req, res) => {
  try {

    const nuevoPresupuesto = new Presupuesto(req.body);

    const presupuestoGuardado = await nuevoPresupuesto.save();

    res.json(presupuestoGuardado);

  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: "Error al crear presupuesto" });
  }
};


// Actualizar presupuesto
exports.actualizarPresupuesto = async (req, res) => {
  try {

    const presupuesto = await Presupuesto.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json(presupuesto);

  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: "Error al actualizar presupuesto" });
  }
};


// Eliminar presupuesto
exports.eliminarPresupuesto = async (req, res) => {
  try {

    await Presupuesto.findByIdAndDelete(req.params.id);

    res.json({ mensaje: "Presupuesto eliminado" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: "Error al eliminar presupuesto" });
  }
};
