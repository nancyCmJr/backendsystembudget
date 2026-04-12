const Presupuesto = require('../models/presupuesto');
const Cliente = require('../models/cliente');
const { calcularTotal } = require('../services/calculoService');

// ==============================
// SINCRONIZAR PRESUPUESTO
// ==============================
exports.syncPresupuesto = async (req, res) => {
  try {
    const { presupuesto, materiales, mano_obra, gastos, cliente } = req.body;

    // Validación básica
    if (!presupuesto || !presupuesto.local_id) {
      return res.status(400).json({
        error: 'Datos de presupuesto incompletos'
      });
    }

    // ==============================
    // EVITAR DUPLICADOS (POR USUARIO)
    // ==============================
    const existe = await Presupuesto.findOne({
      local_id: presupuesto.local_id,
      usuario: req.user.id 
    });

    if (existe) {
      return res.json({
        message: 'Presupuesto ya sincronizado',
        presupuesto: existe
      });
    }

    // ==============================
    // CREAR / BUSCAR CLIENTE
    // ==============================
    let clienteDB = null;

    if (cliente) {

      // buscar por local_id y usuario
      if (cliente.local_id) {
        clienteDB = await Cliente.findOne({
          local_id: cliente.local_id,
          usuario: req.user.id
        });
      }

      // si no existe → crear
      if (!clienteDB) {
        clienteDB = await Cliente.create({
          nombre: cliente.nombre,
          telefono: cliente.telefono,
          direccion: cliente.direccion,
          email: cliente.email,
          local_id: cliente.local_id,
          usuario: req.user.id
        });
      }
    }

    // ==============================
    // CREAR PRESUPUESTO
    // ==============================
    const nuevoPresupuesto = new Presupuesto({
      cliente: clienteDB ? clienteDB._id : null,

      descripcion: presupuesto.descripcion,
      estado: presupuesto.estado || 'pendiente',
      local_id: presupuesto.local_id,

      materiales: materiales || [],
      mano_obra: mano_obra || [],
      gastos: gastos || [],

      usuario: req.user.id, 
      sync: true
    });

    // ==============================
    // CALCULAR TOTAL
    // ==============================
    nuevoPresupuesto.total = calcularTotal(
      nuevoPresupuesto.materiales,
      nuevoPresupuesto.mano_obra,
      nuevoPresupuesto.gastos
    );

    await nuevoPresupuesto.save();

    // ==============================
    // RESPUESTA
    // ==============================
    res.json({
      message: 'Presupuesto sincronizado correctamente',
      presupuesto: nuevoPresupuesto
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: 'Error en sincronización'
    });
  }
};