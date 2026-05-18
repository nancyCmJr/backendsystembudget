const Presupuesto = require('../models/presupuesto');
const Cliente = require('../models/cliente');
const Material = require('../models/material');
const { calcularTotal } = require('../services/calculoService');

// ==============================
// SINCRONIZAR CLIENTES
// ==============================
exports.syncClientes = async (req, res) => {
  try {
    const clientes = Array.isArray(req.body) ? req.body : [];

    let sincronizados = 0;
    let eliminados = 0;

    for (const c of clientes) {
      const localId = String(c.local_id || c.id || '');

      if (!localId) continue;

      if (c.deleted === 1 || c.deleted === true) {
        await Cliente.findOneAndDelete({
          local_id: localId,
          usuario: req.user.id
        });

        eliminados++;
        continue;
      }

      await Cliente.findOneAndUpdate(
        {
          local_id: localId,
          usuario: req.user.id
        },
        {
          nombre: c.nombre,
          telefono: c.telefono || '',
          direccion: c.direccion || '',
          email: c.email || '',
          local_id: localId,
          sync: true,
          deleted: false,
          usuario: req.user.id
        },
        {
          upsert: true,
          new: true,
          setDefaultsOnInsert: true
        }
      );

      sincronizados++;
    }

    res.json({
      message: 'Clientes sincronizados correctamente',
      sincronizados,
      eliminados
    });

  } catch (error) {
    console.error("ERROR SYNC CLIENTES:", error);

    res.status(500).json({
      error: 'Error sincronizando clientes',
      detalle: error.message
    });
  }
};

// ==============================
// SINCRONIZAR MATERIALES
// ==============================
exports.syncMateriales = async (req, res) => {
  try {
    const materiales = Array.isArray(req.body) ? req.body : [];

    let sincronizados = 0;
    let eliminados = 0;

    for (const m of materiales) {
      const localId = String(m.local_id || m.id || '');

      if (!localId) continue;

      if (m.deleted === 1 || m.deleted === true) {
        await Material.findOneAndDelete({
          local_id: localId,
          usuario: req.user.id
        });

        eliminados++;
        continue;
      }

      await Material.findOneAndUpdate(
        {
          local_id: localId,
          usuario: req.user.id
        },
        {
          nombre: m.nombre,
          precio: Number(m.precio || 0),
          unidad: m.unidad || 'pieza',
          origen: m.origen || 'local',
          categoria: m.categoria || '',
          tienda: m.tienda || '',
          local_id: localId,
          sync: true,
          deleted: false,
          usuario: req.user.id
        },
        {
          upsert: true,
          new: true,
          setDefaultsOnInsert: true
        }
      );

      sincronizados++;
    }

    res.json({
      message: 'Materiales sincronizados correctamente',
      sincronizados,
      eliminados
    });

  } catch (error) {
    console.error("ERROR SYNC MATERIALES:", error);

    res.status(500).json({
      error: 'Error sincronizando materiales',
      detalle: error.message
    });
  }
};

// ==============================
// SINCRONIZAR PRESUPUESTO COMPLETO
// ==============================
exports.syncPresupuesto = async (req, res) => {
  try {
    const {
      presupuesto,
      materiales,
      mano_obra,
      gastos,
      cliente
    } = req.body;

    if (!presupuesto || !presupuesto.local_id) {
      return res.status(400).json({
        error: 'Datos de presupuesto incompletos'
      });
    }

    const localIdPresupuesto = String(presupuesto.local_id);

    if (presupuesto.deleted === 1 || presupuesto.deleted === true) {
      await Presupuesto.findOneAndDelete({
        local_id: localIdPresupuesto,
        usuario: req.user.id
      });

      return res.json({
        message: 'Presupuesto eliminado en la nube'
      });
    }

    // ==============================
    // CREAR / ACTUALIZAR CLIENTE
    // ==============================
    let clienteDB = null;

    if (cliente) {
      const clienteLocalId = String(cliente.local_id || cliente.id || '');

      if (clienteLocalId) {
        clienteDB = await Cliente.findOneAndUpdate(
          {
            local_id: clienteLocalId,
            usuario: req.user.id
          },
          {
            nombre: cliente.nombre,
            telefono: cliente.telefono || '',
            direccion: cliente.direccion || '',
            email: cliente.email || '',
            local_id: clienteLocalId,
            sync: true,
            deleted: false,
            usuario: req.user.id
          },
          {
            upsert: true,
            new: true,
            setDefaultsOnInsert: true
          }
        );
      }
    }

    const datosPresupuesto = {
      cliente: clienteDB ? clienteDB._id : null,
      descripcion: presupuesto.descripcion || '',
      estado: presupuesto.estado || 'pendiente',
      fecha: presupuesto.fecha || new Date(),
      local_id: localIdPresupuesto,
      materiales: materiales || [],
      mano_obra: mano_obra || [],
      gastos: gastos || [],
      usuario: req.user.id,
      sync: true,
      deleted: false
    };

    datosPresupuesto.total = calcularTotal(
      datosPresupuesto.materiales,
      datosPresupuesto.mano_obra,
      datosPresupuesto.gastos
    );

    const presupuestoDB = await Presupuesto.findOneAndUpdate(
      {
        local_id: localIdPresupuesto,
        usuario: req.user.id
      },
      datosPresupuesto,
      {
        upsert: true,
        new: true,
        setDefaultsOnInsert: true
      }
    ).populate('cliente');

    res.json({
      message: 'Presupuesto sincronizado correctamente',
      presupuesto: presupuestoDB
    });

  } catch (error) {
    console.error("ERROR SYNC PRESUPUESTO:", error);

    res.status(500).json({
      error: 'Error en sincronización',
      detalle: error.message
    });
  }
};