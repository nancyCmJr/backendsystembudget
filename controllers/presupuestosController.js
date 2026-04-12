const Presupuesto = require('../models/presupuesto');
const Cliente = require('../models/cliente');
const { calcularTotal } = require('../services/calculoService');

// ==============================
// CREAR PRESUPUESTO
// ==============================
exports.crearPresupuesto = async (req, res) => {
  try {
    const { cliente, descripcion, estado, materiales, mano_obra, gastos, local_id } = req.body;

    if (!local_id) {
      return res.status(400).json({ error: 'local_id es obligatorio' });
    }

    // evitar duplicados POR USUARIO
    const existe = await Presupuesto.findOne({
      local_id,
      usuario: req.user.id
    });

    if (existe) {
      return res.json({ message: 'Presupuesto ya existe', presupuesto: existe });
    }

    // ==============================
    // CLIENTE
    // ==============================
    let clienteDB = null;

    if (cliente) {
      if (cliente.local_id) {
        clienteDB = await Cliente.findOne({
          local_id: cliente.local_id,
          usuario: req.user.id
        });
      }

      if (!clienteDB) {
        clienteDB = await Cliente.create({
          ...cliente,
          usuario: req.user.id 
        });
      }
    }

    // ==============================
    // PRESUPUESTO
    // ==============================
    const nuevo = new Presupuesto({
      cliente: clienteDB ? clienteDB._id : null,
      descripcion,
      estado: estado || 'pendiente',
      local_id,

      materiales: materiales || [],
      mano_obra: mano_obra || [],
      gastos: gastos || [],

      usuario: req.user.id, 
      sync: true
    });

    // calcular total
    nuevo.total = calcularTotal(
      nuevo.materiales,
      nuevo.mano_obra,
      nuevo.gastos
    );

    await nuevo.save();

    res.status(201).json(nuevo);

  } catch (error) {
    res.status(500).json({ error: 'Error creando presupuesto' });
  }
};


// ==============================
// OBTENER TODOS
// ==============================
exports.obtenerPresupuestos = async (req, res) => {
  try {
    const presupuestos = await Presupuesto
      .find({ usuario: req.user.id }) 
      .populate('cliente')
      .sort({ fecha: -1 });

    res.json(presupuestos);

  } catch (error) {
    res.status(500).json({ error: 'Error obteniendo presupuestos' });
  }
};


// ==============================
// OBTENER POR ID 
// ==============================
exports.obtenerPresupuestoPorId = async (req, res) => {
  try {
    const presupuesto = await Presupuesto.findOne({
      _id: req.params.id,
      usuario: req.user.id
    }).populate('cliente');

    if (!presupuesto) {
      return res.status(404).json({ error: 'No encontrado' });
    }

    res.json(presupuesto);

  } catch (error) {
    res.status(500).json({ error: 'Error obteniendo presupuesto' });
  }
};


// ==============================
// ACTUALIZAR 
// ==============================
exports.actualizarPresupuesto = async (req, res) => {
  try {
    const { materiales, mano_obra, gastos, descripcion, estado } = req.body;

    const presupuesto = await Presupuesto.findOne({
      _id: req.params.id,
      usuario: req.user.id
    });

    if (!presupuesto) {
      return res.status(404).json({ error: 'No encontrado' });
    }

    if (descripcion !== undefined) presupuesto.descripcion = descripcion;
    if (estado !== undefined) presupuesto.estado = estado;
    if (materiales) presupuesto.materiales = materiales;
    if (mano_obra) presupuesto.mano_obra = mano_obra;
    if (gastos) presupuesto.gastos = gastos;

    // recalcular total
    presupuesto.total = calcularTotal(
      presupuesto.materiales,
      presupuesto.mano_obra,
      presupuesto.gastos
    );

    await presupuesto.save();

    res.json(presupuesto);

  } catch (error) {
    res.status(500).json({ error: 'Error actualizando presupuesto' });
  }
};


// ==============================
// ELIMINAR
// ==============================
exports.eliminarPresupuesto = async (req, res) => {
  try {
    const eliminado = await Presupuesto.findOneAndDelete({
      _id: req.params.id,
      usuario: req.user.id // 🔥 clave
    });

    if (!eliminado) {
      return res.status(404).json({ error: 'No encontrado' });
    }

    res.json({ message: 'Presupuesto eliminado' });

  } catch (error) {
    res.status(500).json({ error: 'Error eliminando presupuesto' });
  }
};