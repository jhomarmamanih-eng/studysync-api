require('dotenv').config();
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function createTables() {
  try {
    console.log('🔄 Creando tablas en Supabase...\n');
    
    // Crear tabla Usuario
    console.log('📝 Creando tabla Usuario...');
    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "Usuario" (
        id SERIAL PRIMARY KEY,
        nombre VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        "creadoEn" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('✓ Tabla Usuario creada');
    
    // Crear tabla Sesion
    console.log('📝 Creando tabla Sesion...');
    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "Sesion" (
        id SERIAL PRIMARY KEY,
        titulo VARCHAR(255) NOT NULL,
        descripcion TEXT,
        materia VARCHAR(255) DEFAULT 'General',
        "fechaHora" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        completada BOOLEAN DEFAULT FALSE,
        "creadaEn" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        "actualizadaEn" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        "usuarioId" INTEGER NOT NULL REFERENCES "Usuario"(id) ON DELETE CASCADE
      );
    `);
    console.log('✓ Tabla Sesion creada');
    
    // Crear índices
    console.log('📝 Creando índices...');
    await prisma.$executeRawUnsafe(`
      CREATE INDEX IF NOT EXISTS "Sesion_usuarioId_idx" ON "Sesion"("usuarioId");
    `);
    console.log('✓ Índices creados');
    
    console.log('\n✅ ¡Todas las tablas fueron creadas exitosamente!');
  } catch (error) {
    console.error('❌ Error creando tablas:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

createTables();
