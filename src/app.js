// ==========================================
// CONFIGURACIÓN DE ENTORNO E IMPORTACIONES
// ==========================================
require('dotenv').config(); // Carga las variables del archivo .env
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./swagger/config'); // Configuración externa de Swagger

const app = express();

// ==========================================
// MIDDLEWARES DE SEGURIDAD Y LOGS
// ==========================================

// 1. MORGAN: Registra en consola las peticiones HTTP que entran (logs)
app.use(morgan('dev'));

const allowedConnectSrc = [
  "'self'",
  'http://localhost:3000',
  process.env.CORS_ORIGIN,
  'https://validator.swagger.io'
].filter(Boolean);

// 2. HELMET: Protege la API con cabeceras HTTP de seguridad
// CORREGIDO: Permite la carga de estilos y scripts internos que necesita Swagger UI
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", "https://cdnjs.cloudflare.com"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      imgSrc: ["'self'", "data:", "https://validator.swagger.io"],
      connectSrc: allowedConnectSrc
    }
  }
}));

// 3. CORS: Controla el acceso cruzado (permite que tu frontend se conecte al backend)
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// 4. RATE LIMITING: Limita peticiones repetitivas para evitar ataques de fuerza bruta / DDoS
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // Ventana de 15 minutos
  max: 100, // Máximo 100 peticiones por IP en ese período
  message: { error: 'Demasiadas peticiones. Espera 15 minutos e intenta nuevamente.' },
  standardHeaders: true 
});
app.use('/api/', limiter); // Aplica el límite solo a las rutas que empiezan con /api/

// 5. BODY PARSER: Permite que Express entienda datos en formato JSON nativo
app.use(express.json());

// 5.5. ARCHIVOS ESTÁTICOS: Sirve HTML, CSS, JS desde la carpeta 'public'
app.use(express.static('public'));

// 6. LOG PERSONALIZADO: Registra la hora exacta de cada petición en consola
app.use((req, res, next) => {
  const timestamp = new Date().toISOString().substring(11, 19);
  console.log(`[${timestamp}] ${req.method} ${req.path}`);
  next();
});

// ==========================================
// RUTAS DE LA API
// ==========================================

// Ruta raíz (Testeo rápido del estado de la API)
app.get('/', (req, res) => {
  res.json({
    mensaje: 'StudySync API funcionando',
    version: '1.0.0',
    endpoints: ['/api/sesiones', '/api/auth/register', '/api/auth/login', '/api-docs']
  });
});

// Enrutadores específicos mapeados
app.use('/api/sesiones', require('./routes/sesiones'));
app.use('/api/auth', require('./routes/auth'));

// ==========================================
// INTERFAZ GRÁFICA DE SWAGGER (DOCUMENTACIÓN)
// ==========================================
// NOTA: Se monta después de las rutas pero antes del manejador de errores global
app.use('/api-docs',
  swaggerUi.serve, 
  swaggerUi.setup(swaggerSpec, {
    customSiteTitle: 'StudySync API Docs',
    swaggerOptions: {
      persistAuthorization: true // Mantiene el token guardado aunque recargues la página
    }
  })
);

// ==========================================
// MANEJO DE ERRORES GLOBAL
// ==========================================
// Captura cualquier fallo imprevisto en los controladores y evita que la app se caiga
app.use((err, req, res, next) => {
  console.error('[ERROR GLOBAL]:', err.message);
  res.status(err.status || 500).json({
    error: err.message || 'Error interno del servidor',
    timestamp: new Date().toISOString(),
    ruta: req.path
  });
});

module.exports = app;


