require('dotenv').config();
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function checkDatabase() {
  try {
    console.log('🔄 Verificando conexión y tablas en Supabase...\n');
    
    // Listar todas las tablas en el schema public
    const tables = await prisma.$queryRaw`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name;
    `;
    
    console.log('📊 Tablas en la base de datos:');
    if (tables.length === 0) {
      console.log('  ⚠️  No hay tablas. Las necesitas crear con: npx prisma db push');
    } else {
      tables.forEach(t => console.log(`  ✓ ${t.table_name}`));
    }
    
    console.log('\n✅ Conexión exitosa a Supabase');
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

checkDatabase();
