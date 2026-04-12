const Material = require('../models/material');

//Crear material
exports.crearMaterial = async (req, res) => {
  try {
    const material = new Material({
      ...req.body,
      usuario: req.user.id
    });

    await material.save();
    res.status(201).json(material);

  } catch (error) {
    res.status(500).json({ error: 'Error al crear material' });
  }
};


//Obtener materiales
exports.obtenerMateriales = async (req, res) => {
  try {
    const materiales = await Material
      .find({ usuario: req.user.id })
      .sort({ createdAt: -1 });

    res.json(materiales);

  } catch (error) {
    res.status(500).json({ error: 'Error al obtener materiales' });
  }
};


//Obtener por ID
exports.obtenerMaterialPorId = async (req, res) => {
  try {
    const material = await Material.findOne({
      _id: req.params.id,
      usuario: req.user.id
    });

    if (!material) {
      return res.status(404).json({ error: 'Material no encontrado' });
    }

    res.json(material);

  } catch (error) {
    res.status(500).json({ error: 'Error al obtener material' });
  }
};


//Actualizar
exports.actualizarMaterial = async (req, res) => {
  try {
    const material = await Material.findOneAndUpdate(
      {
        _id: req.params.id,
        usuario: req.user.id
      },
      req.body,
      { new: true }
    );

    if (!material) {
      return res.status(404).json({ error: 'Material no encontrado' });
    }

    res.json(material);

  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar material' });
  }
};


//Eliminar
exports.eliminarMaterial = async (req, res) => {
  try {
    const material = await Material.findOneAndDelete({
      _id: req.params.id,
      usuario: req.user.id
    });

    if (!material) {
      return res.status(404).json({ error: 'Material no encontrado' });
    }

    res.json({ message: 'Material eliminado correctamente' });

  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar material' });
  }
};


//SINCRONIZACIÓN
exports.syncMateriales = async (req, res) => {
  try {
    const materiales = req.body;

    let insertados = 0;

    for (let mat of materiales) {
      const existe = await Material.findOne({
        local_id: mat.local_id,
        usuario: req.user.id
      });

      if (!existe) {
        const nuevo = new Material({
          nombre: mat.nombre,
          precio: mat.precio,
          unidad: mat.unidad,
          origen: mat.origen,
          local_id: mat.local_id,
          sync: true,
          usuario: req.user.id
        });

        await nuevo.save();
        insertados++;
      }
    }

    res.json({
      message: 'Sincronización de materiales completa',
      insertados
    });

  } catch (error) {
    res.status(500).json({ error: 'Error en sync de materiales' });
  }
};