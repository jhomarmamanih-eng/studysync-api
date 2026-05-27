const express = require('express');
const router = express.Router();

// CORREGIDO: Importar con la mayúscula exacta 'SesionesController' para evitar fallos en Linux/despliegue
const ctrl = require('../controllers/SesionesController');

// CORREGIDO: Importar middleware de autenticación para proteger las rutas que requieren usuario autenticado
const autenticar = require('../middlewares/autenticar');

/**
 * @swagger
 * components:
 *   schemas:
 *     Sesion:
 *       type: object
 *       required:
 *         - titulo
 *         - fecha
 *       properties:
 *         id:
 *           type: string
 *           description: ID autogenerado de la sesión
 *         titulo:
 *           type: string
 *           description: Título del grupo o tema de estudio
 *         fecha:
 *           type: string
 *           format: date-time
 *           description: Fecha programada para la sesión
 *       example:
 *         id: d5f82a9c
 *         titulo: "Estudio de Kurt Lewin - Liderazgo"
 *         fecha: "2026-05-20T18:00:00.000Z"
 */

/**
 * @swagger
 * /api/sesiones:
 *   get:
 *     summary: Obtiene la lista de todas las sesiones de estudio
 *     tags: [Sesiones]
 *     responses:
 *       200:
 *         description: Lista de sesiones obtenida con éxito
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 ok:
 *                   type: boolean
 *                 total:
 *                   type: integer
 *                 datos:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Sesion'
 */
router.get ('/', ctrl.listar);

/**
 * @swagger
 * /api/sesiones/{id}:
 *   get:
 *     summary: Obtiene una sesión por su ID
 *     tags: [Sesiones]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID de la sesión
 *     responses:
 *       200:
 *         description: Sesión encontrada
 *       404:
 *         description: Sesión no encontrada
 */
router.get ('/:id', ctrl.obtenerUna);

/**
 * @swagger
 * /api/sesiones/usuario/{usuarioId}:
 *   get:
 *     summary: Obtiene las sesiones creadas por un usuario
 *     tags: [Sesiones]
 *     parameters:
 *       - in: path
 *         name: usuarioId
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID del usuario
 *     responses:
 *       200:
 *         description: Sesiones del usuario
 */
router.get('/usuario/:usuarioId', ctrl.listarPorUsuario);

/**
 * @swagger
 * /api/sesiones/count:
 *   get:
 *     summary: Devuelve el número total de sesiones
 *     tags: [Sesiones]
 *     responses:
 *       200:
 *         description: Conteo de sesiones
 */
router.get('/count', ctrl.contar);

/**
 * @swagger
 * /api/sesiones:
 *   post:
 *     summary: Crea una nueva sesión de estudio
 *     tags: [Sesiones]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Sesion'
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       201:
 *         description: Sesión creada correctamente
 *       400:
 *         description: Error en los datos enviados
 *       401:
 *         description: Acceso denegado. Se requiere autenticación por token Bearer.
 */
// CORREGIDO: Se añade 'autenticar' como middleware para asociar la sesión al usuario logueado
router.post ('/', autenticar, ctrl.crear);

/**
 * @swagger
 * /api/sesiones/{id}:
 *   put:
 *     summary: Actualiza una sesión
 *     tags: [Sesiones]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID de la sesión
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Sesion'
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Sesión actualizada correctamente
 *       401:
 *         description: Acceso denegado. Token no provisto o inválido.
 *       403:
 *         description: Operación prohibida. No tienes permisos sobre esta sesión.
 *       404:
 *         description: Sesión no encontrada
 */
// CORREGIDO: Se añade 'autenticar' como middleware para asegurar que solo el creador modifique la sesión
router.put ('/:id', autenticar, ctrl.actualizar);

/**
 * @swagger
 * /api/sesiones/{id}:
 *   delete:
 *     summary: Elimina una sesión
 *     tags: [Sesiones]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID de la sesión
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Sesión eliminada correctamente
 *       401:
 *         description: Acceso denegado. Token no provisto o inválido.
 *       403:
 *         description: Operación prohibida. No tienes permisos sobre esta sesión.
 *       404:
 *         description: Sesión no encontrada
 */
// CORREGIDO: Se añade 'autenticar' como middleware para asegurar que solo el creador pueda eliminar la sesión
router.delete('/:id', autenticar, ctrl.eliminar);

module.exports = router;
