// src/routes/auth.js
// Enrutador para operaciones de autenticación.
// Mapea los endpoints HTTP a las funciones correspondientes del AuthController.

const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/AuthController');
const autenticar = require('../middlewares/autenticar');

/**
 * @swagger
 * tags:
 *   name: Autenticación
 *   description: Operaciones de registro e inicio de sesión de estudiantes (JWT)
 */

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Registra un nuevo estudiante en el sistema StudySync
 *     tags: [Autenticación]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nombre
 *               - email
 *               - password
 *             properties:
 *               nombre:
 *                 type: string
 *                 example: Juan Perez
 *               email:
 *                 type: string
 *                 format: email
 *                 example: juan.perez@upds.edu
 *               password:
 *                 type: string
 *                 format: password
 *                 example: ContrasenaSegura2026!
 *     responses:
 *       201:
 *         description: Cuenta creada con éxito. Retorna la información básica del usuario.
 *       400:
 *         description: Faltan campos obligatorios.
 *       409:
 *         description: El correo electrónico ya se encuentra registrado.
 *       500:
 *         description: Error interno del servidor.
 */
router.post('/register', ctrl.registrar);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Inicia sesión y genera una firma JWT expirable en 2 horas
 *     tags: [Autenticación]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: juan.perez@upds.edu
 *               password:
 *                 type: string
 *                 format: password
 *                 example: ContrasenaSegura2026!
 *     responses:
 *       200:
 *         description: Sesión iniciada con éxito. Retorna el token JWT.
 *       400:
 *         description: Faltan campos obligatorios.
 *       401:
 *         description: Credenciales inválidas.
 *       500:
 *         description: Error interno del servidor.
 */
router.post('/login', ctrl.login);

/**
 * @swagger
 * /api/auth/perfil:
 *   get:
 *     summary: Recupera el perfil del estudiante autenticado actualmente
 *     tags: [Autenticación]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Perfil retornado exitosamente.
 *       401:
 *         description: Token no provisto o inválido.
 *       404:
 *         description: Perfil no localizado.
 *       500:
 *         description: Error interno del servidor.
 */
router.get('/perfil', autenticar, ctrl.obtenerPerfil);

module.exports = router;