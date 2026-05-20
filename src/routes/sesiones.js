const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/sesionesController');

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
 *     responses:
 *       201:
 *         description: Sesión creada correctamente
 *       400:
 *         description: Error en los datos enviados
 */
router.post ('/', ctrl.crear);

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
 *     responses:
 *       200:
 *         description: Sesión actualizada correctamente
 *       404:
 *         description: Sesión no encontrada
 */
router.put ('/:id', ctrl.actualizar);

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
 *     responses:
 *       200:
 *         description: Sesión eliminada correctamente
 *       404:
 *         description: Sesión no encontrada
 */
router.delete('/:id', ctrl.eliminar);

module.exports = router;