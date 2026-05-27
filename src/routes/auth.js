// src/routes/auth.js
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const prisma = require('../db');
const autenticar = require('../middlewares/autenticar');

/**
 * POST /auth/register
 * Registra un nuevo usuario
 */
router.post('/register', async (req, res) => {
  try {
    const { nombre, email, password } = req.body;

    // Validar que los campos no estén vacíos
    if (!email || !password) {
      return res.status(400).json({ error: 'Email y password son requeridos' });
    }

    // Verificar si el usuario ya existe
    const existente = await prisma.usuario.findUnique({ 
      where: { email: email.toLowerCase() } 
    });
    if (existente) {
      return res.status(409).json({ error: 'Ya existe una cuenta con ese email' });
    }

    // Hashear la contraseña
    const hash = await bcrypt.hash(password, 12);

    // Crear el nuevo usuario
    const nuevoUsuario = await prisma.usuario.create({
      data: { 
        nombre: nombre || 'Usuario', 
        email: email.toLowerCase(), 
        password: hash 
      }
    });

    res.status(201).json({
      mensaje: 'Cuenta creada exitosamente',
      usuario: { 
        id: nuevoUsuario.id, 
        nombre: nuevoUsuario.nombre, 
        email: nuevoUsuario.email 
      }
    });
  } catch (error) {
    console.error('Error en registro:', error);
    res.status(500).json({ error: 'Error al registrar usuario' });
  }
});

/**
 * POST /auth/login
 * Inicia sesión y retorna un JWT
 */
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validar que los campos no estén vacíos
    if (!email || !password) {
      return res.status(400).json({ error: 'Email y password son requeridos' });
    }

    // Buscar el usuario por email
    const usuario = await prisma.usuario.findUnique({ 
      where: { email: email.toLowerCase() } 
    });

    // Verificar que el usuario existe y la contraseña es correcta
    if (!usuario || !(await bcrypt.compare(password, usuario.password))) {
      return res.status(401).json({ error: 'Email o contraseña incorrectos' });
    }

    // Generar JWT
    const token = jwt.sign(
      { id: usuario.id, email: usuario.email },
      process.env.JWT_SECRET || 'tu_secret_key_aqui',
      { expiresIn: '24h' }
    );

    res.json({
      mensaje: 'Sesión iniciada exitosamente',
      token,
      usuario: { 
        id: usuario.id, 
        nombre: usuario.nombre, 
        email: usuario.email 
      }
    });
  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ error: 'Error al iniciar sesión' });
  }
});

/**
 * GET /auth/perfil
 * Obtiene el perfil del usuario autenticado
 */
router.get('/perfil', autenticar, async (req, res) => {
  try {
    const usuario = await prisma.usuario.findUnique({
      where: { id: req.usuario.id }
    });

    if (!usuario) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    res.json({
      usuario: { 
        id: usuario.id, 
        nombre: usuario.nombre, 
        email: usuario.email,
        creadoEn: usuario.creadoEn
      }
    });
  } catch (error) {
    console.error('Error obteniendo perfil:', error);
    res.status(500).json({ error: 'Error al obtener perfil' });
  }
});

module.exports = router;