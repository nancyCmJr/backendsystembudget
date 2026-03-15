exports.actualizarPresupuesto = async (req, res) => {
  try {

    const presupuesto = await Presupuesto.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json(presupuesto);

  } catch (error) {
    res.status(500).json({ mensaje: "Error al actualizar presupuesto" });
  }
};

exports.eliminarPresupuesto = async (req, res) => {
  try {

    await Presupuesto.findByIdAndDelete(req.params.id);

    res.json({ mensaje: "Presupuesto eliminado" });

  } catch (error) {
    res.status(500).json({ mensaje: "Error al eliminar presupuesto" });
  }
};

