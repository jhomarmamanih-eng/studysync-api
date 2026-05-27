// src/controllers/AuthController.js
// Controlador responsable del manejo de la autenticación de usuarios.
// Sigue el principio de responsabilidad única de la arquitectura limpia.

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const prisma = require('../db');

/**
 * Registra un nuevo usuario en el sistema.
 * Encripta la contraseña de forma segura con un algoritmo de hashing de una vía (bcryptjs).
 */
const registrar = async (req, res) => {
  try {
    const { nombre, email, password } = req.body;

    // 1. Validar requerimientos mínimos del cuerpo
    if (!email || !password) {
      return res.status(400).json({ error: 'El email y la contraseña son obligatorios.' });
    }

    // 2. Verificar si el usuario ya existe en la base de datos
    const usuarioExistente = await prisma.usuario.findUnique({
      where: { email: email.toLowerCase().trim() }
    });

    if (usuarioExistente) {
      return res.status(409).json({ error: 'Ya existe una cuenta registrada con este correo electrónico.' });
    }

    // 3. Hashear la contraseña con salado adaptativo (10 rounds de bcrypt por seguridad/rendimiento balanceado)
    const hashContrasena = await bcrypt.hash(password, 10);

    // 4. Guardar en PostgreSQL usando Prisma
    const nuevoUsuario = await prisma.usuario.create({
      data: {
        nombre: nombre || 'Estudiante UPDS',
        email: email.toLowerCase().trim(),
        password: hashContrasena
      }
    });

    // 5. Responder omitiendo la contraseña hasheada por motivos de seguridad
    res.status(201).json({
      mensaje: 'Usuario registrado exitosamente.',
      usuario: {
        id: nuevoUsuario.id,
        nombre: nuevoUsuario.nombre,
        email: nuevoUsuario.email,
        creadoEn: nuevoUsuario.creadoEn
      }
    });

  } catch (error) {
    console.error('[AUTH REGISTER ERROR]:', error.message);
    res.status(500).json({ error: 'Error interno al registrar el usuario en el servidor.' });
  }
};

/**
 * Inicia sesión de un usuario existente.
 * Valida credenciales e inyecta un token firmado JWT válido por 2 horas.
 */
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Validar campos obligatorios
    if (!email || !password) {
      return res.status(400).json({ error: 'El email y la contraseña son campos requeridos.' });
    }

    // 2. Localizar el usuario por email
    const usuario = await prisma.usuario.findUnique({
      where: { email: email.toLowerCase().trim() }
    });

    // 3. Si el usuario no existe, retornar un error genérico para evitar divulgación de cuentas
    if (!usuario) {
      return res.status(401).json({ error: 'Credenciales inválidas (correo o contraseña incorrectos).' });
    }

    // 4. Comparar el hash de la base de datos con la contraseña recibida
    const contrasenaValida = await bcrypt.compare(password, usuario.password);
    if (!contrasenaValida) {
      return res.status(401).json({ error: 'Credenciales inválidas (correo o contraseña incorrectos).' });
    }

    // 5. Generar token JWT firmado
    const token = jwt.sign(
      {
        id: usuario.id,
        email: usuario.email,
        nombre: usuario.nombre
      },
      process.env.JWT_SECRET || 'semilla_secreta_upds_2026',
      {
        expiresIn: '2h' // Expiración exacta de 2 horas
      }
    );

    // 6. Retornar los datos del perfil y el token de sesión
    res.status(200).json({
      mensaje: 'Sesión iniciada exitosamente.',
      token,
      usuario: {
        id: usuario.id,
        nombre: usuario.nombre,
        email: usuario.email
      }
    });

  } catch (error) {
    console.error('[AUTH LOGIN ERROR]:', error.message);
    res.status(500).json({ error: 'Error interno al procesar el inicio de sesión.' });
  }
};

/**
 * Obtiene el perfil completo del usuario autenticado actual.
 * Requiere que la petición haya cruzado el middleware de verificación.
 */
const obtenerPerfil = async (req, res) => {
  try {
    // req.usuario es inyectado previamente por el middleware de autenticación
    const usuario = await prisma.usuario.findUnique({
      where: { id: req.usuario.id }
    });

    if (!usuario) {
      return res.status(404).json({ error: 'Perfil de usuario no localizado en el sistema.' });
    }

    res.status(200).json({
      usuario: {
        id: usuario.id,
        nombre: usuario.nombre,
        email: usuario.email,
        creadoEn: usuario.creadoEn
      }
    });

  } catch (error) {
    console.error('[AUTH PROFILE ERROR]:', error.message);
    res.status(500).json({ error: 'Error interno al intentar recuperar el perfil del usuario.' });
  }
};

module.exports = {
  registrar,
  login,
  obtenerPerfil
};
