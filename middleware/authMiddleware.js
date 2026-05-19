const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({
        error: 'Acceso denegado. Falta Authorization header'
      });
    }

    if (!authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        error: 'Formato de token inválido. Usa Bearer TOKEN'
      });
    }

    const token = authHeader.split(' ')[1];

    if (!token || token === 'null' || token === 'undefined') {
      return res.status(401).json({
        error: 'Token requerido'
      });
    }

    if (!process.env.JWT_SECRET) {
      return res.status(500).json({
        error: 'JWT_SECRET no configurado en el servidor'
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded;

    next();

  } catch (error) {
    console.error("ERROR JWT:", error.message);

    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        error: 'Token expirado. Inicia sesión nuevamente'
      });
    }

    return res.status(401).json({
      error: 'Token inválido'
    });
  }
};