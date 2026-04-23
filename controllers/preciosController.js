const preciosService = require('../services/preciosService');

// ==============================
// OBTENER PRECIOS 
// ==============================
exports.obtenerPrecios = async (req, res) => {
  try {
    const { nombre, zona } = req.body;

    if (!nombre) {
      return res.status(400).json({
        error: 'El nombre del material es obligatorio'
      });
    }

    const precios = await preciosService.obtenerPrecios(
      nombre,
      zona || "Puebla"
    );

    res.json(precios);

  }catch (error) {
  console.error("ERROR PRECIOS:", error);
  res.status(500).json({ 
    error: "Error obteniendo precios",
    detalle: error.message
  });
}
};


// ==============================
// SOLO COMPARACIÓN
// ==============================
exports.compararPrecios = async (req, res) => {
  try {
    const { nombre, zona } = req.body;

    if (!nombre) {
      return res.status(400).json({
        error: 'El nombre es obligatorio'
      });
    }

    const data = await preciosService.obtenerPrecios(
      nombre,
      zona || "Puebla"
    );

    res.json({
      comparacion: data.comparacion,
      cache: data.cache
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: 'Error comparando precios'
    });
  }
};


// ==============================
// LIMPIAR CACHE MANUAL
// ==============================
exports.limpiarCache = async (req, res) => {
  try {
    await preciosService.limpiarCache();

    res.json({
      message: 'Cache limpiado correctamente'
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: 'Error limpiando cache'
    });
  }
};


// ==============================
// FORZAR SCRAPING (ignorar cache)
// ==============================
exports.forzarActualizacion = async (req, res) => {
  try {
    const { nombre, zona } = req.body;

    if (!nombre) {
      return res.status(400).json({
        error: 'El nombre es obligatorio'
      });
    }

    // eliminar cache en memoria manualmente
    const key = `${nombre}-${zona || "Puebla"}`;

    if (preciosService.cacheMemoria) {
      preciosService.cacheMemoria.delete(key);
    }

    // obtener datos frescos
    const data = await preciosService.obtenerPrecios(
      nombre,
      zona || "Puebla"
    );

    res.json({
      ...data,
      forzado: true
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: 'Error forzando actualización'
    });
  }
};