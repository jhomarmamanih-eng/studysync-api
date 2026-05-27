// src/controllers/sesionesController.js — CON PRISMA (reemplazar archivo completo)
const prisma = require('../db');
const { pub } = require('../redis/client');
// ── GET /api/sesiones

const listar = async (req, res) => {
// findMany: equivale a SELECT * FROM sesiones
// include: hace un JOIN con la tabla usuarios para traer el nombre
const sesiones = await prisma.sesion.findMany({
include: { usuario: { select: { id: true, nombre: true, email: true } } },
orderBy: { creadaEn: 'desc' } // Las más recientes primero
});
res.json({ ok: true, total: sesiones.length, datos: sesiones });
};
// ── GET /api/sesiones/:id

const obtenerUna = async (req, res) => {
const id = parseInt(req.params.id);
const sesion = await prisma.sesion.findUnique({
where: { id },
include: { usuario: { select: { id: true, nombre: true } } }
});
if (!sesion) return res.status(404).json({ error: `Sesión ${id} no encontrada` });
res.json(sesion);
};
// ── POST /api/sesiones

const crear = async (req, res) => {
const { titulo, descripcion, fechaHora, materia } = req.body;
if (!titulo || titulo.trim() === '') {
return res.status(400).json({ error: 'El campo titulo es obligatorio' });
}
// create: equivale a INSERT INTO sesiones (titulo, ...) VALUES (...)
// req.usuario.id viene del middleware autenticar (el JWT decodificado)
const sesion = await prisma.sesion.create({
data: {
titulo: titulo.trim(),
descripcion: descripcion || '',
materia: materia || 'General',
fechaHora: fechaHora ? new Date(fechaHora) : new Date(),
usuarioId: req.usuario.id // Asociar la sesión al usuario logueado
},
include: { usuario: { select: { nombre: true } } }
});
// Publicar evento Redis
await pub.publish('study:sesion:creada', JSON.stringify({
tipo: 'sesion:creada',
payload: sesion,
timestamp: new Date().toISOString()
}));
res.status(201).json(sesion);
};
// ── PUT /api/sesiones/:id

const actualizar = async (req, res) => {
const id = parseInt(req.params.id);
// Verificar que la sesión existe Y pertenece al usuario logueado
const sesionExistente = await prisma.sesion.findUnique({ where: { id } });
if (!sesionExistente) return res.status(404).json({ error: 'Sesión no encontrada' });
if (sesionExistente.usuarioId !== req.usuario.id) {
return res.status(403).json({ error: 'No tienes permiso para modificar esta sesión' });
}
const { titulo, descripcion, materia, completada } = req.body;
const sesion = await prisma.sesion.update({
where: { id },
data: { titulo, descripcion, materia, completada }
});
res.json(sesion);
};
// ── DELETE /api/sesiones/:id

const eliminar = async (req, res) => {
const id = parseInt(req.params.id);
const sesionExistente = await prisma.sesion.findUnique({ where: { id } });
if (!sesionExistente) return res.status(404).json({ error: 'Sesión no encontrada' });
if (sesionExistente.usuarioId !== req.usuario.id) {
return res.status(403).json({ error: 'No tienes permiso para eliminar esta sesión' });
}
await prisma.sesion.delete({ where: { id } });
res.json({ ok: true, mensaje: `Sesión ${id} eliminada` });
};
// ── GET /api/sesiones/usuario/:usuarioId
const listarPorUsuario = async (req, res) => {
	const usuarioId = parseInt(req.params.usuarioId);
	if (isNaN(usuarioId)) return res.status(400).json({ error: 'usuarioId inválido' });
	const sesiones = await prisma.sesion.findMany({
		where: { usuarioId },
		include: { usuario: { select: { id: true, nombre: true } } },
		orderBy: { creadaEn: 'desc' }
	});
	res.json({ ok: true, total: sesiones.length, datos: sesiones });
};

// ── GET /api/sesiones/count
const contar = async (req, res) => {
	const total = await prisma.sesion.count();
	res.json({ ok: true, total });
};

module.exports = { listar, obtenerUna, crear, actualizar, eliminar, listarPorUsuario, contar };