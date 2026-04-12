const Cliente = require('../models/cliente');

//Crear cliente
exports.crearCliente = async (req, res) => {
  try {
    const cliente = new Cliente({
      ...req.body,
      usuario: req.user.id //para separar los clientes de cada usuario 
    });

    await cliente.save();
    res.status(201).json(cliente);

  } catch (error) {
    res.status(500).json({ error: 'Error al crear cliente' });
  }
};


//Obtener todos los clientes
exports.obtenerClientes = async (req, res) => {
  try {
    const clientes = await Cliente
      .find({ usuario: req.user.id }) //obtener los clientes por usuario
      .sort({ _id: -1 });

    res.json(clientes);

  } catch (error) {
    res.status(500).json({ error: 'Error al obtener clientes' });
  }
};


//Obtener cliente por ID
exports.obtenerClientePorId = async (req, res) => {
  try {
    const cliente = await Cliente.findOne({
      _id: req.params.id,
      usuario: req.user.id
    });

    if (!cliente) {
      return res.status(404).json({ error: 'Cliente no encontrado' });
    }

    res.json(cliente);

  } catch (error) {
    res.status(500).json({ error: 'Error al obtener cliente' });
  }
};


//Actualizar cliente
exports.actualizarCliente = async (req, res) => {
  try {
    const cliente = await Cliente.findOneAndUpdate(
      {
        _id: req.params.id,
        usuario: req.user.id
      },
      req.body,
      { new: true }
    );

    if (!cliente) {
      return res.status(404).json({ error: 'Cliente no encontrado' });
    }

    res.json(cliente);

  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar cliente' });
  }
};


//Eliminar cliente
exports.eliminarCliente = async (req, res) => {
  try {
    const cliente = await Cliente.findOneAndDelete({
      _id: req.params.id,
      usuario: req.user.id
    });

    if (!cliente) {
      return res.status(404).json({ error: 'Cliente no encontrado' });
    }

    res.json({ message: 'Cliente eliminado correctamente' });

  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar cliente' });
  }
};