// src/server.js
// Punto de entrada principal — inicia el servidor HTTP
require('dotenv').config();
const app = require('./app');
const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
console.log('═══════════════════════════════════════════');
console.log(` StudySync API · http://localhost:${PORT}`);
console.log(` Modo: ${process.env.NODE_ENV || 'development'}`);
console.log('═══════════════════════════════════════════');
});
