// src/middlewares/autenticar.js
// Se aplica a las rutas que requieren que el usuario esté logueado
// Uso: router.post('/', autenticar, controlador.crear)

const jwt = require('jsonwebtoken');

const autenticar = (req, res, next) => {
  // 1. Leer el header Authorization
  // Formato esperado: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  const authHeader = req.headers['authorization'];

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      error: 'Acceso denegado: se requiere autenticación',
      instruccion: 'Incluir el header: Authorization: Bearer <token>'
    });
  }

  // 2. Extraer el token (quitar "Bearer " del inicio)
  const token = authHeader.split(' ')[1];

  try {
    // 3. Verificar la firma del token con el mismo secreto que se usó para crearlo
    // Si la firma no coincide o el token expiró, jwt.verify lanza una excepción
    const payload = jwt.verify(token, process.env.JWT_SECRET);

    // 4. Adjuntar los datos del usuario al objeto req para usarlos en el controlador
    req.usuario = payload; // { id, email, nombre, iat, exp }

    // 5. Pasar al siguiente middleware o controlador
    next();

  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        error: 'Token expirado – inicia sesión nuevamente'
      });
    }
    return res.status(401).json({
      error: 'Token inválido'
    });
  }
};

module.exports = autenticar;