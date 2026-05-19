const { Router } = require('express');
const router = Router();
const sesionesController = require('../controllers/sesionesController');

/**
 * @swagger
 * components:
 * schemas:
 * Sesion:
 * type: object
 * required:
 * - titulo
 * - fecha
 * properties:
 * id:
 * type: string
 * description: ID autogenerado de la sesión
 * titulo:
 * type: string
 * description: Título del grupo o tema de estudio
 * fecha:
 * type: string
 * format: date-time
 * description: Fecha programada para la sesión
 * example:
 * id: d5f82a9c
 * titulo: "Estudio de Kurt Lewin - Liderazgo"
 * fecha: "2026-05-20T18:00:00.000Z"
 */

/**
 * @swagger
 * /api/sesiones:
 * get:
 * summary: Obtiene la lista de todas las sesiones de estudio
 * tags: [Sesiones]
 * responses:
 * 200:
 * description: Lista de sesiones obtenida con éxito
 * content:
 * application/json:
 * schema:
 * type: object
 * properties:
 * ok:
 * type: boolean
 * total:
 * type: integer
 * datos:
 * type: array
 * items:
 * $ref: '#/components/schemas/Sesion'
 */
router.get('/', sesionesController.getSesiones);

/**
 * @swagger
 * /api/sesiones:
 * post:
 * summary: Crea una nueva sesión de estudio
 * tags: [Sesiones]
 * requestBody:
 * required: true
 * content:
 * application/json:
 * schema:
 * $ref: '#/components/schemas/Sesion'
 * responses:
 * 201:
 * description: Sesión creada correctamente
 * 400:
 * description: Error en los datos enviados
 */
router.post('/', sesionesController.createSesion);

// Repite la estructura para el resto de tus 5 endpoints (PUT, DELETE, GET por ID)

module.exports = router;