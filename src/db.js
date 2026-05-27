// src/db.js
// Exporta una única instancia de PrismaClient
// (crear múltiples instancias puede causar errores de 'too many connections')
const { PrismaClient } = require('./generated/prisma');
const prisma = new PrismaClient({
log: ['error', 'warn'], // Solo loguear errores y advertencias, no todas las queries
});
module.exports = prisma;